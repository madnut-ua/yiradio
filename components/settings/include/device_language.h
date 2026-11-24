#pragma once

#include <stdint.h>

/* A boot-local registry index. Persist and transmit the locale code instead. */
typedef uint8_t device_language_t;
enum { DEVICE_LANGUAGE_EN = 0 };
