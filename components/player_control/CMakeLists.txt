idf_build_get_property(yandex_music JRADIO_YANDEX_MUSIC)
if(yandex_music)
    set(optional_music yandex_music)
endif()
idf_component_register(
    SRCS "player_control_logic.c" "player_control.c"
    INCLUDE_DIRS "include"
    REQUIRES audio audio_tags board bt_link dlna fm_tuner internet_radio settings jradio_wifi_provisioning esp_timer file_player file_storage sd_storage usb_storage ${optional_music}
)
