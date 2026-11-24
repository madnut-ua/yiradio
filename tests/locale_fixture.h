#pragma once

#include <assert.h>
#include <stdlib.h>

#include "device_locale.h"

static inline device_language_t test_locale(const char *code)
{
    const char *root = getenv("TEST_LOCALES_WWW");
    assert(root != NULL);
    device_locale_init(root);
    const device_language_t language = device_locale_find(code);
    assert(device_locale_prepare(language));
    return language;
}
