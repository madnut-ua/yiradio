idf_component_register(
    SRCS "version_info.c" "version_info_parse.c"
    INCLUDE_DIRS "include"
    REQUIRES esp_app_format
    PRIV_REQUIRES board
)

set(compiler_name "${CMAKE_C_COMPILER_ID}")
if(compiler_name STREQUAL "GNU")
    set(compiler_name "GCC")
endif()
target_compile_definitions(${COMPONENT_LIB} PRIVATE
    "VERSION_INFO_COMPILER=\"${compiler_name} ${CMAKE_C_COMPILER_VERSION}\""
)
