(() => {
  'use strict';

  const ENGLISH = {
    "brand.name": "yiRadio",
    "nav.project": "The project on GitHub",
    "nav.sections": "Sections",
    "theme.toggle": "Switch theme",
    "title.flasher": "yiRadio — flasher",
    "nav.flasher": "Flasher",
    "fl.lead": "yiRadio onto an ESP32-S3 from the browser: firmware for your display and your wiring, with no ESP-IDF to install.",
    "fl.unsupported": "This browser cannot use a serial port. Open the page in Chrome or Edge on a computer - phones, Firefox and Safari cannot flash.",
    "fl.board": "Wiring",
    "fl.edit": "Edit",
    "fl.source_draft": "From the Hardware editor on this site.",
    "fl.source_default": "The README board. If your wiring or display differs, set them in the Hardware editor.",
    "fl.parts": "Fitted",
    "fl.no_manifest": "Cannot read manifest.json: the site has no firmware files.",
    "fl.no_build": "There is no ready firmware for the {display} display.",
    "fl.firmware": "1. Firmware",
    "fl.firmware_note": "The program and the wiring. Wi-Fi, settings, the playlist and station icons stay as they are - this is the button for updates.",
    "fl.flash_firmware": "Write the firmware",
    "fl.erase": "erase the whole flash (the board had other firmware)",
    "fl.erase_note": "Erasing removes the file system too: write it afterwards with the button below.",
    "fl.littlefs": "2. File system",
    "fl.littlefs_note": "The web interface and the initial settings. Needed on a first install - without it the radio has no web pages - and when a new version changes the web interface.",
    "fl.littlefs_warn": "Writing it erases the saved Wi-Fi networks, the settings, the playlist and the station icons. On a working radio take a backup first (Settings - Backup) and restore it afterwards.",
    "fl.layout": "Memory layout on the board",
    "fl.layout_warn": "Since version 1.6.1 the radio's memory is laid out differently, and this board has the old layout. After writing, the settings, the Wi-Fi networks, the stations and their pictures on the radio will not be kept. If the radio works, first download a backup in its web interface (Settings → Backup) and an export of the stations (Stations → Export). The flasher writes the firmware and the file system; then restore the backup and the stations.",
    "fl.layout_agree": "backup taken (or nothing to keep) - write the firmware and the file system",
    "fl.layout_stop": "Nothing written: the board has the old memory layout - read the warning below and press again.",
    "fl.done_moved": "Done: firmware {version} and the file system are written in the new layout, the board restarted. Put the radio on Wi-Fi and restore the backup and the stations.",
    "fl.littlefs_agree": "I understand the data on the radio will be erased",
    "fl.flash_littlefs": "Write the file system",
    "fl.progress": "Progress",
    "fl.idle": "Connect the board to the computer by its UART port and press one of the buttons.",
    "fl.log": "Log",
    "fl.port_help": "No port shows up - install the CP210x or CH340 driver; the board does not answer - hold BOOT, tap RESET, let go of BOOT and try again. On Linux, if idf.py, esptool or a serial monitor had the port open before, reconnect the cable: they leave the port set up in a way that makes Chrome lose it at once.",
    "fl.pick_port": "Pick the board's port in the browser's window…",
    "fl.connecting": "Connecting to the board…",
    "fl.chip": "Chip",
    "fl.port": "Port",
    "fl.wifi": "3. Wi-Fi",
    "fl.wifi_note": "Connect the radio to your home network over the same cable - no access point, no phone. The password goes to the board only and is kept nowhere on this page. Works for a radio flashed earlier too, if its version has this feature.",
    "fl.wifi_connect": "Connect to the radio",
    "fl.wifi_disconnect": "Disconnect",
    "fl.wifi_network": "Network",
    "fl.wifi_ssid": "Network name",
    "fl.wifi_password": "Password",
    "fl.wifi_send": "Connect to the network",
    "fl.wifi_after_flash": "The firmware is written - now the radio can be put on Wi-Fi.",
    "fl.wifi_waiting": "Waiting for the radio - after flashing it is still starting…",
    "fl.wifi_silent": "The radio does not answer. It needs a firmware with this feature; if it has just been written, wait a few seconds and try again.",
    "fl.wifi_device": "Radio: {name}, firmware {version}.",
    "fl.wifi_scanning": "Looking for networks…",
    "fl.wifi_open": "open",
    "fl.wifi_other": "Another network…",
    "fl.wifi_pick": "Pick a network and enter its password.",
    "fl.wifi_type": "Enter the network name and password. A radio already on a network does not look for others - it would break the sound.",
    "fl.wifi_bad_ssid": "The network name is 1 to 32 bytes.",
    "fl.wifi_bad_password": "The password is at most 64 bytes.",
    "fl.wifi_joining": "Connecting to \"{ssid}\"…",
    "fl.wifi_no_answer": "The radio did not say how it went. Look at its screen: the web address is shown in the settings.",
    "fl.wifi_failed": "Could not connect: check the network name and password. The radio went back to the networks that worked.",
    "fl.wifi_refused": "The radio refused the request - try again.",
    "fl.wifi_done": "Done: the radio is on \"{ssid}\". The web interface:",
    "fl.wrong_chip": "This is not an ESP32-S3 but {chip} - yiRadio firmware is not for it.",
    "fl.downloading": "Fetching the firmware files…",
    "fl.erasing": "Erasing and writing…",
    "fl.writing": "Writing…",
    "fl.missing_file": "The file {file} is missing",
    "fl.error": "Error",
    "fl.no_port": "No port was chosen.",
    "fl.no_answer": "The board does not answer. Hold BOOT, tap RESET, let go of BOOT - and try again.",
    "fl.port_busy": "The port is busy or gone: close other programs and tabs using it, reconnect the cable and try again.",
    "fl.failed": "It did not work: {error}",
    "fl.done_firmware": "Done: firmware {version} is written and the board restarted. On a first install, write the file system too.",
    "fl.done_littlefs": "Done: the file system is written. The radio opens a yiRadio-XXXX access point to set up Wi-Fi - or restore your backup.",
    "title.hardware": "yiRadio — hardware",
    "nav.hardware": "Hardware",
    "hw.lead": "What is wired to the module, and to which pins. The result is the wiring for the Flasher page, or a board_options.h to build the firmware with.",
    "hw.parts": "What is wired",
    "hw.module": "The ESP32-S3-WROOM-1 N16R8 module",
    "hw.svg": "The module's pinout",
    "hw.report": "Checks",
    "hw.report_ok": "Nothing to report.",
    "hw.bus_card": "- its pins are in the bus card",
    "hw.hint.board_name": "What this board is called - for yourself: \"bench\", \"board v2\"",
    "hw.hint.idle": "Press ⌖ beside a signal, then a pin - or pick the pin from the list. Clicking a used pin takes its signal.",
    "hw.hint.picking": "Where does \"{signal}\" go? Click a pin. Esc cancels.",
    "hw.arm": "Pick a pin for \"{signal}\" on the picture",
    "hw.enable": "{device}: on the board",
    "hw.copy": "Copy",
    "hw.download": "Download",
    "hw.copied": "Copied",
    "hw.copy_failed": "Could not copy",
    "hw.downloaded": "board_options.h downloaded - put it at the project root and build",
    "hw.import": "Paste your own board_options.h",
    "hw.import_placeholder": "#define TFT_CS_GPIO 10",
    "hw.import_apply": "Apply",
    "hw.import_ok": "The file was read; the editor follows it.",
    "hw.import_unknown": "Read; unknown keys kept as they are: {keys}",
    "hw.import_bad": "Line {line} is not \"key,value\": {text}",
    "hw.reset": "Reset to the README board",
    "hw.reset_done": "The README board",
    "hw.dev.board": "Board",
    "hw.dev.tft": "Display",
    "hw.dev.encoder": "Encoder",
    "hw.dev.buttons": "Buttons",
    "hw.dev.ir": "IR receiver",
    "hw.f.yandex_music": "Yandex Music",
    "hw.f.dlna": "Media server (DLNA)",
    "hw.dev.dac": "DAC",
    "hw.dev.amp": "Amplifier",
    "hw.dev.power": "Peripheral power",
    "hw.dev.usb": "USB drive",
    "hw.dev.sd": "SD card",
    "hw.dev.bluetooth": "Bluetooth module",
    "hw.dev.spi2": "SPI2 bus",
    "hw.dev.spi3": "SPI3 bus",
    "hw.dev.i2s0": "I2S bus",
    "hw.dev.uart1": "UART1 bus",
    "hw.dev.fm": "FM tuner",
    "hw.dev.adc": "ADC",
    "hw.dev.rtc": "Real-time clock",
    "hw.dev.touch": "Touch panel",
    "hw.dev.i2c0": "I2C bus",
    "hw.f.board_name": "Board name",
    "hw.f.display": "Display",
    "hw.f.spi2_sclk": "SCLK",
    "hw.f.spi2_mosi": "MOSI",
    "hw.f.spi3_sclk": "SCLK",
    "hw.f.spi3_mosi": "MOSI",
    "hw.f.spi3_miso": "MISO",
    "hw.f.i2s0_bclk": "BCLK",
    "hw.f.i2s0_lrck": "LRCK",
    "hw.f.i2s0_dout": "DOUT (to the DAC)",
    "hw.f.i2s0_din": "DIN (from the tuner or the ADC)",
    "hw.f.bt_din": "DIN from the module (sound through the S3)",
    "hw.s.bt_din": "BT DIN",
    "hw.f.i2s0_mclk": "MCLK (to the ADC's SCKI)",
    "hw.f.uart1_tx": "TX",
    "hw.f.uart1_rx": "RX",
    "hw.f.i2c0_sda": "SDA",
    "hw.f.i2c0_scl": "SCL",
    "hw.f.tft_cs": "CS",
    "hw.f.tft_dc": "DC",
    "hw.f.tft_reset": "RESET",
    "hw.f.tft_backlight": "Backlight",
    "hw.f.encoder_right": "Right (A)",
    "hw.f.encoder_left": "Left (B)",
    "hw.f.encoder_button": "Push",
    "hw.f.encoder_right.buttons": "Button +",
    "hw.f.encoder_left.buttons": "Button -",
    "hw.f.encoder_button.buttons": "Button OK",
    "hw.f.encoder_buttons": "Three buttons instead of the encoder",
    "hw.f.controls": "Control profile",
    "hw.opt.legacy": "Standard",
    "hw.opt.dual_encoder": "Dual encoder",
    "hw.opt.2": "2",
    "hw.opt.4": "4",
    "hw.f.encoder_left.dual_encoder": "ENC1 A — stations",
    "hw.f.encoder_right.dual_encoder": "ENC1 B — stations",
    "hw.f.encoder_button.dual_encoder": "SW1 — OK / Mute",
    "hw.f.volume_encoder_a": "ENC2 A — volume",
    "hw.f.volume_encoder_b": "ENC2 B — volume",
    "hw.f.encoder_edges": "ENC1: edges per detent",
    "hw.f.volume_encoder_edges": "ENC2: edges per detent",
    "hw.f.button_menu": "SW2 — Menu / Back",
    "hw.f.button_sleep": "Sleep",
    "hw.f.button_quick_menu": "Quick_menu - quick panel",
    "hw.f.button_prev": "Prev",
    "hw.f.button_next": "Next",
    "hw.f.dac": "Chip",
    "hw.f.dac_i2s": "Bus",
    "hw.f.dac_mute": "Mute (XSMT)",
    "hw.f.spdif_out": "S/PDIF out",
    "hw.f.dac_i2c": "Control",
    "hw.f.dac_address": "I2C address (ADDR0/ADDR1)",
    "hw.f.dac_gain": "Gain",
    "hw.f.amp_enable": "Enable",
    "hw.f.amp_on_level": "On is high",
    "hw.f.peripheral_power": "Power switch",
    "hw.f.peripheral_power_on_level": "On is high",
    "hw.f.usb_dp": "D+",
    "hw.f.usb_dm": "D-",
    "hw.f.sd_spi": "Bus",
    "hw.f.sd_cs": "CS",
    "hw.f.bluetooth": "Module",
    "hw.f.bt_uart": "Control",
    "hw.f.bt_i2s": "Audio",
    "hw.f.fm_tuner": "Chip",
    "hw.f.fm_i2c": "Control",
    "hw.f.fm_chip": "Chip",
    "hw.f.fm_sound": "Audio",
    "hw.f.adc": "Chip",
    "hw.f.adc_i2s": "Audio",
    "hw.f.fm_i2s": "Audio",
    "hw.f.rtc": "Chip",
    "hw.f.rtc_i2c": "Bus",
    "hw.f.touch": "Chip",
    "hw.f.touch_i2c": "Bus",
    "hw.f.touch_int": "Interrupt (CTP_INT)",
    "hw.s.touch_int": "Touch INT",
    "hw.s.spi2_sclk": "SPI2 SCLK",
    "hw.s.spi2_mosi": "SPI2 MOSI",
    "hw.s.spi3_sclk": "SPI3 SCLK",
    "hw.s.spi3_mosi": "SPI3 MOSI",
    "hw.s.spi3_miso": "SPI3 MISO",
    "hw.s.i2s0_bclk": "I2S BCLK",
    "hw.s.i2s0_lrck": "I2S LRCK",
    "hw.s.i2s0_dout": "I2S DOUT",
    "hw.s.i2s0_din": "I2S DIN",
    "hw.s.i2s0_mclk": "I2S MCLK",
    "hw.s.uart1_tx": "UART1 TX",
    "hw.s.uart1_rx": "UART1 RX",
    "hw.s.i2c0_sda": "I2C SDA",
    "hw.s.i2c0_scl": "I2C SCL",
    "hw.s.tft_cs": "TFT CS",
    "hw.s.tft_dc": "TFT DC",
    "hw.s.tft_reset": "TFT RST",
    "hw.s.tft_backlight": "Backlight",
    "hw.s.encoder_right": "Encoder A",
    "hw.s.encoder_left": "Encoder B",
    "hw.s.encoder_button": "Encoder ⏎",
    "hw.s.encoder_right.buttons": "Button +",
    "hw.s.encoder_left.buttons": "Button -",
    "hw.s.encoder_button.buttons": "Button OK",
    "hw.s.encoder_left.dual_encoder": "ENC1 A",
    "hw.s.encoder_right.dual_encoder": "ENC1 B",
    "hw.s.encoder_button.dual_encoder": "SW1 OK",
    "hw.s.button_menu": "SW2",
    "hw.s.volume_encoder_a": "ENC2 A",
    "hw.s.volume_encoder_b": "ENC2 B",
    "hw.f.ir_receiver": "Receiver output",
    "hw.s.ir_receiver": "IR",
    "hw.s.button_sleep": "Sleep",
    "hw.s.button_quick_menu": "Quick_menu",
    "hw.s.button_prev": "Prev",
    "hw.s.button_next": "Next",
    "hw.s.dac_mute": "Mute",
    "hw.s.spdif_out": "S/PDIF",
    "hw.s.amp_enable": "Amp",
    "hw.s.peripheral_power": "Power",
    "hw.s.usb_dp": "USB D+",
    "hw.s.usb_dm": "USB D-",
    "hw.s.sd_cs": "SD CS",
    "hw.opt.none": "none",
    "hw.opt.pcm5102": "PCM5102",
    "hw.opt.max98357a": "MAX98357A (I2S amplifier)",
    "hw.opt.dac.none": "none, S/PDIF only",
    "hw.opt.ssm3582": "SSM3582 (class-D amplifier)",
    "hw.opt.13": "13 dB (6.3 V peak)",
    "hw.opt.16": "16 dB (8.9 V peak)",
    "hw.opt.19": "19 dB (12.6 V peak)",
    "hw.opt.21": "21 dB (16 V peak)",
    "hw.opt.0x10": "0x10",
    "hw.opt.0x11": "0x11",
    "hw.opt.0x12": "0x12",
    "hw.opt.0x13": "0x13",
    "hw.opt.0x14": "0x14",
    "hw.opt.0x15": "0x15",
    "hw.opt.0x16": "0x16",
    "hw.opt.0x17": "0x17",
    "hw.opt.0x18": "0x18",
    "hw.opt.0x19": "0x19",
    "hw.opt.0x1a": "0x1A",
    "hw.opt.0x1b": "0x1B",
    "hw.opt.0x1c": "0x1C",
    "hw.opt.0x1d": "0x1D",
    "hw.opt.0x1e": "0x1E",
    "hw.opt.0x1f": "0x1F",
    "hw.opt.rda5807": "RDA5807 (M, FP)",
    "hw.opt.pcm1808": "PCM1808",
    "hw.opt.ds3231": "DS3231 (3.3 V supply)",
    "hw.opt.ft6336u": "FT6336U",
    "hw.opt.ds1307": "DS1307 (5 V supply, its module's pull-ups off)",
    "hw.opt.rda5807fp": "RDA5807FP",
    "hw.opt.rda5807m": "RDA5807M",
    "hw.opt.analog": "Analogue output",
    "hw.opt.adc": "Through a PCM1808 ADC",
    "hw.opt.jradio_bt": "jradio-bt (an ESP32 over UART)",
    "hw.opt.st7796s_480_320": "ST7796S 480×320",
    "hw.opt.st7796s_320_480": "ST7796S 320×480 (portrait)",
    "hw.opt.ili9488_480_320": "ILI9488 480×320",
    "hw.opt.ili9488_320_480": "ILI9488 320×480 (portrait)",
    "hw.opt.ili9341_320_240": "ILI9341 320×240",
    "hw.opt.ili9341_240_320": "ILI9341 240×320 (portrait)",
    "hw.opt.st7789_320_240": "ST7789 320×240",
    "hw.opt.st7789_240_320": "ST7789 240×320 (portrait)",
    "hw.opt.st7789_320_170": "ST7789 320×170",
    "hw.opt.nv3007_428_142": "NV3007 428×142",
    "hw.opt.rst": "The module's RST",
    "hw.f.module": "Module",
    "hw.opt.esp32s3_n16r8": "ESP32-S3 N16R8",
    "hw.opt.esp32s3_n16r8v": "N16R8V / N32R8V (1.8 V memory)",
    "hw.note.pin_1v8": "On this module the pin swings 1.8 V",
    "hw.note.pin_psram": "Taken by the N16R8 module's octal PSRAM",
    "hw.note.pin_console": "UART0 - the console and the flashing port",
    "hw.note.pin_usb": "USB only: the controller is hard-wired here",
    "hw.note.pin_strapping": "A strapping pin: fine for a button with a pull-up, but its level at boot matters",
    "hw.note.pin_jtag": "A JTAG pin: the debugger becomes unavailable",
    "hw.err.pin_conflict": "GPIO {gpio} is taken twice: {keys}",
    "hw.err.pin_missing": "\"{key}\": a pin is required",
    "hw.err.pin_not_on_header": "\"{key}\": GPIO {gpio} is not on the module's header",
    "hw.err.pin_psram": "\"{key}\": GPIO {gpio} is taken by the octal PSRAM",
    "hw.err.pin_console": "\"{key}\": GPIO {gpio} is the console and flashing port (UART0)",
    "hw.err.pin_usb": "\"{key}\": GPIO {gpio} belongs to USB",
    "hw.err.usb_pin_fixed": "\"{key}\": the USB controller is on 19/20, no other pin will do",
    "hw.err.bus_unwired": "{device}: the {bus} bus has no {pin}",
    "hw.err.bt_needs_din_no_dac": "Without a DAC, sound from a phone only goes through the S3: wire the module's data to a free pin and name it in \"DIN from the module\"",
    "hw.err.bt_needs_din": "With the SSM3582, Bluetooth sound only goes through the S3: wire the module's data to a free pin and name it in \"DIN from the module\"",
    "hw.err.dac_address_taken": "The RDA5807 FM tuner holds 0x10 and 0x11 on the I2C bus: strap the SSM3582 to another address with ADDR0/ADDR1",
    "hw.err.adc_with_fm_i2s": "The ADC and the RDA5807FP's I2S output share the one DIN line: choose one - set the tuner's audio to Analogue, or drop the ADC",
    "hw.err.bad_value": "\"{key}\": \"{value}\" is not a valid value",
    "hw.err.sleep_not_rtc": "Sleep on GPIO {gpio}: only pins 0-21 can wake the chip, so the sleep button will not wake the board - only a remote, if there is one",
    "hw.err.ir_not_rtc": "The IR receiver on GPIO {gpio}: only pins 0-21 can wake the chip from sleep, so the remote will not",
    "hw.err.power_on_vdd_spi": "Peripheral power on GPIO {gpio}: pins 47 and 48 are powered from VDD_SPI, which deep sleep switches off - the switch would float and the periphery stay powered. Use another pin",
    "hw.err.pin_1v8": "\"{key}\" on GPIO {gpio}: on the V modules this pin swings 1.8 V, not 3.3 V - a 3.3 V part may not read it",
    "hw.err.spi_not_iomux": "\"{key}\" on GPIO {gpio}: not one of SPI2's IOMUX pins, 40 MHz to the panel may not hold",
    "lang.label": "Language",
    "common.show": "Show",
    "common.hide": "Hide"
  };

  const STORAGE_KEY = 'jradio.language';
  const PARAMETERS = /\{(\w+)\}/g;
  const ATTRIBUTES = [
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  const locales = new Map([['en', {code: 'en', name: 'English'}]]);
  const listeners = [];
  let current = 'en';
  let overrides = Object.create(null);
  let generation = 0;
  let picker;

  function parameters(text) {
    return [...new Set(Array.from(text.matchAll(PARAMETERS), (match) => match[1]))].sort().join(',');
  }

  function t(key, values) {
    const text = overrides[key] ?? (Object.hasOwn(ENGLISH, key) ? ENGLISH[key] : '');
    return values == null ? text : text.replace(PARAMETERS, (whole, name) =>
      Object.hasOwn(values, name) ? String(values[name]) : whole);
  }

  function apply(root = document) {
    if (typeof root.querySelectorAll !== 'function') return;
    for (const node of root.querySelectorAll('[data-i18n]')) {
      const key = node.getAttribute('data-i18n');
      if (Object.hasOwn(ENGLISH, key)) node.textContent = t(key);
    }
    for (const [marker, attribute] of ATTRIBUTES) {
      for (const node of root.querySelectorAll(`[${marker}]`)) {
        const key = node.getAttribute(marker);
        if (Object.hasOwn(ENGLISH, key)) node.setAttribute(attribute, t(key));
      }
    }
  }

  function paint() {
    if (document.documentElement) document.documentElement.lang = current;
    const key = document.body?.getAttribute?.('data-i18n-page');
    if (Object.hasOwn(ENGLISH, key)) document.title = t(key);
    if (picker) picker.value = current;
    apply();
  }

  async function getJson(path) {
    const response = await window.fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function setLanguage(code, remember = false) {
    const version = ++generation;
    let language = locales.get(code.toLowerCase())?.code ?? 'en';
    const strings = Object.create(null);
    if (language !== current && language !== 'en') {
      try {
        const pack = await getJson(`locales/${language}.json`);
        if (pack?.schema !== 1 || pack.code !== language ||
            !pack.strings || typeof pack.strings !== 'object' || Array.isArray(pack.strings)) {
          throw new Error('Invalid translation catalog');
        }
        for (const [key, text] of Object.entries(pack.strings)) {
          if (Object.hasOwn(ENGLISH, key) && typeof text === 'string' && text.trim() &&
              !/[{}]/.test(text.replace(PARAMETERS, '')) &&
              parameters(text) === parameters(ENGLISH[key])) strings[key] = text;
        }
      } catch (error) {
        if (version !== generation) return;
        console.warn(`Cannot load flasher language ${language}:`, error);
        language = 'en';
        remember = false;
      }
    }
    if (version !== generation) return;
    if (remember) {
      try {
        window.localStorage.setItem(STORAGE_KEY, language);
      } catch (error) {
        // A browser can disable storage; the choice still applies to this page.
      }
    }
    if (language === current) {
      if (picker) picker.value = current;
      return;
    }
    current = language;
    overrides = strings;
    paint();
    for (const listener of listeners) listener(current);
  }

  function preferredLanguage() {
    try {
      const remembered = window.localStorage.getItem(STORAGE_KEY)?.toLowerCase();
      if (locales.has(remembered)) return remembered;
    } catch (error) {
      // Preferences are still available even when browser storage is disabled.
    }
    const browser = window.navigator;
    const preferences = browser?.languages?.length ? browser.languages : [browser?.language];
    for (const preference of preferences) {
      let code = String(preference ?? '').toLowerCase();
      for (;;) {
        if (locales.has(code)) return code;
        const separator = code.lastIndexOf('-');
        if (separator < 0) break;
        code = code.slice(0, separator);
      }
    }
    return 'en';
  }

  async function start() {
    picker = document.getElementById?.('site-language');
    paint();
    try {
      const index = await getJson('locales/index.json');
      if (index?.schema !== 1 || !Array.isArray(index.locales)) {
        throw new Error('Invalid language index');
      }
      for (const entry of index.locales) {
        if (typeof entry?.code !== 'string' || entry.code.length > 15 ||
            !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(entry.code) ||
            typeof entry.name !== 'string' || !entry.name.trim()) continue;
        const key = entry.code.toLowerCase();
        if (locales.has(key)) continue;
        locales.set(key, entry);
        if (picker) {
          const option = document.createElement('option');
          option.value = entry.code;
          option.lang = entry.code;
          option.textContent = entry.name;
          picker.append(option);
        }
      }
      if (picker && locales.size > 1) {
        picker.addEventListener('change', () => setLanguage(picker.value, true));
        picker.disabled = false;
      }
      if (generation === 0) await setLanguage(preferredLanguage());
    } catch (error) {
      console.warn('Cannot load flasher language index:', error);
    }
  }

  window.jradioI18n = {
    t, apply, setLanguage,
    language: () => current,
    onChange: (listener) => { listeners.push(listener); },
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else if (typeof window.fetch === 'function') start();
  else paint();
})();
