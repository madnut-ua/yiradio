#include <assert.h>
#include <stdio.h>
#include <string.h>

#include "device_text.h"
#include "locale_fixture.h"

/* The cap the player's error line lives under. Duplicated rather than pulled
 * in: player_control_types.h drags in half the audio stack, and this is a
 * number, not a dependency. */
#define PLAYER_ERROR_MAX_LEN 64

static void test_every_id_has_a_key_and_english_fallback(void)
{
    for (int id = 0; id < DEVICE_TEXT_COUNT; ++id) {
        const char *key = device_text_key((device_text_id_t)id);
        const char *en = device_text_english((device_text_id_t)id);
        assert(key != NULL && key[0] != '\0');
        assert(en != NULL && en[0] != '\0' && strcmp(en, "?") != 0);
        assert(strcmp(device_text((device_text_id_t)id, DEVICE_LOCALE_INVALID), en) == 0);
    }
}

static void test_installed_catalogs_resolve_the_same_ids(void)
{
    assert(strcmp(device_text(DEVICE_TEXT_SOURCE_NONE, DEVICE_LANGUAGE_EN), "No source") == 0);
    assert(strcmp(device_text(DEVICE_TEXT_SOURCE_NONE, test_locale("ru")),
                  "Нет источника") == 0);
    assert(strcmp(device_text(DEVICE_TEXT_SOURCE_NONE, test_locale("uk")),
                  "Немає джерела") == 0);
}

static void test_named_arguments_are_inserted_literally(void)
{
    char out[64];
    const device_text_arg_t percent = {"percent", "45"};
    device_text_format(out, sizeof(out), DEVICE_TEXT_BUFFER_FORMAT,
                       test_locale("uk"), &percent, 1U);
    assert(strcmp(out, "Буфер 45%") == 0);

    const device_text_arg_t ssid = {"ssid", "%n {ssid}"};
    device_text_format(out, sizeof(out), DEVICE_TEXT_JOIN_NETWORK,
                       DEVICE_LANGUAGE_EN, &ssid, 1U);
    assert(strcmp(out, "join %n {ssid}") == 0);
    device_text_format(out, sizeof(out), DEVICE_TEXT_JOIN_NETWORK,
                       DEVICE_LANGUAGE_EN, NULL, 0U);
    assert(strcmp(out, "join ?") == 0);
}

static void test_truncation_preserves_utf8_in_templates_and_values(void)
{
    char out[9];
    device_text_format(out, 4U, DEVICE_TEXT_WEATHER_TODAY, test_locale("uk"), NULL, 0U);
    assert(strcmp(out, "С") == 0);

    const device_text_arg_t ssid = {"ssid", "Їж"};
    device_text_format(out, sizeof(out), DEVICE_TEXT_JOIN_NETWORK,
                       DEVICE_LANGUAGE_EN, &ssid, 1U);
    assert(strcmp(out, "join Ї") == 0);

    device_text_format(out, 1U, DEVICE_TEXT_JOIN_NETWORK, DEVICE_LANGUAGE_EN, &ssid, 1U);
    assert(out[0] == '\0');
    device_text_format(NULL, 0U, DEVICE_TEXT_JOIN_NETWORK, DEVICE_LANGUAGE_EN, &ssid, 1U);
}

static void test_the_error_lines_fit_the_snapshot(void)
{
    const device_language_t languages[] = {DEVICE_LANGUAGE_EN, test_locale("ru"), test_locale("uk")};
    for (int id = 0; id < DEVICE_TEXT_COUNT; ++id) {
        if (strncmp(device_text_key((device_text_id_t)id), "error_", 6U) != 0) continue;
        for (size_t i = 0U; i < sizeof(languages) / sizeof(*languages); ++i) {
            assert(strlen(device_text((device_text_id_t)id, languages[i])) < PLAYER_ERROR_MAX_LEN);
        }
    }
}

static void test_an_id_out_of_range_still_shows_something(void)
{
    const device_text_id_t bad = (device_text_id_t)DEVICE_TEXT_COUNT;
    assert(device_text_key(bad) == NULL && device_text_english(bad) == NULL);
    assert(strcmp(device_text(bad, DEVICE_LANGUAGE_EN), "?") == 0);
}

int main(void)
{
    test_every_id_has_a_key_and_english_fallback();
    test_installed_catalogs_resolve_the_same_ids();
    test_named_arguments_are_inserted_literally();
    test_truncation_preserves_utf8_in_templates_and_values();
    test_the_error_lines_fit_the_snapshot();
    test_an_id_out_of_range_still_shows_something();
    puts("device_text tests passed");
    return 0;
}
