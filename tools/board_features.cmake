# Runs after CMake selects the target compiler, before ESP-IDF expands REQUIRES.
file(GLOB board_local_headers CONFIGURE_DEPENDS "${PROJECT_SOURCE_DIR}/board_options.local.h")
set_property(DIRECTORY APPEND PROPERTY CMAKE_CONFIGURE_DEPENDS
    "${PROJECT_SOURCE_DIR}/board_options.h"
    "${PROJECT_SOURCE_DIR}/components/board/include/board_options_guard.h"
    "${PROJECT_SOURCE_DIR}/components/board/include/board_parts.h"
    "${PROJECT_SOURCE_DIR}/components/board/include/board_features.h"
    ${board_local_headers})
set(board_probe "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/board_features.c")
file(WRITE "${board_probe}" "#include \"board_features.h\"\n")
execute_process(
    COMMAND "${CMAKE_C_COMPILER}" -E -dM
        "-I${PROJECT_SOURCE_DIR}" "-I${PROJECT_SOURCE_DIR}/components/board/include"
        "${board_probe}"
    RESULT_VARIABLE board_probe_result
    OUTPUT_VARIABLE board_macros
    ERROR_VARIABLE board_probe_error)
if(NOT board_probe_result EQUAL 0 OR
   NOT board_macros MATCHES "#define BOARD_HAS_YANDEX_MUSIC ([01])[\r\n]")
    message(FATAL_ERROR "Cannot determine Ya.Music build profile: ${board_probe_error}")
endif()
idf_build_set_property(JRADIO_YANDEX_MUSIC "${CMAKE_MATCH_1}")
