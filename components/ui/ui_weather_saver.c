#include "ui_weather_saver.h"

#include <stdio.h>

#include "device_text.h"

static bool known(int value)
{
    return value != WEATHER_UNKNOWN;
}

static void empty(char *out, size_t size)
{
    if (out != NULL && size > 0U) out[0] = '\0';
}

static void format_number(char *out, size_t size, device_text_id_t id,
                          device_language_t language, const char *name, int value)
{
    char number[12];
    snprintf(number, sizeof(number), "%d", value);
    const device_text_arg_t arg = {name, number};
    device_text_format(out, size, id, language, &arg, 1U);
}

void ui_wx_temperature_text(char *out, size_t size, int celsius)
{
    if (out == NULL || size == 0U) return;
    if (celsius == WEATHER_UNKNOWN) {
        empty(out, size);
    } else if (celsius > 0) {
        snprintf(out, size, "+%d\xC2\xB0", celsius);
    } else if (celsius < 0) {
        snprintf(out, size, "\xE2\x80\x93%d\xC2\xB0", -celsius);
    } else {
        snprintf(out, size, "0\xC2\xB0");
    }
}

void ui_wx_feels_text(char *out, size_t size, device_language_t language,
                      const weather_report_t *report, bool brief)
{
    if (out == NULL || size == 0U) return;
    if (report == NULL || !known(report->feels_like_c)) {
        empty(out, size);
        return;
    }
    char degrees[16];
    ui_wx_temperature_text(degrees, sizeof(degrees), report->feels_like_c);
    const device_text_arg_t arg = {"temperature", degrees};
    device_text_format(out, size,
                       brief ? DEVICE_TEXT_WEATHER_FEELS_BRIEF : DEVICE_TEXT_WEATHER_FEELS,
                       language, &arg, 1U);
}

void ui_wx_humidity_text(char *out, size_t size, const weather_report_t *report)
{
    if (out == NULL || size == 0U) return;
    if (report == NULL || !known(report->humidity_pct)) {
        empty(out, size);
        return;
    }
    snprintf(out, size, "%d%%", report->humidity_pct);
}

void ui_wx_pressure_text(char *out, size_t size, device_language_t language,
                         const weather_report_t *report)
{
    if (out == NULL || size == 0U) return;
    if (report == NULL || !known(report->pressure_mmhg)) {
        empty(out, size);
        return;
    }
    format_number(out, size, DEVICE_TEXT_WEATHER_PRESSURE_VALUE, language,
                  "value", report->pressure_mmhg);
}

void ui_wx_wind_text(char *out, size_t size, device_language_t language,
                     const weather_report_t *report, bool point_shown)
{
    static const device_text_id_t directions[] = {
        DEVICE_TEXT_WEATHER_WIND_N, DEVICE_TEXT_WEATHER_WIND_NE,
        DEVICE_TEXT_WEATHER_WIND_E, DEVICE_TEXT_WEATHER_WIND_SE,
        DEVICE_TEXT_WEATHER_WIND_S, DEVICE_TEXT_WEATHER_WIND_SW,
        DEVICE_TEXT_WEATHER_WIND_W, DEVICE_TEXT_WEATHER_WIND_NW,
    };
    if (out == NULL || size == 0U) return;
    if (report == NULL || !known(report->wind_ms)) {
        empty(out, size);
        return;
    }
    if (report->wind_ms == 0) {
        device_text_format(out, size, DEVICE_TEXT_WEATHER_WIND_CALM, language, NULL, 0U);
        return;
    }
    const int point = point_shown ? weather_wind_point(report->wind_from_deg) : -1;
    if (point < 0) {
        format_number(out, size, DEVICE_TEXT_WEATHER_WIND_VALUE, language,
                      "speed", report->wind_ms);
    } else {
        char speed[12];
        snprintf(speed, sizeof(speed), "%d", report->wind_ms);
        const device_text_arg_t args[] = {
            {"speed", speed},
            {"direction", device_text(directions[point], language)},
        };
        device_text_format(out, size, DEVICE_TEXT_WEATHER_WIND_DIRECTION_VALUE, language,
                           args, sizeof(args) / sizeof(*args));
    }
}

void ui_wx_wind_label(char *out, size_t size, device_language_t language,
                      const weather_report_t *report)
{
    if (out == NULL || size == 0U) return;
    if (report != NULL && known(report->wind_gust_ms) && known(report->wind_ms) &&
        report->wind_gust_ms > report->wind_ms) {
        format_number(out, size, DEVICE_TEXT_WEATHER_WIND_GUSTS, language,
                      "speed", report->wind_gust_ms);
    } else {
        device_text_format(out, size, DEVICE_TEXT_WEATHER_WIND, language, NULL, 0U);
    }
}

void ui_wx_clock_text(char *out, size_t size, int minutes)
{
    if (out == NULL || size == 0U) return;
    if (minutes == WEATHER_UNKNOWN || minutes < 0 || minutes >= 24 * 60) {
        empty(out, size);
        return;
    }
    snprintf(out, size, "%02d:%02d", minutes / 60, minutes % 60);
}

