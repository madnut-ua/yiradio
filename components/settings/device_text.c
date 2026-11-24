#include "device_text.h"

#include <stdbool.h>
#include <string.h>

#include "device_locale.h"

typedef struct {
    const char *key;
    const char *english;
} device_text_entry_t;

/* Keys are part of the on-disk catalog format; keep them stable when the
 * English copy, enum order or C identifier changes. */
static const device_text_entry_t k_text[] = {
    [DEVICE_TEXT_SOURCE_NONE] = {"source_none", "No source"},
    [DEVICE_TEXT_SOURCE_INTERNET_RADIO] = {"source_internet_radio", "Internet radio"},
    [DEVICE_TEXT_SOURCE_USB] = {"source_usb", "USB player"},
    [DEVICE_TEXT_SOURCE_SD] = {"source_sd", "SD card"},
    [DEVICE_TEXT_SOURCE_YANDEX] = {"source_yandex", "Ya.Music"},
    [DEVICE_TEXT_SOURCE_DLNA] = {"source_dlna", "DLNA"},
    [DEVICE_TEXT_SOURCE_FM] = {"source_fm", "FM radio"},
    [DEVICE_TEXT_SOURCE_BLUETOOTH] = {"source_bluetooth", "Bluetooth"},
    [DEVICE_TEXT_SOURCE_UNKNOWN] = {"source_unknown", "Unknown mode"},
    [DEVICE_TEXT_YANDEX_LONG] = {"yandex_long", "Yandex Music"},

    [DEVICE_TEXT_STATE_STOPPED] = {"state_stopped", "Stopped"},
    [DEVICE_TEXT_STATE_CONNECTING] = {"state_connecting", "Connecting"},
    [DEVICE_TEXT_STATE_PLAYING] = {"state_playing", "Playing"},
    [DEVICE_TEXT_STATE_PAUSED] = {"state_paused", "Paused"},
    [DEVICE_TEXT_STATE_RECONNECTING] = {"state_reconnecting", "Reconnecting"},
    [DEVICE_TEXT_STATE_ERROR] = {"state_error", "Error"},
    [DEVICE_TEXT_STATE_UNKNOWN] = {"state_unknown", "Unknown state"},

    [DEVICE_TEXT_SETTINGS] = {"settings", "Settings"},
    [DEVICE_TEXT_GROUP_LANGUAGE] = {"group_language", "Language"},
    [DEVICE_TEXT_GROUP_GENERAL] = {"group_general", "General"},
    [DEVICE_TEXT_GROUP_SOUND] = {"group_sound", "Sound"},
    [DEVICE_TEXT_GROUP_DISPLAY] = {"group_display", "Display"},
    [DEVICE_TEXT_ROW_LANGUAGE] = {"row_language", "Language"},
    [DEVICE_TEXT_ROW_HOME_SCREEN] = {"row_home_screen", "Home screen"},
    [DEVICE_TEXT_HOME_SCREEN_LIST] = {"home_screen_list", "List"},
    [DEVICE_TEXT_HOME_SCREEN_FEED] = {"home_screen_feed", "Feed"},
    [DEVICE_TEXT_ROW_SCROLL] = {"row_scroll", "Scrolling"},
    [DEVICE_TEXT_SCROLL_BOUNCE] = {"scroll_bounce", "Back and forth"},
    [DEVICE_TEXT_SCROLL_LEFT] = {"scroll_left", "Leftwards"},
    [DEVICE_TEXT_ROW_BUFFER_VIEW] = {"row_buffer_view", "Buffer"},
    [DEVICE_TEXT_BUFFER_VIEW_TEXT] = {"buffer_view_text", "Text"},
    [DEVICE_TEXT_BUFFER_VIEW_GRAPH] = {"buffer_view_graph", "Graph"},
    [DEVICE_TEXT_ROW_AUTOPLAY] = {"row_autoplay", "Autoplay"},
    [DEVICE_TEXT_ROW_FILES_END] = {"row_files_end", "End of folder"},
    [DEVICE_TEXT_FILES_END_STOP] = {"files_end_stop", "Stop"},
    [DEVICE_TEXT_FILES_END_REPEAT] = {"files_end_repeat", "Start over"},
    [DEVICE_TEXT_ROW_YANDEX] = {"row_yandex", "Yandex Music"},
    [DEVICE_TEXT_ROW_WEATHER] = {"row_weather", "Weather"},
    [DEVICE_TEXT_ROW_BT_OUTPUT] = {"row_bt_output", "Sound over Bluetooth"},
    [DEVICE_TEXT_ROW_DLNA] = {"row_dlna", "DLNA"},
    [DEVICE_TEXT_ROW_BRIGHTNESS] = {"row_brightness", "Brightness"},
    [DEVICE_TEXT_ROW_VOLUME_STEP] = {"row_volume_step", "Volume step"},
    [DEVICE_TEXT_ROW_TONE_BASS] = {"row_tone_bass", "Bass"},
    [DEVICE_TEXT_ROW_TONE_TREBLE] = {"row_tone_treble", "Treble"},
    [DEVICE_TEXT_ROW_BALANCE] = {"row_balance", "Balance"},
    [DEVICE_TEXT_BALANCE_LEFT] = {"balance_left", "L"},
    [DEVICE_TEXT_BALANCE_RIGHT] = {"balance_right", "R"},
    [DEVICE_TEXT_ROW_LOUDNESS] = {"row_loudness", "Loudness"},
    [DEVICE_TEXT_LOUDNESS_WEAK] = {"loudness_weak", "weak"},
    [DEVICE_TEXT_LOUDNESS_MEDIUM] = {"loudness_medium", "medium"},
    [DEVICE_TEXT_LOUDNESS_STRONG] = {"loudness_strong", "strong"},
    [DEVICE_TEXT_ROW_LOUDNESS_TREBLE] = {"row_loudness_treble", "Treble lift"},
    [DEVICE_TEXT_ROW_LEVEL_NORMALIZE] = {"row_level_normalize", "Even volume"},
    [DEVICE_TEXT_ROW_SOFT_START] = {"row_soft_start", "Soft start"},
    [DEVICE_TEXT_ROW_FM_GAIN] = {"row_fm_gain", "FM level"},
    [DEVICE_TEXT_ROW_SPDIF_OUTPUT] = {"row_spdif_output", "Sound over S/PDIF"},
    [DEVICE_TEXT_LEVEL_MEASURING] = {"level_measuring", "…"},
    [DEVICE_TEXT_LEVEL_CAPPED] = {"level_capped", "max"},
    [DEVICE_TEXT_ROW_SLEEP_TIMER] = {"row_sleep_timer", "Sleep timer"},
    [DEVICE_TEXT_ROW_ALARM] = {"row_alarm", "Alarm"},
    [DEVICE_TEXT_ROW_ALARM_OFF] = {"row_alarm_off", "Switch-off"},
    [DEVICE_TEXT_ROW_BT_SPEAKER] = {"row_bt_speaker", "BT speaker"},
    [DEVICE_TEXT_ROW_SCREENSAVER] = {"row_screensaver", "Screensaver"},
    [DEVICE_TEXT_SCREENSAVER_OFF] = {"screensaver_off", "None"},
    [DEVICE_TEXT_SCREENSAVER_DIM] = {"screensaver_dim", "Dim"},
    [DEVICE_TEXT_SCREENSAVER_BLANK] = {"screensaver_blank", "Blank"},
    [DEVICE_TEXT_SCREENSAVER_CLOCK] = {"screensaver_clock", "Clock"},
    [DEVICE_TEXT_SCREENSAVER_WEATHER] = {"screensaver_weather", "Weather"},
    [DEVICE_TEXT_ROW_FLIP_VERTICAL] = {"row_flip_vertical", "Flip vertically"},
    [DEVICE_TEXT_ROW_FLIP_HORIZONTAL] = {"row_flip_horizontal", "Flip horizontally"},
    [DEVICE_TEXT_ROW_INVERT_COLORS] = {"row_invert_colors", "Invert colours"},
    [DEVICE_TEXT_ROW_THEME] = {"row_theme", "Theme"},
    [DEVICE_TEXT_THEME_STANDARD] = {"theme_standard", "Standard"},
    [DEVICE_TEXT_THEME_CONTRAST] = {"theme_contrast", "Contrast"},
    [DEVICE_TEXT_THEME_CUSTOM] = {"theme_custom", "Custom"},
    [DEVICE_TEXT_ROW_WEB_ADDRESS] = {"row_web_address", "QR on press"},
    [DEVICE_TEXT_ROW_ABOUT] = {"row_about", "About"},
    [DEVICE_TEXT_ON] = {"on", "on"},
    [DEVICE_TEXT_OFF] = {"off", "off"},

    [DEVICE_TEXT_BRAND] = {"brand", "yiRadio"},
    [DEVICE_TEXT_ABOUT_TITLE] = {"about_title", "About"},
    [DEVICE_TEXT_ABOUT_FIRMWARE] = {"about_firmware", "Firmware"},
    [DEVICE_TEXT_ABOUT_BUILD] = {"about_build", "Build"},
    [DEVICE_TEXT_ABOUT_COMPILER] = {"about_compiler", "Compiler"},
    [DEVICE_TEXT_ABOUT_BUILT] = {"about_built", "Built"},
    [DEVICE_TEXT_ABOUT_WEB] = {"about_web", "Web UI"},
    [DEVICE_TEXT_ABOUT_UNKNOWN] = {"about_unknown", "unknown"},
    [DEVICE_TEXT_ABOUT_MISMATCH] = {"about_mismatch", "Web UI is from another build"},
    [DEVICE_TEXT_ABOUT_IDF] = {"about_idf", "ESP-IDF"},
    [DEVICE_TEXT_PRESS_TO_RETURN] = {"press_to_return", "Press to return"},

    [DEVICE_TEXT_STATIONS] = {"stations", "Stations"},
    [DEVICE_TEXT_BUFFER] = {"buffer", "Buffer"},
    [DEVICE_TEXT_BUFFER_FORMAT] = {"buffer_format", "Buffer {percent}%"},
    [DEVICE_TEXT_BUFFER_UNKNOWN] = {"buffer_unknown", "Buffer --"},
    [DEVICE_TEXT_CHOOSE_TRACK] = {"choose_track", "Choose a track"},
    [DEVICE_TEXT_BLUETOOTH_PAIRING] = {"bluetooth_pairing", "Find {name} in the phone's Bluetooth"},
    [DEVICE_TEXT_CHOOSE_FILE] = {"choose_file", "Choose a file"},
    [DEVICE_TEXT_OPENING_FILE] = {"opening_file", "Opening the file"},
    [DEVICE_TEXT_SEARCHING_SERVER] = {"searching_server", "Looking for a media server"},
    [DEVICE_TEXT_NO_SERVER_FOUND] = {"no_server_found", "No media server on the network"},
    [DEVICE_TEXT_DLNA_SERVER_LIST] = {"dlna_server_list", "Media servers"},
    [DEVICE_TEXT_NO_NETWORK] = {"no_network", "No network — see Settings"},
    [DEVICE_TEXT_JOIN_NETWORK] = {"join_network", "join {ssid}"},
    [DEVICE_TEXT_WIFI_CONNECTING] = {"wifi_connecting", "connecting to Wi-Fi..."},
    [DEVICE_TEXT_WAITING_NETWORK] = {"waiting_network", "Waiting for network..."},
    [DEVICE_TEXT_DATA_NOT_FLASHED] = {"data_not_flashed", "flash the LittleFS partition"},
    [DEVICE_TEXT_NOT_AVAILABLE_YET] = {"not_available_yet", "Not available yet"},
    [DEVICE_TEXT_SETTINGS_READ_FAILED] = {"settings_read_failed", "Cannot read settings.csv"},
    [DEVICE_TEXT_SETTINGS_WRITE_FAILED] = {"settings_write_failed", "Cannot write settings.csv"},
    [DEVICE_TEXT_STATION_START_FAILED] = {"station_start_failed", "The station would not start"},
    [DEVICE_TEXT_ARTIST_WAVE_NOTE] = {"artist_wave_note", "alike"},

    [DEVICE_TEXT_INSERT_USB] = {"insert_usb", "Insert a USB drive"},
    [DEVICE_TEXT_INSERT_CARD] = {"insert_card", "Insert a memory card"},
    [DEVICE_TEXT_USB_UNREADABLE] = {"usb_unreadable", "The drive will not read. FAT32 is needed"},
    [DEVICE_TEXT_CARD_UNREADABLE] = {"card_unreadable", "The card will not read. FAT32 is needed"},
    [DEVICE_TEXT_USB_EMPTY] = {"usb_empty", "The drive holds no files"},
    [DEVICE_TEXT_CARD_EMPTY] = {"card_empty", "The card holds no files"},

    /* error_* entries must fit the player's 64-byte field including NUL. */
    [DEVICE_TEXT_ERROR_STATION_FAILED] = {"error_station_failed", "Could not connect to the station"},
    [DEVICE_TEXT_ERROR_BLUETOOTH_MODULE] = {"error_bluetooth_module",
                                           "The Bluetooth module does not answer"},
    [DEVICE_TEXT_ERROR_FILE_FAILED] = {"error_file_failed", "Could not play the file"},
    [DEVICE_TEXT_ERROR_NOTHING_TO_RESUME] = {"error_nothing_to_resume",
                                            "Nothing to resume - choose something"},
    [DEVICE_TEXT_ERROR_FOLDER_FAILED] = {"error_folder_failed", "The folder would not open"},
    [DEVICE_TEXT_ERROR_BT_MODULE_OLD] = {"error_bt_module_old", "Update the Bluetooth module's firmware"},
    [DEVICE_TEXT_ERROR_YANDEX_SUBSCRIPTION] = {"error_yandex_subscription",
                                              "A Yandex Music subscription is needed"},
    [DEVICE_TEXT_ERROR_YANDEX_REFRESH] = {"error_yandex_refresh", "Refresh the stations"},
    [DEVICE_TEXT_ERROR_BAD_COMMAND] = {"error_bad_command", "Malformed command"},
    [DEVICE_TEXT_ERROR_DEVICE_BUSY] = {"error_device_busy", "The device is busy"},
    [DEVICE_TEXT_ERROR_FM_TUNER] = {"error_fm_tuner", "The FM tuner does not answer"},

    [DEVICE_TEXT_YANDEX_NOT_LINKED] = {"yandex_not_linked", "Account not linked"},
    [DEVICE_TEXT_YANDEX_LINKED] = {"yandex_linked", "Account linked"},
    [DEVICE_TEXT_YANDEX_ENTER_CODE] = {"yandex_enter_code", "Enter the code on the site"},
    [DEVICE_TEXT_YANDEX_REQUESTING] = {"yandex_requesting", "Requesting a code..."},
    [DEVICE_TEXT_YANDEX_SECONDS_LEFT] = {"yandex_seconds_left", "{seconds} s left"},
    [DEVICE_TEXT_YANDEX_CODE_EXPIRED] = {"yandex_code_expired", "The code expired"},
    [DEVICE_TEXT_YANDEX_DENIED] = {"yandex_denied", "Sign-in was not confirmed"},
    [DEVICE_TEXT_YANDEX_NO_CONNECTION] = {"yandex_no_connection", "No connection to Yandex"},
    [DEVICE_TEXT_YANDEX_SERVER_ERROR] = {"yandex_server_error", "Server error"},
    [DEVICE_TEXT_YANDEX_SAVE_FAILED] = {"yandex_save_failed", "Could not save"},
    [DEVICE_TEXT_YANDEX_LOADING] = {"yandex_loading", "Loading stations..."},
    [DEVICE_TEXT_YANDEX_LIST_FAILED] = {"yandex_list_failed", "Could not fetch the stations"},
    [DEVICE_TEXT_YANDEX_LIST_EMPTY] = {"yandex_list_empty", "No stations"},
    [DEVICE_TEXT_HINT_BACK] = {"hint_back", "hold - back"},
    [DEVICE_TEXT_HINT_CANCEL] = {"hint_cancel", "hold - cancel"},
    [DEVICE_TEXT_HINT_LISTEN] = {"hint_listen", "OK - listen, hold - back"},
    [DEVICE_TEXT_HINT_RETRY] = {"hint_retry", "OK - retry, hold - back"},
    [DEVICE_TEXT_HINT_REFRESH] = {"hint_refresh", "OK - refresh, hold - back"},
    [DEVICE_TEXT_HINT_LINK] = {"hint_link", "OK - link, hold - back"},
    [DEVICE_TEXT_DB_SHORT] = {"db_short", "dB"},
    [DEVICE_TEXT_QUICK_LOUDNESS] = {"quick_loudness", "Loudness"},
    [DEVICE_TEXT_QUICK_LEVEL_NUDGE] = {"quick_level_nudge", "Station"},
    [DEVICE_TEXT_MINUTES_SHORT] = {"minutes_short", "min"},
    [DEVICE_TEXT_SECONDS_SHORT] = {"seconds_short", "s"},

    [DEVICE_TEXT_FM_MHZ] = {"fm_mhz", "MHz"},
    [DEVICE_TEXT_FM_STEREO] = {"fm_stereo", "Stereo"},
    [DEVICE_TEXT_FM_MONO] = {"fm_mono", "Mono"},
    [DEVICE_TEXT_FM_SIGNAL] = {"fm_signal", "signal"},
    [DEVICE_TEXT_FM_SEEKING] = {"fm_seeking", "Seeking…"},
    [DEVICE_TEXT_FM_SCANNING] = {"fm_scanning", "Scanning…"},
    [DEVICE_TEXT_FM_SEEK_UP] = {"fm_seek_up", "Seek up"},
    [DEVICE_TEXT_FM_SEEK_DOWN] = {"fm_seek_down", "Seek down"},
    [DEVICE_TEXT_FM_SCAN] = {"fm_scan", "Scan FM"},
    [DEVICE_TEXT_FM_SAVE] = {"fm_save", "Save preset"},
    [DEVICE_TEXT_FM_TUNING] = {"fm_tuning", "Tuning by hand"},
    [DEVICE_TEXT_STRIP_LIST] = {"strip_list", "List"},
    [DEVICE_TEXT_STRIP_SEEK] = {"strip_seek", "Seek"},
    [DEVICE_TEXT_STRIP_TUNE] = {"strip_tune", "Tune"},
    [DEVICE_TEXT_STRIP_EXIT] = {"strip_exit", "Exit"},
    [DEVICE_TEXT_FM_PRESET_ADDED] = {"fm_preset_added", "Added to the list"},
    [DEVICE_TEXT_FM_PRESET_ALREADY] = {"fm_preset_already", "Already in the list"},
    [DEVICE_TEXT_FM_PRESET_FULL] = {"fm_preset_full", "The list is full"},
    [DEVICE_TEXT_OTA_TITLE] = {"ota_title", "Firmware update"},
    [DEVICE_TEXT_OTA_WRITING] = {"ota_writing", "Writing"},
    [DEVICE_TEXT_OTA_PRESS] = {"ota_press", "Press the encoder to install"},
    [DEVICE_TEXT_OTA_OTHER_CANCELS] = {"ota_other_cancels", "Any other button cancels"},
    [DEVICE_TEXT_OTA_RESTARTING] = {"ota_restarting", "Restarting…"},

    [DEVICE_TEXT_DATE_SHORT] = {"date_short", "{day} {month}"},
    [DEVICE_TEXT_DATE_FULL] = {"date_full", "{weekday}, {day} {month}"},
    [DEVICE_TEXT_MONTH_JANUARY] = {"month_january", "January"},
    [DEVICE_TEXT_MONTH_FEBRUARY] = {"month_february", "February"},
    [DEVICE_TEXT_MONTH_MARCH] = {"month_march", "March"},
    [DEVICE_TEXT_MONTH_APRIL] = {"month_april", "April"},
    [DEVICE_TEXT_MONTH_MAY] = {"month_may", "May"},
    [DEVICE_TEXT_MONTH_JUNE] = {"month_june", "June"},
    [DEVICE_TEXT_MONTH_JULY] = {"month_july", "July"},
    [DEVICE_TEXT_MONTH_AUGUST] = {"month_august", "August"},
    [DEVICE_TEXT_MONTH_SEPTEMBER] = {"month_september", "September"},
    [DEVICE_TEXT_MONTH_OCTOBER] = {"month_october", "October"},
    [DEVICE_TEXT_MONTH_NOVEMBER] = {"month_november", "November"},
    [DEVICE_TEXT_MONTH_DECEMBER] = {"month_december", "December"},
    [DEVICE_TEXT_WEEKDAY_SUNDAY] = {"weekday_sunday", "Sunday"},
    [DEVICE_TEXT_WEEKDAY_MONDAY] = {"weekday_monday", "Monday"},
    [DEVICE_TEXT_WEEKDAY_TUESDAY] = {"weekday_tuesday", "Tuesday"},
    [DEVICE_TEXT_WEEKDAY_WEDNESDAY] = {"weekday_wednesday", "Wednesday"},
    [DEVICE_TEXT_WEEKDAY_THURSDAY] = {"weekday_thursday", "Thursday"},
    [DEVICE_TEXT_WEEKDAY_FRIDAY] = {"weekday_friday", "Friday"},
    [DEVICE_TEXT_WEEKDAY_SATURDAY] = {"weekday_saturday", "Saturday"},
    [DEVICE_TEXT_WEEKDAY_SHORT_SUNDAY] = {"weekday_short_sunday", "Sun"},
    [DEVICE_TEXT_WEEKDAY_SHORT_MONDAY] = {"weekday_short_monday", "Mon"},
    [DEVICE_TEXT_WEEKDAY_SHORT_TUESDAY] = {"weekday_short_tuesday", "Tue"},
    [DEVICE_TEXT_WEEKDAY_SHORT_WEDNESDAY] = {"weekday_short_wednesday", "Wed"},
    [DEVICE_TEXT_WEEKDAY_SHORT_THURSDAY] = {"weekday_short_thursday", "Thu"},
    [DEVICE_TEXT_WEEKDAY_SHORT_FRIDAY] = {"weekday_short_friday", "Fri"},
    [DEVICE_TEXT_WEEKDAY_SHORT_SATURDAY] = {"weekday_short_saturday", "Sat"},

    [DEVICE_TEXT_WEATHER_NONE] = {"weather_none", "no weather"},
    [DEVICE_TEXT_WEATHER_TODAY] = {"weather_today", "Today"},
    [DEVICE_TEXT_WEATHER_HUMIDITY] = {"weather_humidity", "humidity"},
    [DEVICE_TEXT_WEATHER_PRESSURE] = {"weather_pressure", "pressure"},
    [DEVICE_TEXT_WEATHER_PRESSURE_VALUE] = {"weather_pressure_value", "{value} mmHg"},
    [DEVICE_TEXT_WEATHER_FEELS] = {"weather_feels", "feels like {temperature}"},
    [DEVICE_TEXT_WEATHER_FEELS_BRIEF] = {"weather_feels_brief", "feels {temperature}"},
    [DEVICE_TEXT_WEATHER_WIND] = {"weather_wind", "wind"},
    [DEVICE_TEXT_WEATHER_WIND_CALM] = {"weather_wind_calm", "calm"},
    [DEVICE_TEXT_WEATHER_WIND_VALUE] = {"weather_wind_value", "{speed} m/s"},
    [DEVICE_TEXT_WEATHER_WIND_DIRECTION_VALUE] = {"weather_wind_direction_value",
                                                 "{speed} m/s {direction}"},
    [DEVICE_TEXT_WEATHER_WIND_GUSTS] = {"weather_wind_gusts", "wind, gusts {speed}"},
    [DEVICE_TEXT_WEATHER_WIND_N] = {"weather_wind_n", "N"},
    [DEVICE_TEXT_WEATHER_WIND_NE] = {"weather_wind_ne", "NE"},
    [DEVICE_TEXT_WEATHER_WIND_E] = {"weather_wind_e", "E"},
    [DEVICE_TEXT_WEATHER_WIND_SE] = {"weather_wind_se", "SE"},
    [DEVICE_TEXT_WEATHER_WIND_S] = {"weather_wind_s", "S"},
    [DEVICE_TEXT_WEATHER_WIND_SW] = {"weather_wind_sw", "SW"},
    [DEVICE_TEXT_WEATHER_WIND_W] = {"weather_wind_w", "W"},
    [DEVICE_TEXT_WEATHER_WIND_NW] = {"weather_wind_nw", "NW"},
    [DEVICE_TEXT_WEATHER_CLOUDS] = {"weather_clouds", "clouds {percent}%"},
    [DEVICE_TEXT_WEATHER_NO_RAIN] = {"weather_no_rain", "no rain"},
    [DEVICE_TEXT_WEATHER_RAIN] = {"weather_rain", "rain {whole}.{fraction} mm"},
    [DEVICE_TEXT_WEATHER_SKY] = {"weather_sky", "{clouds} · {rain}"},
};

