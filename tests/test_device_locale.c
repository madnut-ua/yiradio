#include "device_locale.h"
#include "device_text.h"

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

static void write_file(const char *dir, const char *name, const char *data)
{
    char path[256];
    assert(snprintf(path, sizeof(path), "%s/%s", dir, name) < (int)sizeof(path));
    FILE *const file = fopen(path, "wb");
    assert(file != NULL);
    assert(fputs(data, file) >= 0);
    assert(fclose(file) == 0);
}

int main(void)
{
    assert(device_locale_resolve("de") == DEVICE_LANGUAGE_EN);
    char dir[240];
    const char *const root = getenv("TEST_LOCALES_WWW");
    assert(root != NULL);
    assert(snprintf(dir, sizeof(dir), "%s/fixture", root) < (int)sizeof(dir));
    assert(mkdir(dir, 0700) == 0);
    write_file(dir, "locales.json",
               "{\"schema\":1,\"locales\":[{\"code\":\"de\",\"name\":\"Deutsch\"},"
               "{\"code\":\"fr\",\"name\":\"Français\"},{\"code\":\"it\",\"name\":\"Italiano\"}]}");
    char catalog[1024];
    const int used = snprintf(catalog, sizeof(catalog),
                              "{\"schema\":1,\"code\":\"de\",\"strings\":{\"%s\":\"Einstellungen\","
                              "\"%s\":\" \",\"%s\":\"Puffer {bad}\"}}",
                              device_text_key(DEVICE_TEXT_SETTINGS),
                              device_text_key(DEVICE_TEXT_ROW_LANGUAGE),
                              device_text_key(DEVICE_TEXT_BUFFER_FORMAT));
    assert(used > 0 && (size_t)used < sizeof(catalog));
    write_file(dir, "locale-de-device.json", catalog);
    write_file(dir, "locale-de-web.json", "{\"schema\":1,\"code\":\"de\",\"strings\":{}}");
    write_file(dir, "locale-fr-device.json", "{\"schema\":2,\"code\":\"fr\",\"strings\":{}}");
    write_file(dir, "locale-fr-web.json", "{\"schema\":1,\"code\":\"fr\",\"strings\":{}}");
    device_locale_init(dir);

    assert(device_locale_find("it") == DEVICE_LOCALE_INVALID);
    assert(device_locale_find("../de") == DEVICE_LOCALE_INVALID);
    assert(device_locale_resolve("fr") == DEVICE_LANGUAGE_EN);
    const device_language_t de = device_locale_resolve("de");
    assert(de != DEVICE_LANGUAGE_EN);
    assert(strcmp(device_text(DEVICE_TEXT_SETTINGS, de), "Einstellungen") == 0);
    assert(strcmp(device_text(DEVICE_TEXT_ROW_LANGUAGE, de), "Language") == 0);
    assert(strcmp(device_text(DEVICE_TEXT_ROW_HOME_SCREEN, de), "Home screen") == 0);
    assert(strcmp(device_text(DEVICE_TEXT_BUFFER_FORMAT, de),
                  device_text_english(DEVICE_TEXT_BUFFER_FORMAT)) == 0);
    assert(device_locale_next(de) == DEVICE_LANGUAGE_EN);
    puts("device locale tests passed");
    return 0;
}
