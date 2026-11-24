#include "device_locale.h"

#include <ctype.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <sys/stat.h>

#include "cJSON.h"
#include "device_text.h"

#ifdef ESP_PLATFORM
#include "esp_heap_caps.h"
#include "esp_log.h"
#define LOCALE_WARN(...) ESP_LOGW("locale", __VA_ARGS__)
#else
#define LOCALE_WARN(...) ((void)0)
#endif

#define LOCALE_SCHEMA 1
#define LOCALE_ROOT_MAX 160U
#define LOCALE_INDEX_MAX 4096U
#define LOCALE_CATALOG_MAX (16U * 1024U)
#define LOCALE_TEXT_MAX 240U

typedef struct {
    const char *text[DEVICE_TEXT_COUNT];
    char storage[];
} locale_catalog_t;

typedef struct {
    char code[DEVICE_LOCALE_CODE_MAX];
    char name[DEVICE_LOCALE_NAME_MAX];
    _Atomic(locale_catalog_t *) catalog;
} locale_entry_t;

static locale_entry_t s_locales[DEVICE_LOCALE_LIMIT] = {
    {.code = "en", .name = "English"},
};
static size_t s_count = 1U;
static char s_root[LOCALE_ROOT_MAX];

static void *locale_alloc(size_t bytes)
{
#ifdef ESP_PLATFORM
    void *const external = heap_caps_malloc(bytes, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (external != NULL) return external;
#endif
    return malloc(bytes);
}

static bool ascii_lower(char c) { return c >= 'a' && c <= 'z'; }
static bool ascii_digit(char c) { return c >= '0' && c <= '9'; }
static bool ascii_alnum(char c) { return ascii_lower(c) || (c >= 'A' && c <= 'Z') || ascii_digit(c); }

bool device_locale_code_valid(const char *code)
{
    if (code == NULL || strlen(code) >= DEVICE_LOCALE_CODE_MAX) return false;
    size_t base = 0U;
    while (ascii_lower(code[base])) ++base;
    if (base < 2U || base > 3U) return false;
    const char *suffix = code + base;
    while (*suffix == '-') {
        ++suffix;
        size_t length = 0U;
        while (ascii_alnum(*suffix)) {
            ++length;
            ++suffix;
        }
        if (length < 2U || length > 8U) return false;
    }
    return *suffix == '\0';
}

static bool usable_text(const char *text, size_t max)
{
    if (text == NULL || text[0] == '\0' || strlen(text) > max) return false;
    bool has_text = false;
    for (const unsigned char *p = (const unsigned char *)text; *p != 0U;) {
        unsigned int c = *p++;
        if (c < 0x80U) {
            if (c < 0x20U || c == 0x7fU) return false;
            if (c != ' ') has_text = true;
            continue;
        }
        const unsigned int extra = c < 0xe0U ? 1U : c < 0xf0U ? 2U : 3U;
        if (c < 0xc2U || c > 0xf4U) return false;
        const unsigned int lowest = extra == 1U ? 0x80U : extra == 2U ? 0x800U : 0x10000U;
        c &= (1U << (6U - extra)) - 1U;
        for (unsigned int i = 0U; i < extra; ++i) {
            if ((*p & 0xc0U) != 0x80U) return false;
            c = (c << 6U) | (*p++ & 0x3fU);
        }
        if (c < lowest || c > 0x10ffffU || (c >= 0xd800U && c <= 0xdfffU) ||
            (c >= 0x80U && c < 0xa0U)) return false;
        if (c != 0xa0U) has_text = true;
    }
    return has_text;
}

/* cJSON allows much deeper nesting than a locale document needs, and escapes
 * for NUL that cannot be represented in its decoded C strings. */
static bool json_shape_bounded(const char *text, size_t size)
{
    unsigned int depth = 0U;
    bool quoted = false;
    for (size_t i = 0U; i < size; ++i) {
        const char c = text[i];
        if (quoted && c == '\\' && i + 1U < size) {
            if (size - i >= 6U && memcmp(text + i, "\\u0000", 6U) == 0) return false;
            ++i;
        } else if (c == '"') {
            quoted = !quoted;
        } else if (!quoted && (c == '[' || c == '{')) {
            if (++depth > 4U) return false;
        } else if (!quoted && (c == ']' || c == '}')) {
            if (depth == 0U) return false;
            --depth;
        }
    }
    return !quoted && depth == 0U;
}

static cJSON *read_json(const char *basename, size_t limit)
{
    if (s_root[0] == '\0') return NULL;
    char path[LOCALE_ROOT_MAX + 48U];
    snprintf(path, sizeof(path), "%s/%s", s_root, basename);
    FILE *file = fopen(path, "rb");
    if (file == NULL) return NULL;
    const long length = fseek(file, 0, SEEK_END) == 0 ? ftell(file) : -1;
    cJSON *doc = NULL;
    if (length > 0 && (size_t)length <= limit && fseek(file, 0, SEEK_SET) == 0) {
        const size_t size = (size_t)length;
        char *const text = locale_alloc(size + 1U);
        if (text != NULL) {
            if (fread(text, 1, size, file) == size && memchr(text, '\0', size) == NULL &&
                json_shape_bounded(text, size)) {
                text[size] = '\0';
                doc = cJSON_ParseWithLengthOpts(text, size + 1U, NULL, true);
            }
            free(text);
        }
    }
    fclose(file);
    const cJSON *const schema = cJSON_GetObjectItemCaseSensitive(doc, "schema");
    if (!cJSON_IsNumber(schema) || schema->valuedouble != LOCALE_SCHEMA) {
        cJSON_Delete(doc);
        return NULL;
    }
    return doc;
}

static bool pack_exists(const char *code, const char *part)
{
    char path[LOCALE_ROOT_MAX + 48U];
    snprintf(path, sizeof(path), "%s/locale-%s-%s.json", s_root, code, part);
    struct stat status;
    return stat(path, &status) == 0 && S_ISREG(status.st_mode) && status.st_size > 0;
}

void device_locale_init(const char *www_root)
{
    if (s_root[0] != '\0' || www_root == NULL || strlen(www_root) >= sizeof(s_root)) return;
    strcpy(s_root, www_root);
    cJSON *const doc = read_json("locales.json", LOCALE_INDEX_MAX);
    const cJSON *const list = cJSON_GetObjectItemCaseSensitive(doc, "locales");
    if (!cJSON_IsArray(list)) {
        LOCALE_WARN("no usable language index; using English");
    } else {
        const cJSON *item = NULL;
        cJSON_ArrayForEach(item, list) {
            const char *const code = cJSON_GetStringValue(cJSON_GetObjectItemCaseSensitive(item, "code"));
            const char *const name = cJSON_GetStringValue(cJSON_GetObjectItemCaseSensitive(item, "name"));
            if (!device_locale_code_valid(code) || !usable_text(name, DEVICE_LOCALE_NAME_MAX - 1U) ||
                device_locale_find(code) != DEVICE_LOCALE_INVALID) continue;
            if (!pack_exists(code, "device") || !pack_exists(code, "web")) {
                LOCALE_WARN("language package %s is incomplete", code);
                continue;
            }
            if (s_count == DEVICE_LOCALE_LIMIT) {
                LOCALE_WARN("too many languages in index");
                break;
            }
            strcpy(s_locales[s_count].code, code);
            strcpy(s_locales[s_count].name, name);
            ++s_count;
        }
    }
    cJSON_Delete(doc);
}

size_t device_locale_count(void) { return s_count; }

const char *device_locale_code(device_language_t language)
{
    return s_locales[language < s_count ? language : DEVICE_LANGUAGE_EN].code;
}

const char *device_locale_name(device_language_t language)
{
    return s_locales[language < s_count ? language : DEVICE_LANGUAGE_EN].name;
}

device_language_t device_locale_find(const char *code)
{
    if (!device_locale_code_valid(code)) return DEVICE_LOCALE_INVALID;
    for (size_t i = 0U; i < s_count; ++i) {
        if (strcasecmp(s_locales[i].code, code) == 0) return (device_language_t)i;
    }
    return DEVICE_LOCALE_INVALID;
}

static bool placeholder_exists(const char *text, const char *name, size_t length)
{
    while ((text = strchr(text, '{')) != NULL) {
        ++text;
        const char *const end = strchr(text, '}');
        if (end == NULL) return false;
        if ((size_t)(end - text) == length && memcmp(text, name, length) == 0) return true;
        text = end + 1;
    }
    return false;
}

static bool placeholders_match(const char *text, const char *reference)
{
    for (; *text != '\0'; ++text) {
        if (*text == '}') return false;
        if (*text != '{') continue;
        const char *const name = text + 1;
        text = name;
        while (ascii_alnum(*text) || *text == '_') ++text;
        if (text == name || *text != '}' ||
            !placeholder_exists(reference, name, (size_t)(text - name))) return false;
    }
    return true;
}

static const char *catalog_entry(const cJSON *strings, size_t i)
{
    const char *const key = device_text_key((device_text_id_t)i);
    if (key == NULL) return NULL;
    const char *const text = cJSON_GetStringValue(cJSON_GetObjectItemCaseSensitive(strings, key));
    const char *const en = device_text_english((device_text_id_t)i);
    return usable_text(text, LOCALE_TEXT_MAX) &&
           placeholders_match(text, en) && placeholders_match(en, text) ? text : NULL;
}

bool device_locale_prepare(device_language_t language)
{
    if (language == DEVICE_LANGUAGE_EN) return true;
    if (language >= s_count) return false;
    locale_entry_t *const entry = &s_locales[language];
    if (atomic_load(&entry->catalog) != NULL) return true;

    char filename[48];
    snprintf(filename, sizeof(filename), "locale-%s-device.json", entry->code);
    cJSON *const doc = read_json(filename, LOCALE_CATALOG_MAX);
    const char *const code = cJSON_GetStringValue(cJSON_GetObjectItemCaseSensitive(doc, "code"));
    const cJSON *const strings = cJSON_GetObjectItemCaseSensitive(doc, "strings");
    if (code == NULL || strcmp(code, entry->code) != 0 || !cJSON_IsObject(strings)) {
        cJSON_Delete(doc);
        LOCALE_WARN("cannot load %s; using English", filename);
        return false;
    }

    size_t bytes = sizeof(locale_catalog_t);
    for (size_t i = 0U; i < DEVICE_TEXT_COUNT; ++i) {
        const char *const text = catalog_entry(strings, i);
        if (text != NULL) bytes += strlen(text) + 1U;
    }
    locale_catalog_t *const catalog = locale_alloc(bytes);
    if (catalog != NULL) {
        char *next = catalog->storage;
        for (size_t i = 0U; i < DEVICE_TEXT_COUNT; ++i) {
            const char *const text = catalog_entry(strings, i);
            catalog->text[i] = text != NULL ? next : NULL;
            if (text != NULL) {
                const size_t length = strlen(text) + 1U;
                memcpy(next, text, length);
                next += length;
            }
        }
        /* These strings can be used by tasks holding older settings snapshots.
         * Keep only compact, validated catalogs, loaded on first use, until reboot. */
        locale_catalog_t *expected = NULL;
        if (!atomic_compare_exchange_strong(&entry->catalog, &expected, catalog)) free(catalog);
    } else {
        LOCALE_WARN("not enough memory for language %s", entry->code);
    }
    cJSON_Delete(doc);
    return catalog != NULL;
}

device_language_t device_locale_resolve(const char *code)
{
    const device_language_t language = device_locale_find(code);
    if (device_locale_prepare(language)) return language;
    if (language == DEVICE_LOCALE_INVALID) LOCALE_WARN("language %s unavailable", code);
    return DEVICE_LANGUAGE_EN;
}

device_language_t device_locale_next(device_language_t current)
{
    for (size_t i = 1U; i <= s_count; ++i) {
        const device_language_t next = (device_language_t)((current + i) % s_count);
        if (device_locale_prepare(next)) return next;
    }
    return DEVICE_LANGUAGE_EN;
}

const char *device_locale_text(device_language_t language, size_t text_index,
                               const char *english)
{
    if (language == DEVICE_LANGUAGE_EN || language >= s_count ||
        text_index >= DEVICE_TEXT_COUNT) return english;
    const locale_catalog_t *const catalog = atomic_load(&s_locales[language].catalog);
    return catalog != NULL && catalog->text[text_index] != NULL ? catalog->text[text_index] : english;
}