_Static_assert(sizeof(k_text) / sizeof(k_text[0]) == DEVICE_TEXT_COUNT,
               "every text ID needs a catalog row");

const char *device_text_key(device_text_id_t id)
{
    return (size_t)id < DEVICE_TEXT_COUNT ? k_text[id].key : NULL;
}

const char *device_text_english(device_text_id_t id)
{
    return (size_t)id < DEVICE_TEXT_COUNT ? k_text[id].english : NULL;
}

const char *device_text(device_text_id_t id, device_language_t language)
{
    const char *english = device_text_english(id);
    return english != NULL ? device_locale_text(language, (size_t)id, english) : "?";
}

static bool continuation(unsigned char byte)
{
    return (byte & 0xC0U) == 0x80U;
}

/* A template is validated by the catalog loader; external arguments such as
 * a Bluetooth name or SSID may still contain invalid UTF-8. */
static size_t utf8_width(const unsigned char *text, size_t length)
{
    const unsigned char lead = text[0];
    if (lead < 0x80U) return 1U;
    if (lead < 0xC2U || lead > 0xF4U || length < 2U || !continuation(text[1])) return 0U;
    if (lead < 0xE0U) return 2U;
    if (length < 3U || !continuation(text[2])) return 0U;
    if (lead < 0xF0U) {
        return (lead == 0xE0U && text[1] < 0xA0U) ||
               (lead == 0xEDU && text[1] > 0x9FU) ? 0U : 3U;
    }
    if (length < 4U || !continuation(text[3])) return 0U;
    return (lead == 0xF0U && text[1] < 0x90U) ||
           (lead == 0xF4U && text[1] > 0x8FU) ? 0U : 4U;
}

