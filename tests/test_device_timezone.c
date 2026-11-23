#include <assert.h>
#include <stdio.h>
#include <string.h>

#include "device_timezone.h"

static void check(const char *id, time_t utc, int day, int hour, int minute, int dst)
{
    struct tm local;
    assert(device_timezone_localtime(device_timezone_find(id), utc, &local));
    assert(local.tm_mday == day && local.tm_hour == hour && local.tm_min == minute);
    assert(local.tm_isdst == dst);
}

int main(void)
{
    assert(device_timezone_count() > 255U);
    for (size_t index = 0; index < device_timezone_count(); ++index) {
        const char *id = device_timezone_at(index)->id;
        assert(strlen(id) < DEVICE_TIMEZONE_ID_MAX);
        assert(device_timezone_index_of(id) == index);
        struct tm local;
        assert(device_timezone_localtime(device_timezone_at(index), 1774746000, &local));
    }
    assert(device_timezone_at(device_timezone_count()) == NULL);
    assert(device_timezone_find("mars/olympus") == NULL);
    assert(device_timezone_index_of("mars/olympus") == device_timezone_count());
    assert(device_timezone_find("Europe/Kiev") == device_timezone_find("Europe/Kyiv"));
    assert(device_timezone_index_of("europe/moscow") == device_timezone_index_of("Europe/Moscow"));
    assert(device_timezone_index_of("utc") == device_timezone_index_of("Etc/UTC"));

    check("Europe/Kyiv", 1774745999, 29, 2, 59, 0);
    check("Europe/Kyiv", 1774746000, 29, 4, 0, 1);
    check("Asia/Kathmandu", 1767297600, 2, 1, 45, 0);
    check("Australia/Lord_Howe", 1775314799, 5, 1, 59, 1);
    check("Australia/Lord_Howe", 1775314800, 5, 1, 30, 0);
    check("Africa/Casablanca", 1771588800, 20, 12, 0, 1);
    check("Africa/Casablanca", 1775044800, 1, 13, 0, 0);
    check("America/Ojinaga", 1667116801, 30, 2, 0, 0);
    check("Asia/Gaza", (time_t)INT64_C(3550953599), 11, 1, 59, 0);
    check("Europe/Kyiv", (time_t)INT64_C(4109878800), 28, 4, 0, 1);
    check("europe/berlin", 1774746000, 29, 3, 0, 1);
    struct tm local;
    assert(!device_timezone_localtime(device_timezone_find("Etc/UTC"), 0, &local));
    puts("device_timezone tests passed");
    return 0;
}
