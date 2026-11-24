#pragma once

#include <stdbool.h>
#include <stddef.h>

#include "device_language.h"

#define DEVICE_LOCALE_CODE_MAX 16U
#define DEVICE_LOCALE_NAME_MAX 48U
#define DEVICE_LOCALE_LIMIT 16U
#define DEVICE_LOCALE_INVALID UINT8_MAX

/* Called once after boot's LittleFS/OTA recovery and before other tasks start.
 * English is always present, including when there is no filesystem. */
void device_locale_init(const char *www_root);
size_t device_locale_count(void);
const char *device_locale_code(device_language_t language);
const char *device_locale_name(device_language_t language);
bool device_locale_code_valid(const char *code);
device_language_t device_locale_find(const char *code);
bool device_locale_prepare(device_language_t language);
device_language_t device_locale_resolve(const char *code);
device_language_t device_locale_next(device_language_t current);
const char *device_locale_text(device_language_t language, size_t text_index,
                               const char *english);
