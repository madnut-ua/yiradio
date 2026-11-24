/* English is built in; the device supplies the selected language's overrides. */
(() => {
  'use strict';

  const ENGLISH = {
    "brand.name": "yiRadio",
    "title.player": "yiRadio — player",
    "title.playlist": "yiRadio — stations",
    "title.settings": "yiRadio — settings",
    "nav.player": "Player",
    "nav.playlist": "Stations",
    "stations.lead": "The stations the device plays: internet radio and, when it has a tuner, FM.",
    "stations.kinds": "Kinds of stations",
    "stations.tab_radio": "Internet radio",
    "stations.tab_fm": "FM",
    "stations.to_save": "Down to Save",
    "stations.exported_all": "Exported: {n} stations, {fm} FM stations, {icons} pictures",
    "stations.imported_fm": "FM stations: {n}",
    "stations.imported_notes": "{done} ({notes})",
    "stations.no_tuner": "the file has FM stations and there is no tuner",
    "nav.settings": "Settings",
    "nav.back_to_player": "Back to the player",
    "nav.project": "The project on GitHub",
    "nav.sections": "Sections",
    "theme.toggle": "Switch theme",
    "socket.connecting": "Connecting…",
    "socket.online": "Connected",
    "socket.offline": "No connection",
    "player.home": "yiRadio — home",
    "player.sources": "Sources",
    "player.playlist_editor": "Stations",
    "player.nothing_playing": "Nothing playing",
    "player.waiting": "Waiting for the device",
    "player.previous": "Previous track",
    "player.next": "Next track",
    "player.play": "Play",
    "player.pause": "Pause",
    "player.like": "Like",
    "player.dislike": "Dislike",
    "player.position": "Position in the track",
    "player.volume": "Volume",
    "player.expand": "Expand the track card",
    "player.collapse": "Collapse the track card",
    "player.no_stream_info": "Stream details appear once it connects",
    "player.untitled": "Untitled",
    "player.volume_failed": "Could not change the volume",
    "sleep.label": "Sleep timer",
    "sleep.off": "Off",
    "sleep.minutes": "{n} min",
    "sleep.failed": "Could not set the timer",
    "alarm.group": "Alarm clock",
    "alarm.enabled": "On",
    "alarm.time": "Time",
    "alarm.days": "Days",
    "alarm.station": "Station",
    "alarm.volume": "Volume",
    "alarm.mon": "Mon",
    "alarm.tue": "Tue",
    "alarm.wed": "Wed",
    "alarm.thu": "Thu",
    "alarm.fri": "Fri",
    "alarm.sat": "Sat",
    "alarm.sun": "Sun",
    "alarm.one_day": "At least one day is needed",
    "alarm.no_stations": "The playlist is empty",
    "alarm.source": "What to play",
    "alarm.source_radio": "Internet radio",
    "alarm.source_fm": "FM radio",
    "alarm.source_last": "Last source",
    "alarm.fm_station": "FM station",
    "alarm.no_fm_stations": "No FM stations — scan on the Stations page",
    "alarm_off.group": "Switch-off by time",
    "alarm_off.note": "At this time the sound fades out and the radio sleeps until the next alarm, however it was turned on.",
    "alarm.at": "Alarm {time}",
    "alarm.every_day": "every day",
    "alarm.weekdays": "weekdays",
    "alarm.weekend": "weekends",
    "title.remote": "yiRadio — remote control",
    "remote.title": "Remote control",
    "note.remote": "Any infrared remote: on its own page you press \"Learn\" beside each function, then the key on the remote. The table lives on the device in remote.csv.",
    "remote.open": "Set up the remote",
    "fm.title": "FM stations",
    "note.fm": "Scan sweeps the whole band, and the stations it finds replace this list. A station can also be added by its frequency, and a row's frequency corrected. Name them, give them pictures and save: on the device a double press opens the list, and Prev and Next step through it; while it is empty, they search for the nearest station. A station with no name takes the one it sends over RDS.",
    "fm.saved": "Saved stations",
    "fm.saved_empty": "No stations yet - press Scan or add a frequency",
    "fm.frequency": "Frequency, MHz",
    "fm.add": "Add",
    "fm.bad_frequency": "The frequency is 87.0 to 108.0 MHz",
    "fm.already": "{frequency} MHz is already in the list",
    "fm.full": "No room for more than {count} stations",
    "fm.scan": "Scan",
    "fm.scanning": "Scanning… {frequency} MHz",
    "fm.scan_busy": "A scan is already running",
    "fm.replace_confirm": "All the saved stations ({count}) will be replaced by the ones found. Go on?",
    "fm.scan_saved": "Stations found and saved: {count}",
    "fm.scan_nothing": "Nothing found - the list is unchanged. Check the aerial",
    "fm.save": "Save",
    "fm.unsaved": "There are unsaved changes",
    "fm.saved_ok": "Stations saved: {count}",
    "fm.save_failed": "Could not save",
    "fm.load_failed": "Could not load the stations",
    "fm.name": "Name",
    "fm.up": "Up",
    "fm.down": "Down",
    "fm.remove": "Remove",
    "fm.picture_upload_failed": "Could not send the picture to the device",
    "fm.signal": "signal {signal}/{bars}",
    "fm.stereo": "stereo",
    "note.remote_page": "Any infrared remote: press \"Learn\" beside a function, then the key on the remote. One key, one function; the table lives on the device in remote.csv.",
    "remote.keys": "Keys",
    "remote.missing": "This build has no IR receiver: IR_RECEIVER_GPIO is not set.",
    "remote.learn": "Learn",
    "remote.forget": "Forget",
    "remote.waiting": "press the key on the remote…",
    "remote.press": "\"{function}\": press the key on the remote",
    "remote.press_any": "press the key on the remote",
    "remote.learned": "Learned",
    "remote.timeout": "No key came",
    "remote.unknown": "Key {code} is not learned",
    "remote.failed": "The device did not answer",
    "remote.group.sound": "Sound",
    "remote.group.navigate": "Navigation",
    "remote.group.extras": "More",
    "remote.group.digits": "Station number",
    "remote.group.sources": "Sources",
    "remote.f.power": "Sleep / wake",
    "remote.f.volume_up": "Volume up",
    "remote.f.volume_down": "Volume down",
    "remote.f.mute": "Mute",
    "remote.f.play_pause": "Play / pause",
    "remote.f.prev": "Previous (station, track)",
    "remote.f.next": "Next (station, track)",
    "remote.f.up": "Up the list",
    "remote.f.down": "Down the list",
    "remote.f.ok": "OK",
    "remote.f.back": "Back (previous source)",
    "remote.f.menu": "Menu",
    "remote.f.quick": "Quick panel",
    "remote.f.list": "Station list",
    "remote.f.sleep": "Sleep timer",
    "remote.f.peek": "Info",
    "remote.f.like": "Like (Ya.Music)",
    "remote.f.dislike": "Dislike (Ya.Music)",
    "remote.f.digit_0": "0",
    "remote.f.digit_1": "1",
    "remote.f.digit_2": "2",
    "remote.f.digit_3": "3",
    "remote.f.digit_4": "4",
    "remote.f.digit_5": "5",
    "remote.f.digit_6": "6",
    "remote.f.digit_7": "7",
    "remote.f.digit_8": "8",
    "remote.f.digit_9": "9",
    "remote.f.source_radio": "Internet radio",
    "remote.f.source_usb": "USB drive",
    "remote.f.source_sd": "SD card",
    "remote.f.source_bluetooth": "Bluetooth",
    "remote.f.source_yandex": "Ya.Music",
    "remote.f.source_dlna": "Media server",
    "remote.f.source_fm": "FM radio",
    "player.command_failed": "The command did not go through",
    "player.command_too_long": "The command is too long",
    "unit.kbps": "kbps",
    "unit.hz": "Hz",
    "unit.dbm": "dBm",
    "list.stations": "Stations",
    "list.folders": "Folders",
    "list.files": "Files",
    "list.stations_list": "Station list",
    "list.folders_list": "Folder list",
    "list.files_list": "File list",
    "list.count": "Item count",
    "list.search": "Search the list",
    "list.empty": "Nothing here yet",
    "list.offline": "No network — the list is unavailable",
    "list.loading": "Loading stations…",
    "list.opening_folder": "Opening the folder…",
    "list.searching_server": "Looking for a media server…",
    "list.folder_empty": "This folder is empty",
    "list.no_server": "No media server on the network",
    "list.parent": ".. (up)",
    "list.open": "Open",
    "list.playing": "Playing",
    "list.note_artist": "artist-style wave",
    "list.unsupported": "Not supported",
    "list.read_failed_dlna": "Could not read the media server",
    "list.read_failed_files": "Could not read the drive",
    "list.read_failed_stations": "Could not read the station list",
    "state.stopped": "Stopped",
    "state.connecting": "Connecting",
    "state.playing": "Playing",
    "state.paused": "Paused",
    "state.reconnecting": "Reconnecting",
    "state.error": "Error",
    "state.unknown": "Unknown state",
    "state.no_source": "No source",
    "state.no_network": "No network",
    "common.loading": "Loading…",
    "common.saving": "Saving…",
    "common.untitled": "Untitled",
    "playlist.lead": "Importing replaces the whole list; exporting saves what is on screen.",
    "playlist.add": "Add",
    "playlist.import": "Import",
    "playlist.export": "Export",
    "playlist.rows": "Playlist stations",
    "playlist.empty": "Nothing here yet — add a station or import a file",
    "playlist.save": "Save to the device",
    "playlist.note_order": "Reorder by dragging a row by the handle on the left; from the keyboard, the up and down arrows on it. A station's icon is removed by the \"Remove\" button in its card.",
    "playlist.note_format": "File format: one station per line, fields separated by tabs — name, URL, and the \"name from the list\" flag (0 or 1).",
    "playlist.name": "Name",
    "playlist.station_name": "Station name",
    "playlist.stream_url": "Stream address",
    "playlist.name_from_list": "Show the name from the list rather than from the stream",
    "playlist.icon": "Station icon",
    "playlist.icon_replace": "Replace the icon",
    "playlist.icon_remove": "Remove",
    "playlist.icon_preparing": "Preparing the icon…",
    "playlist.icon_ready": "The icon is ready. Press \"Save to the device\" to send it.",
    "playlist.icon_will_go": "The icon is removed when the list is saved",
    "playlist.icon_failed": "Could not prepare the icon",
    "playlist.icon_too_large": "The picture is too large: it will not fit in {kb} KB even compressed. Try a smaller or a plainer one.",
    "playlist.icon_missing": "the picture did not come back",
    "playlist.reorder": "Move the station",
    "playlist.reorder_hint": "Drag to reorder; the up and down arrows do the same from the keyboard",
    "playlist.edit": "Edit the station",
    "playlist.delete": "Delete the station",
    "playlist.order_changed": "The order changed — save the list to the device",
    "playlist.need_name": "Give the station a name",
    "playlist.need_url": "Give the stream an address",
    "playlist.need_url_first": "Give the stream an address first",
    "playlist.name_has_tab": "The name cannot contain a tab",
    "playlist.url_has_tab": "The address cannot contain a tab",
    "playlist.name_too_long": "The name is too long",
    "playlist.url_too_long": "The address is too long",
    "playlist.test_browser": "Test in the browser",
    "playlist.test_device": "Test on the device",
    "playlist.stop": "Stop",
    "search.title": "Find stations",
    "search.close": "Close",
    "icons.title": "Pictures for stations without one",
    "search.source": "Catalogue",
    "search.source_mirror": "jRadio copy",
    "search.source_live": "radio-browser.info",
    "search.source_mirror_short": "the jRadio copy",
    "search.source_live_short": "radio-browser.info",
    "search.fell_back": "({source} did not answer; these are from {other}.)",
    "search.open": "Find stations",
    "search.placeholder": "Name or genre: jazz, rock, news",
    "search.country": "Country",
    "search.any_country": "Any country",
    "search.go": "Search",
    "search.results": "Stations found",
    "search.note": "Stations from the open radio-browser.info catalogue — directly or from the jRadio copy on GitHub, which is refreshed once a day and opens where the catalogue itself does not. If the chosen one does not answer, the page asks the other. An added station appears in the list below; press \"Save to the device\" to send it to the radio.",
    "search.listen": "Listen in the browser",
    "search.browser_cannot": "The browser could not play \"{name}\"",
    "search.list_not_loaded": "The station list has not loaded from the radio yet",
    "search.already": "\"{name}\" is already in the list",
    "search.add": "Add",
    "search.added_button": "In the list",
    "search.added": "\"{name}\" added. Remember to save the list.",
    "search.added_fetching": "\"{name}\" added, fetching its picture…",
    "search.added_no_icon": "\"{name}\" added, but its picture could not be fetched",
    "search.added_icon_too_large": "\"{name}\" added without a picture: the one on its site is over 512 KB",
    "search.need_query": "Type a name or a genre, or choose a country",
    "search.searching": "Searching…",
    "search.found": "Found: {n}",
    "search.hidden": "({n} more hidden: the stream address is longer than the radio can store)",
    "search.nothing": "Nothing found",
    "search.failed": "The catalogue did not answer. Try again in a moment.",
    "icons.open": "Find pictures",
    "icons.results": "Pictures found",
    "icons.apply": "Use the ticked ones",
    "icons.note": "A match by stream address is reliable, a match by name is worth a look. The catalogue chosen in the station search is used. Pictures from the copy come at once, the rest the radio fetches; they reach the radio with \"Save to the device\".",
    "icons.how_url": "by stream address",
    "icons.how_name": "by name",
    "icons.how_guess": "a similar station: \"{name}\" — check it",
    "icons.all_have": "Every station already has a picture",
    "icons.looking": "Looking for pictures: {k} of {n}…",
    "icons.found": "Pictures found: {n} of {total}.",
    "icons.some_failed": "The catalogue did not answer for {n}.",
    "icons.fetching": "Fetching pictures: {k} of {n}…",
    "icons.applied": "Pictures set: {n}. Remember to save the list.",
    "icons.applied_some": "Pictures set: {n}, failed: {failed}. Remember to save the list.",
    "playlist.trying_browser": "Trying in the browser…",
    "playlist.playing_browser": "Playing in the browser",
    "playlist.playing_device": "Playing on the device",
    "playlist.sending_device": "Sending to the device…",
    "playlist.stopping": "Stopping…",
    "playlist.browser_cannot": "The browser could not open the stream. It does not play HLS and the like.",
    "playlist.device_refused": "The device refused the request",
    "playlist.loaded": "Loaded from the device",
    "playlist.read_failed": "Could not read the file",
    "playlist.reading": "Reading the file…",
    "playlist.packing": "Building the archive…",
    "playlist.unsaved_import": "Unsaved changes will be lost. Import the file?",
    "playlist.check_and_save": "Check the list and save again.",
    "playlist.some_rejected": "some rows were rejected.",
    "playlist.loaded_skipped": "Loaded, {n} rows skipped (malformed)",
    "playlist.load_failed": "Could not load the playlist: {error}",
    "playlist.limit_reached": "The limit of {n} stations is reached",
    "playlist.exported": "Exported {n} stations",
    "playlist.exported_icons": "Exported {n} stations and {icons} pictures",
    "playlist.export_failed": "Could not build the archive: a picture did not come back",
    "playlist.rows_skipped": "{n} rows skipped",
    "playlist.kept_first": "the first {n} stations were kept",
    "playlist.icons_missing": "{n} pictures were not found",
    "playlist.imported_notes": "Imported {n} stations ({notes})",
    "playlist.imported": "Imported {n} stations",
    "playlist.sending_icons": "Sending pictures: {n}…",
    "playlist.partial_save": "The device took {n} stations of {expected}: some rows were rejected. ",
    "playlist.saved": "Saved: {n} stations",
    "playlist.save_failed": "Could not save: {error}",
    "common.ready": "Ready",
    "common.list_empty": "The list is empty",
    "common.cancel": "Cancel",
    "common.unknown": "unknown",
    "common.checking": "Checking…",
    "common.sending": "Sending…",
    "common.working": "Working…",
    "common.saved": "Saved",
    "common.show": "Show",
    "common.hide": "Hide",
    "common.no_device": "No connection to the device",
    "common.command_failed": "The command did not go through",
    "common.device_refused": "The device did not run the command",
    "common.save_failed": "Could not save",
    "settings.lead": "The same as on the device screen, plus the network and the account.",
    "settings.device": "Device",
    "settings.group_general": "General",
    "settings.group_time": "Time",
    "settings.group_display": "Display",
    "settings.group_encoder": "Encoder",
    "settings.theme": "Theme",
    "settings.theme_standard": "Standard",
    "settings.theme_contrast": "Contrast",
    "settings.theme_custom": "Custom",
    "settings.theme_ground": "Background",
    "settings.theme_text": "Main text",
    "settings.theme_artist": "Artist",
    "settings.theme_secondary": "Secondary text",
    "settings.theme_dim": "Dim text",
    "settings.theme_accent": "Accent",
    "settings.theme_saver": "Screensaver background",
    "settings.theme_reset": "Reset to standard colours",
    "note.theme": "The colours change on the device screen at once. If something becomes unreadable, the Theme row on the device takes you back to Standard.",
    "player.tone": "Tone",
    "player.tone_bass": "Bass",
    "player.tone_nudge": "This station's volume",
    "player.tone_treble": "Treble",
    "player.balance": "Balance",
    "player.balance_left": "L",
    "player.balance_right": "R",
    "player.db": "dB",
    "player.tone_reset": "Reset",
    "player.tone_close": "Close",
    "player.tone_failed": "The tone did not change",
    "settings.loudness": "Loudness",
    "settings.loudness_off": "Off",
    "settings.loudness_weak": "Weak",
    "settings.loudness_medium": "Medium",
    "settings.loudness_strong": "Strong",
    "settings.loudness_treble": "Treble too",
    "settings.level_normalize": "Level the volume",
    "settings.group_output": "Sound output",
    "settings.spdif_output": "Sound over S/PDIF",
    "note.spdif_output": "The sound goes to the digital S/PDIF output instead of the built-in DAC. Recordings above 48 kHz go out at half or a quarter of their rate. Bluetooth from a phone comes here too when the module's DIN wire goes to the ESP32, otherwise it plays through the DAC. While a Bluetooth speaker is connected the sound is its.",
    "level.measuring": "Measuring the level…",
    "level.louder": "The station is louder: turned down by {db} dB",
    "level.quieter": "The station is quieter: turned up by {db} dB",
    "level.even": "The level is right",
    "level.capped": "The station is {db} dB quieter, and there is no room left to lift it",
    "level.tags": "From the track's own measurement: {db} dB",
    "level.learning": "adjusting",
    "level.kept": "remembered",
    "note.loudness": "The quieter the volume, the more the bass is lifted - the ear misses it in quiet sound. No effect at full volume.",
    "settings.volume_step": "Volume step, %",
    "settings.group_switching": "Changing station",
    "settings.soft_start": "Soft start",
    "note.soft_start": "On a change of station or source the sound rises from silence to the set volume over two seconds. A change of track in files or in a wave is as before.",
    "settings.group_fm": "FM radio",
    "settings.fm_gain": "FM level, dB",
    "note.fm_gain": "FM's loudness against internet radio and files. Raise it if FM is noticeably quieter; at a high setting the loudest moments may be clipped.",
    "note.volume_step": "How many percent of volume one click of the encoder or one press of a remote volume key moves.",
    "settings.language": "Language",
    "settings.home_screen": "Home screen",
    "settings.home_list": "List",
    "settings.home_feed": "Feed",
    "settings.feed_reverse": "Feed turns the other way",
    "settings.scroll": "Scrolling",
    "settings.scroll_bounce": "Back and forth",
    "settings.scroll_left": "Leftwards",
    "settings.buffer": "Buffer",
    "settings.buffer_text": "Text",
    "settings.buffer_graph": "Graph",
    "settings.autoplay": "Autoplay",
    "settings.power_restore": "SmartStart",
    "settings.files_end": "End of folder",
    "settings.files_end_stop": "Stop",
    "settings.files_end_repeat": "Start over",
    "settings.yandex": "Yandex Music",
    "settings.timezone": "Time zone",
    "settings.timezone_search": "Search time zones",
    "settings.timezone_unavailable": "The time zone catalog is unavailable.",
    "settings.ntp": "Time server",
    "settings.device_name": "Device name",
    "settings.device_name_note_wifi": "What the device's Wi‑Fi network is called during first setup; in Latin letters, the name.local address in a browser. Empty means the built-in name.",
    "settings.device_name_note": "What the device is called over Bluetooth and as the Wi‑Fi network during first setup; in Latin letters, the name.local address in a browser. Empty means the built-in name.",
    "settings.group_weather": "Weather",
    "bt.group": "Sound over Bluetooth",
    "bt.output": "Send to a speaker",
    "bt.chosen": "Speaker:",
    "bt.none": "none chosen",
    "bt.connected": "(connected)",
    "bt.disconnected": "(not connected)",
    "bt.scan": "Find speakers",
    "bt.scanning": "Looking for speakers and headphones… Put them in pairing mode.",
    "bt.scanning_button": "Looking…",
    "bt.scan_empty": "Nothing new found. Is the speaker in pairing mode? One already connected does not answer a search.",
    "bt.phone": "(the module is with the phone)",
    "bt.playing": "playing",
    "bt.phone_note": "While the phone plays, the speaker and the search wait: the module does one of the two at a time. Leave the Bluetooth source and the sound goes to the speaker again.",
    "bt.scan_failed": "Could not start the search",
    "bt.forget": "Forget",
    "bt.unnamed": "unnamed",
    "settings.weather": "Source",
    "settings.weather_off": "Off",
    "settings.latitude": "Latitude",
    "settings.longitude": "Longitude",
    "settings.owm_key": "OpenWeatherMap key",
    "settings.key_set": "set",
    "settings.key_unset": "not set",
    "settings.weather_now": "Now",
    "weather.no_key": "no key",
    "weather.waiting": "waiting for an answer…",
    "weather.failed": "the service did not answer",
    "weather.failed_status": "the service answered {status}",
    "weather.key_refused": "the key was refused",
    "weather.clear": "clear",
    "weather.partly_cloudy": "partly cloudy",
    "weather.cloudy": "cloudy",
    "weather.fog": "fog",
    "weather.rain": "rain",
    "weather.snow": "snow",
    "weather.sleet": "sleet",
    "weather.thunderstorm": "thunderstorm",
    "settings.brightness": "Brightness",
    "settings.screensaver": "Screensaver",
    "settings.screensaver_off": "None",
    "settings.screensaver_dim": "Dim",
    "settings.screensaver_blank": "Blank",
    "settings.screensaver_clock": "Clock",
    "settings.screensaver_weather": "Weather",
    "settings.screensaver_after": "After, s",
    "settings.screensaver_when": "Comes on",
    "settings.screensaver_when_always": "Always",
    "settings.screensaver_when_idle": "When nothing plays",
    "settings.idle_brightness": "Idle brightness",
    "settings.flip_vertical": "Flip vertically",
    "settings.flip_horizontal": "Flip horizontally",
    "settings.invert_colors": "Invert colours",
    "note.invert_colors": "If the picture looks like a negative, your display has the other kind of glass - switch this on.",
    "settings.saving": "Saving…",
    "settings.reorder": "Reordering…",
    "wifi.title": "Wi-Fi",
    "wifi.waiting": "Waiting for data",
    "wifi.current": "Current network",
    "wifi.ip": "IP address",
    "wifi.host": "Network name",
    "wifi.saved": "Saved networks",
    "wifi.saved_empty": "No saved networks yet",
    "wifi.nearby": "Networks nearby",
    "wifi.add": "Add a network",
    "wifi.rescan": "Refresh the list",
    "wifi.chosen": "Network:",
    "wifi.ssid": "Network name",
    "wifi.password": "Password",
    "wifi.reveal": "Show",
    "wifi.submit": "Check and save",
    "wifi.connected": "Connected",
    "wifi.connecting": "Connecting…",
    "wifi.no_link": "No connection",
    "wifi.setup_ready": "Ready to be set up",
    "wifi.first": "first",
    "wifi.disabled_until_reboot": "off until the next restart",
    "wifi.make_first": "Make it first",
    "wifi.forget": "Forget",
    "wifi.disconnect": "Disconnect",
    "wifi.open_network": "open",
    "wifi.other_network": "Another network…",
    "wifi.scanning": "Looking for networks…",
    "wifi.scan_failed": "No networks found",
    "wifi.scan_start_failed": "Could not start the search",
    "wifi.need_ssid": "Enter the network name",
    "wifi.busy": "Connecting — please wait",
    "wifi.bad_password": "Wrong password, or authorisation failed",
    "wifi.full": "Five networks are the most it holds — forget one first",
    "wifi.bad_name": "The network name or the password is not valid",
    "wifi.write_failed": "Could not write the settings to flash",
    "wifi.ap_not_found": "The access point was not found",
    "wifi.connect_failed": "Could not connect (code {code})",
    "wifi.forget_confirm": "Forget \"{ssid}\"? The password will have to be typed again.",
    "wifi.forget_active_confirm": "Forget \"{ssid}\"? The device will disconnect from it, ",
    "wifi.disconnect_confirm": "Disconnect from \"{ssid}\"? It will not return until a restart, ",
    "wifi.page_stops": "and this page will stop answering.",
    "yandex.title": "Ya.Music",
    "yandex.checking": "Checking…",
    "yandex.code_lead": "Open the page and enter the code:",
    "yandex.link": "Link an account",
    "yandex.cancel": "Cancel",
    "yandex.refresh": "Refresh the stations",
    "yandex.forget": "Unlink",
    "yandex.not_linked": "Account not linked",
    "yandex.linked": "Account linked",
    "yandex.requesting": "Requesting a code…",
    "yandex.waiting": "Waiting for confirmation",
    "yandex.seconds_left": "The code is valid for another {n} s",
    "yandex.no_connection": "Could not reach Yandex",
    "yandex.expired": "The code expired, try again",
    "yandex.denied": "Sign-in was not confirmed",
    "yandex.server_error": "Unexpected answer from the server",
    "yandex.storage_failed": "Could not store the token on the device",
    "yandex.link_failed": "Could not link the account",
    "yandex.loading": "Loading stations…",
    "yandex.list_failed": "Could not fetch the stations",
    "about.title": "About",
    "about.firmware": "Firmware",
    "about.build": "Build",
    "about.compiler": "Compiler",
    "about.built": "Built",
    "about.web": "Web UI",
    "about.module": "Bluetooth module",
    "about.mismatch": "The firmware and the web interface are from different builds",
    "update.title": "Firmware update",
    "update.current": "Running",
    "update.send": "Upload",
    "update.sending": "Sending… {percent}%",
    "update.press": "Press the encoder on the radio to install {version}",
    "update.restarting": "Restarting…",
    "update.installed": "{version} is installed",
    "update.came_back_old": "The radio came back with {version}",
    "update.no_return": "The radio does not answer after the restart - look at its screen",
    "update.declined": "The install was cancelled on the radio",
    "update.err_refused": "The radio did not accept the file",
    "update.err_not_firmware": "This is not a firmware file",
    "update.err_wrong_chip": "The firmware is not for the ESP32-S3",
    "update.err_not_jradio": "This is not yiRadio firmware",
    "update.err_no_mark": "This version predates updates over the network - flash it by cable",
    "update.err_wrong_display": "The firmware is for another display",
    "update.err_too_big": "The file does not fit the firmware slot",
    "update.err_memory": "The radio ran out of memory",
    "update.err_upload": "The file did not arrive whole - try again",
    "update.err_flash": "Could not write the firmware",
    "update.err_verify": "The written firmware did not verify",
    "update.err_mismatch": "The firmware and the web interface are from different versions",
    "update.err_not_web": "This is not a yiRadio web interface archive",
    "update.err_write": "Could not write the web interface",
    "update.latest": "Latest",
    "update.auto": "Check for updates",
    "update.check": "Check now",
    "update.by_hand": "Update from a file",
    "update.checking": "Checking…",
    "update.up_to_date": "The latest version is installed",
    "update.available": "Version {version} is out",
    "update.install": "Update",
    "update.skip": "Skip",
    "update.starting": "Starting…",
    "update.downloading": "Downloading from GitHub… {percent}%",
    "update.err_network": "The radio could not reach GitHub",
    "update.err_release": "The release has no update file",
    "update.err_format": "This firmware is too old for the new format - update from a file",
    "update.err_no_display": "The release has no firmware for this display",
    "update.err_checksum": "The download was damaged - try again",
    "update.err_busy": "The radio is busy with an update already",
    "update.files": "This radio needs {app} and {web} from the releases page: ",
    "update.version_placeholder": "<version>",
    "update.releases": "open it",
    "update.whats_new": "What's new",
    "update.full_history": "The whole change history",
    "update.err_choice": "Choose a .bin firmware, a .tar archive, or both",
    "backup.title": "Backup",
    "backup.download": "Download the archive",
    "backup.choose": "Choose a file",
    "backup.restore": "Restore",
    "backup.chosen": "Chosen: {name}",
    "backup.confirm": "Restore the settings from \"{name}\"? ",
    "backup.confirm_tail": "The current settings are replaced and the device restarts.",
    "backup.restored": "Restored: {files}. The device is restarting…",
    "backup.restored_warn": "Restored: {files}. ",
    "backup.unreadable": "The device could not read: {files}. ",
    "backup.rebooting": "Restarting…",
    "backup.send_failed": "Could not send the file",
    "backup.refused": "The device did not accept the file",
    "backup.err_size": "The file is too large",
    "backup.err_incomplete": "The file arrived incomplete — try again",
    "backup.err_memory": "The device ran out of memory",
    "backup.err_compressed": "The archive uses packing the device does not understand. ",
    "backup.err_compressed_tail": "Upload an archive downloaded from the device, or one file out of it",
    "backup.err_damaged": "The archive is damaged",
    "backup.err_malformed": "This is not a settings archive",
    "backup.err_empty": "The archive holds no device files",
    "backup.err_unknown_file": "An archive is expected, or one of: ",
    "backup.err_contents": "The file does not hold what its name says",
    "backup.err_write": "Could not write the file to the device",
    "note.device": "Written to the device's settings.csv and applied at once — the screen and the buttons on the case show the same.",
    "note.backup": "The archive holds everything the device knows about itself: Wi-Fi networks, settings, the Ya.Music token, the weather key, the keys the remote was taught and the FM stations with their pictures. The playlist is saved separately, on the Stations page.",
    "note.restore": "Restore the whole archive or a single file out of it — wifi.json, settings.csv, yandex.json, weather.json, remote.csv, fm_presets.csv or levels.csv. The device restarts afterwards.",
    "note.update": "Choose both files at once. The radio checks them and asks for a press of the encoder: without it nothing changes. Stations, Wi-Fi and settings stay as they are.",
    "note.update_check": "Once a day the radio asks GitHub whether a new version is out, and tells it nothing about itself. A new version is announced at the top of the page.",
    "note.backup_secret": "The Wi-Fi passwords, the Ya.Music token and the weather key are in the archive as plain text: keep it the way you would keep a password.",
    "note.wifi": "The password is sent once and cleared from the field immediately. The device only looks for networks while it is connected to none.",
    "note.yandex": "The device never needs the Yandex password: the code is confirmed on Yandex's own site and only an access token comes back.",
    "note.versions": "The firmware and the web interface are flashed by different commands, so each has its own version. If they differ, reflash the data partition."
  };

  const EN = {code: 'en', name: 'English'};
  const PARAMETERS = /\{([A-Za-z_]\w*)\}/g;
  const ATTRIBUTES = [
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  const listeners = [];
  let current = 'en';
  let overrides = Object.create(null);
  let requested = 'en';
  let requestId = 0;
  let pending = null;
  let retryAfter = 0;

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function validCode(code) {
    return typeof code === 'string' && code.length < 16 &&
      /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(code);
  }

  function usableText(text, maxBytes, multiline = false) {
    if (typeof text !== 'string' || text.length > maxBytes || text.trim() === '' ||
        /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\ud800-\udfff]/u.test(text) ||
        (!multiline && /[\t\n\r]/.test(text))) return false;
    // Encoded percent triplets represent one UTF-8 byte each.
    return encodeURI(text).replace(/%[0-9A-F]{2}/g, 'x').length <= maxBytes;
  }

  function intlLocales() {
    try {
      return Intl.getCanonicalLocales([current, 'en']);
    } catch (error) {
      // The registry accepts tags that an older browser's Intl may not know.
      return ['en'];
    }
  }

  function parameters(text) {
    return [...new Set(Array.from(text.matchAll(PARAMETERS), (match) => match[1]))].sort().join(',');
  }

  function translatedStrings(strings) {
    const result = Object.create(null);
    for (const [key, english] of Object.entries(ENGLISH)) {
      if (!Object.hasOwn(strings, key)) continue;
      const text = strings[key];
      if (usableText(text, 4096, true) &&
          !/[{}]/.test(text.replace(PARAMETERS, '')) &&
          parameters(text) === parameters(english)) {
        result[key] = text;
      }
    }
    return result;
  }

  function t(key, values) {
    const text = overrides[key] ?? (Object.hasOwn(ENGLISH, key) ? ENGLISH[key] : '');
    if (values == null) return text;
    return text.replace(PARAMETERS, (whole, name) =>
      (Object.hasOwn(values, name) ? String(values[name]) : whole));
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
    apply();
    const key = document.body?.getAttribute?.('data-i18n-page');
    if (key && Object.hasOwn(ENGLISH, key)) document.title = t(key);
  }

  function activate(code, strings) {
    if (code === current) return;
    current = code;
    overrides = strings || Object.create(null);
    paint();
    for (const listener of listeners) listener(current);
  }

  async function getJson(path) {
    const response = await window.fetch(path, {cache: 'no-store'});
    if (!response?.ok) throw new Error('Request failed');
    return response.json();
  }

  function setLanguage(code) {
    const next = validCode(code) ? code : 'en';
    if (next === requested) {
      if (pending) return pending;
      if (next === current || Date.now() < retryAfter) return Promise.resolve();
    }
    requested = next;
    const id = ++requestId;
    pending = null;
    retryAfter = 0;
    if (next === 'en') {
      activate('en');
      return Promise.resolve();
    }
    if (next === current) return Promise.resolve();

    pending = getJson(`/api/locale?code=${encodeURIComponent(next)}`)
      .then((body) => {
        if (!isObject(body) || body.schema !== 1 || body.code !== next || !isObject(body.strings)) {
          throw new Error('Unexpected locale');
        }
        return translatedStrings(body.strings);
      })
      .then((strings) => {
        if (id !== requestId) return;
        pending = null;
        activate(next, strings);
      }, () => {
        if (id !== requestId) return;
        pending = null;
        retryAfter = Date.now() + 5000;
        activate('en');
      });
    return pending;
  }

  async function loadLocales() {
    const body = await getJson('/api/locales');
    if (!isObject(body) || body.schema !== 1 || !Array.isArray(body.locales)) {
      throw new Error('Unexpected locale index');
    }
    const locales = [{...EN}];
    const seen = new Set([EN.code]);
    for (const entry of body.locales) {
      if (!isObject(entry) || !validCode(entry.code) || seen.has(entry.code) ||
          !usableText(entry.name, 47)) continue;
      seen.add(entry.code);
      locales.push({code: entry.code, name: entry.name});
    }
    return locales;
  }

  /* The stations editor and remote page have no socket. Follow the device
     without holding a connection slot or polling while in the background. */
  function followSettings() {
    let timer = null;
    let reading = false;
    function refresh() {
      if (reading || document.hidden === true) return;
      reading = true;
      getJson('/api/settings').then((settings) => {
        if (typeof settings?.language === 'string') setLanguage(settings.language);
      }).catch(() => {}).finally(() => {
        reading = false;
        if (document.hidden !== true) {
          timer = window.setTimeout(() => {
            timer = null;
            refresh();
          }, 5000);
        }
      });
    }
    document.addEventListener('visibilitychange', () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      refresh();
    });
    refresh();
  }

  window.jradioI18n = {
    t, apply, setLanguage, loadLocales, followSettings, intlLocales,
    language: () => current,
    onChange: (listener) => { listeners.push(listener); },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paint);
  } else {
    paint();
  }
})();
