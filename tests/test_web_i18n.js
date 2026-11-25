'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {localeResponse, jsonResponse} = require('./web_locale_fixture');

const source = fs.readFileSync('data/www/i18n.js', 'utf8');
const defaults = JSON.parse(source.match(/const ENGLISH = (\{[\s\S]+?\n  \});/)[1]);
const markers = {'data-i18n-aria': 'aria-label', 'data-i18n-title': 'title',
                 'data-i18n-placeholder': 'placeholder'};
const decode = (text) => text.replace(/&(amp|quot|lt|gt|#39);/g, (_, key) =>
  ({amp: '&', quot: '"', lt: '<', gt: '>', '#39': "'"})[key]);

function load(fetch, document = {}) {
  const window = {
    fetch,
    localStorage: {
      getItem() { throw new Error('device language must not use browser storage'); },
      setItem() { throw new Error('device language must not use browser storage'); },
    },
  };
  vm.runInNewContext(source, {window, document});
  return window.jradioI18n;
}

function verifyEnglishMarkup() {
  for (const page of ['index', 'playlist', 'remote', 'settings']) {
    const html = fs.readFileSync(`data/www/${page}.html`, 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.doesNotMatch(html, /\p{Script=Cyrillic}/u);
    const pageKey = html.match(/<body[^>]+data-i18n-page="([^"]+)"/)[1];
    assert.equal(html.match(/<title>([^<]*)<\/title>/)[1], defaults[pageKey]);
    assert.doesNotMatch(html, /<body[^>]*data-i18n-title=/);
    for (const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/gi)) {
      assert.equal(decode(match[3]), defaults[match[2]], `${page}: ${match[2]}`);
    }
    for (const [marker, attr] of Object.entries(markers)) {
      const tags = html.matchAll(new RegExp(`<[^<>]*\\s${marker}="([^"]+)"[^<>]*>`, 'g'));
      for (const [tag, key] of tags) {
        const attrValue = tag.match(new RegExp(`\\s${attr}="([^"]*)"`));
        if (attrValue) assert.equal(decode(attrValue[1]), defaults[key], `${page}: ${key}`);
        else assert.ok(defaults[key], `${page}: ${key}`);
      }
    }
    for (const [, key] of html.matchAll(/\bdata-i18n(?:-aria|-title|-placeholder|-page)?="([^"]+)"/g)) {
      assert.ok(defaults[key], `${page}: missing ${key}`);
    }
  }
  for (const script of fs.readdirSync('data/www').filter((file) => file.endsWith('.js'))) {
    const text = fs.readFileSync(`data/www/${script}`, 'utf8');
    for (const [, key] of text.matchAll(/\bt\('([a-z0-9_.]+)'/g)) {
      assert.ok(defaults[key], `${script}: missing ${key}`);
    }
  }
  assert.match(fs.readFileSync('data/www/settings.html', 'utf8'),
    /<select id="device-language"[^>]*disabled>\s*<option value="en">English<\/option>\s*<\/select>/);
}

async function verifySuppliedTranslations() {
  const i18n = load(localeResponse);
  for (const code of ['ru', 'uk']) {
    const {strings} = await (await localeResponse(`/api/locale?code=${code}`)).json();
    await i18n.setLanguage(code);
    assert.equal(i18n.language(), code);
    for (const [key, text] of Object.entries(strings)) {
      assert.ok(Object.hasOwn(defaults, key), `${code}: unrecognized translation key ${key}`);
      assert.equal(i18n.t(key), text, `${code}: invalid translation for ${key}`);
    }
  }
}

