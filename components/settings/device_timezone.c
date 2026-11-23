#ifndef _POSIX_C_SOURCE
#define _POSIX_C_SOURCE 200809L
#endif

#include "device_timezone.h"

#include <stdint.h>
#include <string.h>

typedef struct {
    uint8_t kind;
    uint16_t day;
    uint8_t week, weekday;
    int32_t seconds;
} tz_date_t;

typedef struct {
    int32_t standard, dst;
    tz_date_t start, end;
} tz_footer_t;

typedef struct {
    uint16_t first, count;
    int32_t initial_offset;
    bool initial_dst;
    int16_t footer;
} tz_rule_t;

typedef struct {
    const char *id;
    uint16_t index;
} tz_alias_t;

#include "device_timezone_data.inc"

_Static_assert(sizeof(k_zones) / sizeof(*k_zones) < UINT16_MAX, "timezone index");

size_t device_timezone_count(void)
{
    return TZDB_CANONICAL_COUNT;
}

const char *device_timezone_version(void)
{
    return TZDB_VERSION;
}

const device_timezone_t *device_timezone_at(size_t index)
{
    return index < TZDB_CANONICAL_COUNT ? &k_zones[index] : NULL;
}

const device_timezone_t *device_timezone_find(const char *id)
{
    if (id == NULL) return NULL;
    size_t lo = 0, hi = TZDB_CANONICAL_COUNT;
    while (lo < hi) {
        const size_t mid = lo + (hi - lo) / 2;
        const int cmp = strcmp(id, k_zones[mid].id);
        if (cmp == 0) return &k_zones[mid];
        if (cmp < 0) hi = mid;
        else lo = mid + 1;
    }
    lo = 0;
    hi = sizeof(k_tz_aliases) / sizeof(*k_tz_aliases);
    while (lo < hi) {
        const size_t mid = lo + (hi - lo) / 2;
        const int cmp = strcmp(id, k_tz_aliases[mid].id);
        if (cmp == 0) return &k_zones[k_tz_aliases[mid].index];
        if (cmp < 0) hi = mid;
        else lo = mid + 1;
    }
    for (size_t i = TZDB_CANONICAL_COUNT; i < sizeof(k_zones) / sizeof(*k_zones); ++i) {
        if (strcmp(id, k_zones[i].id) == 0) return &k_zones[i];
    }
    return NULL;
}

size_t device_timezone_index_of(const char *id)
{
    const device_timezone_t *zone = device_timezone_find(id);
    if (zone == NULL) return TZDB_CANONICAL_COUNT;
    const size_t index = (size_t)(zone - k_zones);
    return index < TZDB_CANONICAL_COUNT ? index : k_tz_legacy_targets[index - TZDB_CANONICAL_COUNT];
}

static bool is_leap(int64_t year)
{
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

static int64_t january_day(int64_t year)
{
    const int64_t y = year - 1;
    return 365 * (year - 1970) + y / 4 - y / 100 + y / 400 - (1969 / 4 - 1969 / 100 + 1969 / 400);
}

static int64_t transition(const tz_date_t *rule, int64_t year, int32_t old_offset)
{
    static const uint16_t month_start[] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
    int64_t day = january_day(year);
    if (rule->kind == 3) {
        const unsigned month = rule->day;
        const int64_t first = day + month_start[month - 1] + (month > 2 && is_leap(year));
        const int64_t next = day + month_start[month] + (month >= 2 && is_leap(year));
        day = first + (rule->weekday + 7 - (first + 4) % 7) % 7 + 7 * (rule->week - 1);
        if (day >= next) day -= 7;
    } else {
        day += rule->day;
        if (rule->kind == 2) day += (is_leap(year) && rule->day >= 60) - 1;
    }
    return day * 86400 + rule->seconds - old_offset;
}

static bool footer_offset(const tz_footer_t *footer, time_t utc, int64_t after,
                          int32_t *offset, bool *dst)
{
    if (footer->start.kind == 0) {
        *dst = false;
        *offset = footer->standard;
    } else {
        struct tm date;
        if (gmtime_r(&utc, &date) == NULL) return false;
        const int64_t year = (int64_t)date.tm_year + 1900;
        int64_t latest = after;
        bool found = false;
        // Signed transition times and large offsets can move a rule across New Year.
        for (int64_t y = year - 1; y <= year + 1; ++y) {
            const int64_t start = transition(&footer->start, y, footer->standard);
            const int64_t end = transition(&footer->end, y, footer->dst);
            if (start <= utc && start > latest) {
                latest = start;
                *dst = true;
                found = true;
            }
            if (end <= utc && end > latest) {
                latest = end;
                *dst = false;
                found = true;
            }
        }
        if (found) *offset = *dst ? footer->dst : footer->standard;
    }
    return true;
}

bool device_timezone_localtime(const device_timezone_t *zone, time_t utc, struct tm *local)
{
    if (zone == NULL || local == NULL || utc < TZDB_SINCE) return false;
    const tz_rule_t *rule = &k_tz_rules[zone->rule];
    int32_t offset = rule->initial_offset;
    bool dst = rule->initial_dst;
    const int64_t elapsed = (int64_t)utc - TZDB_SINCE;
    size_t lo = rule->first, hi = lo + rule->count;
    const size_t end = hi;
    while (lo < hi) {
        const size_t mid = lo + (hi - lo) / 2;
        if (k_tz_dates[mid] <= elapsed) lo = mid + 1;
        else hi = mid;
    }
    int64_t after = INT64_MIN;
    if (lo > rule->first) {
        const int32_t packed = k_tz_offsets[lo - 1];
        dst = (packed & 1) != 0;
        offset = (packed - dst) / 2;
        after = (int64_t)TZDB_SINCE + k_tz_dates[lo - 1];
    }
    // The last explicit type stays in force until the next recurring event.
    if (rule->footer >= 0 && lo == end && utc > after &&
        !footer_offset(&k_tz_footers[rule->footer], utc, after, &offset, &dst)) {
        return false;
    }
    if (offset > 0 && (int64_t)utc > INT64_MAX - offset) return false;
    const int64_t shifted = (int64_t)utc + offset;
    const time_t stamp = (time_t)shifted;
    if ((int64_t)stamp != shifted || gmtime_r(&stamp, local) == NULL) return false;
    local->tm_isdst = dst;
    return true;
}