static bool append_utf8(char **out, size_t *room, const char *text, size_t length)
{
    while (length > 0U) {
        const size_t width = utf8_width((const unsigned char *)text, length);
        const size_t count = width != 0U ? width : 1U;
        if (count > *room) return false;
        if (width != 0U) {
            memcpy(*out, text, count);
        } else {
            **out = '?';
        }
        *out += count;
        *room -= count;
        text += count;
        length -= count;
    }
    return true;
}

static const char *find_argument(const char *name, size_t length, const device_text_arg_t *args,
                                 size_t arg_count)
{
    for (size_t i = 0; args != NULL && i < arg_count; ++i) {
        if (args[i].name != NULL && args[i].value != NULL &&
            strlen(args[i].name) == length && memcmp(args[i].name, name, length) == 0) {
            return args[i].value;
        }
    }
    return "?";
}

void device_text_format(char *out, size_t out_size, device_text_id_t id,
                        device_language_t language, const device_text_arg_t *args,
                        size_t arg_count)
{
    if (out == NULL || out_size == 0U) return;
    size_t room = out_size - 1U;
    const char *text = device_text(id, language);
    while (*text != '\0' && room > 0U) {
        const char *name = strchr(text, '{');
        if (name == NULL) {
            append_utf8(&out, &room, text, strlen(text));
            break;
        }
        if (!append_utf8(&out, &room, text, (size_t)(name - text))) break;
        const char *end = strchr(++name, '}');
        if (end == NULL) break; /* Not reachable for a validated template. */
        const char *value = find_argument(name, (size_t)(end - name), args, arg_count);
        if (!append_utf8(&out, &room, value, strlen(value))) break;
        text = end + 1;
    }
    *out = '\0';
}
