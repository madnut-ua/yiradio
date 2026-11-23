idf_build_get_property(yandex_music JRADIO_YANDEX_MUSIC)
if(yandex_music)
    set(optional_music yandex_music)
endif()
idf_component_register(
    SRCS "main.c"
    INCLUDE_DIRS "."
    REQUIRES audio_tags board bt_link diagnostics fm_tuner improv internet_radio ota jradio_wifi_provisioning file_player lvgl_pool player_control sd_storage settings ui usb_storage weather web_server ${optional_music}
)
target_compile_definitions(${COMPONENT_LIB} PRIVATE
    JRADIO_CONFIGURED_YANDEX_MUSIC=${yandex_music})
