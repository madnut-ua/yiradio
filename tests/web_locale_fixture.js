'use strict';

const ru = require('../locales/ru.json');
const uk = require('../locales/uk.json');
const catalogues = {ru, uk};

function jsonResponse(body) {
  return Promise.resolve({ok: true, json: () => Promise.resolve(body)});
}

function localeResponse(url) {
  if (url === '/api/locales') {
    return jsonResponse({
      schema: 1,
      locales: [{code: 'en', name: 'English'}, ...Object.values(catalogues)
        .map(({code, name}) => ({code, name}))],
    });
  }
  const code = /^\/api\/locale\?code=(ru|uk)$/.exec(url)?.[1];
  if (code) return jsonResponse({schema: 1, code, strings: catalogues[code].web});
  return null;
}

module.exports = {localeResponse, jsonResponse};
