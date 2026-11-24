#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <time.h>

#define DEVICE_TIMEZONE_ID_MAX 64
#define DEVICE_TIMEZONE_DEFAULT_ID "Europe/Kyiv"

typedef struct {
    const char *id;
    uint16_t rule;
} device_timezone_t;

const char *device_timezone_version(void);
size_t device_timezone_count(void);
const device_timezone_t *device_timezone_at(size_t index);
/* Accepts canonical names, IANA links, and the previous lowercase IDs. */
const device_timezone_t *device_timezone_find(const char *id);
/* Returns the canonical row for an ID, or count for an unknown ID. */
size_t device_timezone_index_of(const char *id);
/* Converts instants in the device clock's supported era (since 2020). */
bool device_timezone_localtime(const device_timezone_t *zone, time_t utc, struct tm *local);