static void format_rain(char *out, size_t size, device_language_t language, int tenths)
{
    if (tenths <= 0) {
        device_text_format(out, size, DEVICE_TEXT_WEATHER_NO_RAIN, language, NULL, 0U);
        return;
    }
    char whole[12];
    const char fraction[] = {(char)('0' + tenths % 10), '\0'};
    snprintf(whole, sizeof(whole), "%d", tenths / 10);
    const device_text_arg_t args[] = {{"whole", whole}, {"fraction", fraction}};
    device_text_format(out, size, DEVICE_TEXT_WEATHER_RAIN, language,
                       args, sizeof(args) / sizeof(*args));
}

void ui_wx_sky_text(char *out, size_t size, device_language_t language,
                    const weather_report_t *report)
{
    if (out == NULL || size == 0U) return;
    const bool have_clouds = report != NULL && known(report->cloud_pct);
    const bool have_rain = report != NULL && known(report->precipitation_tenths_mm);
    if (have_clouds && have_rain) {
        char clouds[64];
        char rain[64];
        format_number(clouds, sizeof(clouds), DEVICE_TEXT_WEATHER_CLOUDS, language,
                      "percent", report->cloud_pct);
        format_rain(rain, sizeof(rain), language, report->precipitation_tenths_mm);
        const device_text_arg_t args[] = {{"clouds", clouds}, {"rain", rain}};
        device_text_format(out, size, DEVICE_TEXT_WEATHER_SKY, language,
                           args, sizeof(args) / sizeof(*args));
    } else if (have_clouds) {
        format_number(out, size, DEVICE_TEXT_WEATHER_CLOUDS, language,
                      "percent", report->cloud_pct);
    } else if (have_rain) {
        format_rain(out, size, language, report->precipitation_tenths_mm);
    } else {
        empty(out, size);
    }
}

void ui_wx_day_name(char *out, size_t size, device_language_t language, int index,
                    const weather_day_t *day)
{
    static const device_text_id_t weekdays[] = {
        DEVICE_TEXT_WEEKDAY_SHORT_SUNDAY,    DEVICE_TEXT_WEEKDAY_SHORT_MONDAY,
        DEVICE_TEXT_WEEKDAY_SHORT_TUESDAY,   DEVICE_TEXT_WEEKDAY_SHORT_WEDNESDAY,
        DEVICE_TEXT_WEEKDAY_SHORT_THURSDAY,  DEVICE_TEXT_WEEKDAY_SHORT_FRIDAY,
        DEVICE_TEXT_WEEKDAY_SHORT_SATURDAY,
    };
    if (out == NULL || size == 0U) return;
    if (index == 0) {
        device_text_format(out, size, DEVICE_TEXT_WEATHER_TODAY, language, NULL, 0U);
    } else if (day == NULL || !day->valid || day->weekday > 6U) {
        empty(out, size);
    } else {
        device_text_format(out, size, weekdays[day->weekday], language, NULL, 0U);
    }
}

void ui_wx_day_range_text(char *out, size_t size, const weather_day_t *day, bool degree,
                          bool one_plus)
{
    if (out == NULL || size == 0U) return;
    if (day == NULL || !day->valid) {
        empty(out, size);
        return;
    }
    char low[16];
    char high[16];
    ui_wx_temperature_text(low, sizeof(low), day->min_c);
    ui_wx_temperature_text(high, sizeof(high), day->max_c);
    // The degree sign once, after the pair: "+2…+12°".
    size_t low_length = 0U;
    while (low[low_length] != '\0') ++low_length;
    if (low_length >= 2U && (unsigned char)low[low_length - 2U] == 0xC2U &&
        (unsigned char)low[low_length - 1U] == 0xB0U) {
        low[low_length - 2U] = '\0';
    }
    if (!degree) {
        size_t high_length = 0U;
        while (high[high_length] != '\0') ++high_length;
        if (high_length >= 2U && (unsigned char)high[high_length - 2U] == 0xC2U &&
            (unsigned char)high[high_length - 1U] == 0xB0U) {
            high[high_length - 2U] = '\0';
        }
    }
    const bool drop_plus = one_plus && day->min_c > 0 && day->max_c > 0 && high[0] == '+';
    snprintf(out, size, "%s\xE2\x80\xA6%s", low, drop_plus ? high + 1 : high);
}

void ui_wx_day_chance_text(char *out, size_t size, const weather_day_t *day)
{
    if (out == NULL || size == 0U) return;
    if (day == NULL || !day->valid || !known(day->precipitation_pct)) {
        empty(out, size);
        return;
    }
    snprintf(out, size, "%d%%", day->precipitation_pct);
}

void ui_wx_shift(uint32_t step, int range, int *dx, int *dy)
{
    int x = 0;
    int y = 0;
    if (range > 0) {
        const uint32_t lap = (uint32_t)range * 4U;
        const int at = (int)(step % lap);
        if (at < range) {
            x = at;
        } else if (at < range * 2) {
            x = range;
            y = at - range;
        } else if (at < range * 3) {
            x = range - (at - range * 2);
            y = range;
        } else {
            y = range - (at - range * 3);
        }
    }
    if (dx != NULL) *dx = x;
    if (dy != NULL) *dy = y;
}