async function verifyLoadingAndFallback() {
  const queued = new Map();
  const node = {
    getAttribute: () => 'nav.settings',
    setAttribute(attribute, value) { this[attribute] = value; },
  };
  const document = {
    documentElement: {},
    body: {getAttribute: () => 'title.settings'},
    querySelectorAll: (selector) => ['[data-i18n]', '[data-i18n-aria]'].includes(selector) ? [node] : [],
  };
  const i18n = load((url) => new Promise((resolve) => {
    assert.ok(!queued.has(url), `duplicate request for ${url}`);
    queued.set(url, resolve);
  }), document);
  const changes = [];
  i18n.onChange((code) => changes.push(code));
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(document.title, 'yiRadio — settings');
  assert.equal(node.textContent, 'Settings');

  const answer = (code, body) => {
    const path = `/api/locale?code=${code}`;
    queued.get(path)(jsonResponse(body));
    queued.delete(path);
  };
  const ru = i18n.setLanguage('ru');
  assert.equal(i18n.setLanguage('ru'), ru);
  const uk = i18n.setLanguage('uk');
  const markup = '<em>Налаштування</em>';
  answer('uk', {schema: 1, code: 'uk', strings: {
    'brand.name': 'їРадіо',
    'title.settings': 'їРадіо — налаштування',
    'nav.settings': markup,
    'sleep.minutes': '{n} хв',
    'update.sending': '{extra}%',
    'player.no_stream_info': ' ',
    'player.untitled': null,
    'player.like': 'X'.repeat(4100),
    'player.dislike': '\0bad',
    'remote.press': 'Натисніть {{function}}',
    'backup.confirm': 'Без параметра',
    'update.files': '{web}, {app}: ',
    'extra.key': 'Unknown',
  }});
  await uk;
  assert.equal(document.documentElement.lang, 'uk');
  assert.equal(document.title, 'їРадіо — налаштування');
  assert.equal(i18n.t('brand.name'), 'їРадіо');
  assert.equal(i18n.t('sleep.minutes', {n: 5}), '5 хв');
  assert.equal(i18n.t('update.files', {app: 'radio.bin', web: 'www.tar'}), 'www.tar, radio.bin: ');
  assert.equal(node.textContent, markup); // No interpretation as HTML.
  assert.equal(node['aria-label'], markup);
  assert.equal(i18n.t('nav.player'), 'Player'); // Absent from this older pack.
  for (const key of ['update.sending', 'player.no_stream_info', 'player.untitled',
                     'player.like', 'player.dislike', 'remote.press', 'backup.confirm']) {
    assert.equal(i18n.t(key), defaults[key], key);
  }
  assert.equal(i18n.t('extra.key'), '');
  answer('ru', {schema: 1, code: 'ru', strings: {'nav.settings': 'Настройки'}});
  await ru;
  assert.deepEqual(changes, ['uk']);

  const invalid = i18n.setLanguage('pt-BR');
  answer('pt-BR', {schema: 2, code: 'pt-BR', strings: {}});
  await invalid;
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(node.textContent, 'Settings');

  const stale = i18n.setLanguage('ru');
  await i18n.setLanguage('en');
  answer('ru', {schema: 1, code: 'ru', strings: {'nav.settings': 'Настройки'}});
  await stale;
  assert.deepEqual(changes, ['uk', 'en']);
  await i18n.setLanguage('../ru');
  assert.equal(queued.size, 0);
}

async function verifyLocaleIndex() {
  const i18n = load((url) => {
    assert.equal(url, '/api/locales');
    return jsonResponse({schema: 1, locales: [
      {code: 'en', name: 'External English'}, {code: 'pt-BR', name: 'Português'},
      {code: 'pt-BR', name: 'Duplicate'}, {code: 'uk', name: 'Українська'},
      {code: '../ru', name: 'Invalid'}, {code: 'ru', name: ''},
    ]});
  });
  assert.deepEqual(JSON.parse(JSON.stringify(await i18n.loadLocales())), [
    {code: 'en', name: 'English'}, {code: 'pt-BR', name: 'Português'},
    {code: 'uk', name: 'Українська'},
  ]);
}

async function verifyFlasher() {
  const packs = ['ru', 'uk'].map((code) =>
    JSON.parse(fs.readFileSync(`flasher/locales/${code}.json`, 'utf8')));
  const window = {
    localStorage: {getItem: () => null},
    fetch: (url) => jsonResponse(url === 'locales/index.json'
      ? {schema: 1, locales: packs.map(({code, name}) => ({code, name}))}
      : packs.find(({code}) => url === `locales/${code}.json`)),
  };
  const document = {addEventListener: (_, start) => { document.start = start; }, readyState: 'loading'};
  vm.runInNewContext(fs.readFileSync('flasher/i18n.js', 'utf8'), {window, document});
  const i18n = window.jradioI18n;
  assert.equal(i18n.language(), 'en');
  for (const page of ['flasher', 'index']) {
    const html = fs.readFileSync(`flasher/${page}.html`, 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.doesNotMatch(html, /\p{Script=Cyrillic}/u);
    for (const [, key] of html.matchAll(/\bdata-i18n(?:-aria|-title|-placeholder|-page)?="([^"]+)"/g)) {
      assert.ok(i18n.t(key), `${page}: missing English label ${key}`);
    }
  }
  await document.start();
  for (const {code, strings} of packs) {
    await i18n.setLanguage(code);
    assert.equal(i18n.language(), code);
    for (const [key, text] of Object.entries(strings)) {
      assert.equal(i18n.t(key), text, `${code}: invalid translation for ${key}`);
    }
  }
}

(async () => {
  verifyEnglishMarkup();
  await verifySuppliedTranslations();
  await verifyLoadingAndFallback();
  await verifyLocaleIndex();
  await verifyFlasher();
  console.log('web i18n tests passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
