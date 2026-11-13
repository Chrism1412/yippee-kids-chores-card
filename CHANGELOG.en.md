# Changelog

🇩🇪 [Deutsche Version](CHANGELOG.md)

All notable changes to **Yippee! - Kids Chores**.
Version numbers: `MAJOR.MINOR.PATCH` – bug fixes raise PATCH, new features MINOR, fundamental changes (e.g. to the storage format) MAJOR.

Labels in quotes are shown as they appear in the English interface. Sensor attribute names (e.g. `heute_netto`, `fehlen`) are German in every language, so automations keep working when the language changes.

## [1.8.0] – 2026-11-11

### 🦷 The highlight: the toothbrush timer
Optional under ⚙️ Settings → ⚙️ General → 🦷 Toothbrush timer. When switched on, brushing tasks get a **🦷 Let's go!** button in the kids view, and the parents view gets the new **🦷 Teeth** tab. There you pick which tasks belong to it from a list: linked tasks at the top, all others collapsible, grouped by child or “Together”.
- **Brush the picture free:** the screen is full of toothpaste foam. The timer runs for 1, 2 or 3 minutes (per child) in 4 areas – top left, top right, bottom left, bottom right. The brush scrubs tooth by tooth: in the first pass the foam gets thinner, in the second it is brushed away – with foam splashes, foam leftovers that “pop” at the end of the area and soft, wavy transitions between the areas. The toothbrush turns to match the side; plus a tip for each area, a change sound and a small mouth showing the area. At the end “Sparkling clean! ✨” with confetti. The picture then stays: **🖼️ View picture** shows it in full, only **Next** goes back to the chores.
- **⭐ Stars right away:** with the timer the task is ticked off directly, without parent approval (“✅ Credit right away with timer”, can be switched off). Stars **the same for all** or **per child & time of day** – if a child dislikes brushing in the morning, for example, give more stars there and the tile shows “🔥 Extra!”. Whoever ticks off without the timer gets the task's stars (or optionally the timer stars too). Undoing takes back exactly the stars that were booked; double points days and the birthday factor apply as always.
- **🔒 Tick off only with timer** (optional): tapping the task then starts the timer. **🔥 Bonus after 7 days in a row** (optional): when every brushing on 7 days was done with the timer. Brushing tasks have only this one 🔥 streak – the general streak bonus does not count on top, and the tile shows the brushing streak.
- **🖼️ 14 hand-drawn templates** – moon landing, dragon castle, diving at the reef, treehouse at night, pirate ship, dino valley, fire brigade, farm, penguins on the ice, safari, circus, unicorn meadow, magic forest, steam train – plus **📷 your own pictures** (resized automatically, optionally for one child only; upload by administrators only; one picture per selection in the Home Assistant app, several at once in the browser). Chosen **🎲 at random** (a picture only comes again when all others had their turn – never twice on the same day) or in **🔢 fixed order**; single pictures can be hidden. Kids collect their pictures under “🦷 My brushing pictures”.
- **🎵 Music:** a specially composed, calm 2-minute tune (own file, loaded only when brushing), your own MP3s or random; change sound and “ta-da” can be switched off individually. Optional **🔊 brushing sound**: scrubbing or electric toothbrush (with vibration where the phone supports it; always off with an Oral-B toothbrush).
- **🤖 Your own pictures with AI:** the 🦷 Teeth tab has a ready-made prompt in two styles (🧸 playful 3–8, 😎 cool 9–14) – enter a subject or pick an idea or 🎲, **📋 Copy**, paste it into ChatGPT, Gemini or Microsoft Designer. Afterwards you can adjust the picture in the same chat in your own words – that way you also get a whole series in the same style.
- **✨ Moving effects** (twinkling stars, bubbles, floating lights) and optional **🌫️ picture sharp only at the end** – for kids who otherwise just look at the picture instead of brushing.
- **🦷 Oral-B:** with Home Assistant's “Oral-B” integration (Bluetooth), choose the toothbrush per child – the timer starts by itself as soon as it runs, pauses when it's off (“⏸️ Toothbrush off – keep brushing!”) and warns about too much pressure.
- The screen stays on while brushing. Cancelling needs a second tap on ✕ – then nothing is booked. If approval is pending, a missed message is open or the task is already done, there are no double stars.
- The timer is a separate file (`yippee-kids-chores-teeth.js`, music `yippee-kids-chores-teeth-music.js`) and is only loaded when needed. Settings and progress are included in the backup. New manual topic in all 27 languages.

### Other
- **README:** the note “Since version 1.4.0 the card consists of several files” has been removed; the manual installation now correctly says to copy all files from `dist/` when updating.
- **🇬🇧 English changelog** ([#16](https://github.com/Chrism1412/yippee-kids-chores-card/issues/16), idea by [@gogui63](https://github.com/gogui63)): `CHANGELOG.en.md`, release notes in German and English from now on.

## [1.7.2] – 2026-11-08

Thanks to [@RkcCorian](https://github.com/RkcCorian) for the hint ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14))!

### Improved
- **📱 Approve via notification button – the message disappears from all phones immediately, even without an open card** ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14)): Until now the card only removed the message from the other phones once a Yippee! card was open somewhere. Now the “Buttons in notifications” automation does this directly in Home Assistant: if Dad taps ✓ Approve, the message also disappears from Mom’s phone right away. The stars are booked as before, as soon as a card is open again.
- **Nothing to set up:** If the card created the automation for you, it is rewritten automatically the next time an administrator opens the parents view – and again whenever the phones under 🔔 Notifications change. If you created it by hand: copy the YAML again under 🔔 → ✓ Buttons.
- **🔁 Sensor template added twice?** If the template for “🔁 Available right after a restart” is in two places (e.g. the old one in `configuration.yaml` and the new one in `packages/yippee.yaml`), Home Assistant keeps using the old one – so the “new template” hint stayed even after copying it again. The card now detects this (as administrator, from the Home Assistant log) and says exactly what to do: delete the old copy, restart. The instructions also point out that the template belongs in one place only.

## [1.7.1] – 2026-11-07

Thanks to [@RkcCorian](https://github.com/RkcCorian) for the idea to point out an outdated sensor template ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13))!

### New
- **🔁 Hint when the sensor template is outdated** ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13)): The copied template for “🔁 Available right after a restart” now carries an ID. If the template changes – after an update, through new children or settings like 💶 Pocket money – the parents view shows a hint at the top of the 📋 Today tab, and 📊 Sensors says “🔁 There is a new template”. Then simply tap “📋 Copy template”, paste it again and restart Home Assistant. **If you already use the template, you’ll see the hint once after the update** – the 1.7.0 template has no ID yet.
- **🧹 Reset the advent calendar completely** (🎄 Advent → 🚪 Doors, per child): closes all doors and takes back the stars, vouchers and gifts of this season. After that, opening a door books everything normally again – handy after a test with a changed date. “🚪 Close all doors” leaves stars and gifts as before.

### Fixed
- **⏰ Wrong clock on the device:** Every booking carries the device’s time. If the clock was ahead (e.g. the date set to 24 Dec for testing), such bookings stayed “open” until that date and were shown again and again – a redeemed voucher kept coming back. They are now settled right away.
- **🎟️ Redeemed vouchers never come back:** The child now remembers redeemed vouchers. If a booking with the same voucher arrives late (other device, wrong clock), it doesn’t appear again.

### Other
- **🛒 Marketplace instead of HACS:** Since Home Assistant 2026.11, HACS is built in as the **Marketplace**. Texts in the card, the manual and the README now say Marketplace (formerly HACS); the installation guide shows the new way (Settings → Marketplace → 🔗 “Add from link”). For manual installation the resource is now `/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js` – works with and without the Marketplace (the old path `/hacsfiles/…` still works). If the card is registered as a resource twice, the card prefers to keep the Marketplace entry.
- **☕ Support:** If you like, you can now support Yippee! with a coffee – [buymeacoffee.com/Chrism1412](https://buymeacoffee.com/Chrism1412) (❤️ Sponsor button in the repo and a “Support” section in the README). Completely voluntary, Yippee! stays free.

## [1.7.0] – 2026-11-04

Thanks to [@RkcCorian](https://github.com/RkcCorian) for reporting the missing sensors after a restart ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13)), the idea to remove handled approvals from all phones ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14)) and the report about custom emojis disappearing ([#15](https://github.com/Chrism1412/yippee-kids-chores-card/issues/15))!

### 🎄 The highlight: the advent calendar
Just in time for Christmas, Yippee! gets its own **advent calendar** (optional, ⚙️ Settings → ⚙️ General → 🎄 Advent calendar):
- **24 doors for each child** (optionally up to New Year’s Eve), in a colourful random order – with text, emoji, picture, 💌 personal message, ⭐ stars or a 🎁 **reward as a gift** (without taking stars; with 🎟️ Vouchers it arrives as a voucher).
- **✨ Filled in seconds:** templates for baking, crafting, reading aloud, vouchers and riddles – plus the special days like St. Nicholas, the four Sundays of Advent (recalculated every year) and Christmas Eve.
- **🔗 Tasks first, then the door:** Optionally a door only opens once a certain task or a number of tasks is done today.
- **🎄 Advent calendar only:** Children don’t see rewards with this tick anywhere else – only a door gives them away.
- **Festive look:** starry night with garlands and snowy landscape, colourfully patterned doors, ❄️ snowfall, 🔔 bells or your own sound, ⏳ countdown to Christmas Eve, 🎚️ door size slider – for everyone, “📱 this device only” or just for one card (`advent_size` in the card editor, e.g. for the wall tablet); automatically smaller on narrow screens – everything adjustable, including your own pictures and sounds to upload.
- **📱 Morning message** to the child’s phone and **🧪 Test mode** to try it out already in November.
- Parents fill everything in the new **🎄 Advent** tab; children open their door in December using the **🎄 button** in their view or in a separate card with `mode: advent`. The calendar is a separate file (`yippee-kids-chores-advent.js`) and is only loaded when switched on; the doors are included in the backup.

### New
- **👧 Sort rewards by child** (🎁 Rewards → Sort): next to ⭐ Stars and 🔤 A–Z there is now **👧 By child** – first, for each child, the rewards just for that child (if one applies to several but not all children, it is listed with each of them), then 👨‍👩‍👧 For all children, 👫 Shared / Invite and 🃏 Joker. Within each group by stars. The children appear in the order from the 👧 Kids tab. The kids view stays unchanged.
- **🎁 Redeem rewards directly (parents view):** In the 📋 Today tab every child has a 🎁 button. It shows this child’s rewards with their price; if the stars are enough, “Redeem” and a second tap to confirm is all it takes – instantly, without approval, otherwise exactly like an approved request (stars, history, weekly limit, change log). Since the parents hand over the reward at the same time, it counts as received immediately – no 🎟️ voucher is created. Shared rewards: 👫 everyone pays their share or 💝 the child invites; if a shared redemption is already running, only the missing children pay. An open request from the child is completed along with it.
- **🕒 Times for presence exceptions** (👧 Kids → ✎ → 🏠 Presence → 📌 Exceptions): optional “from” (first day) and “until” (last day) – e.g. “here from 30 Oct 17:00 until 1 Nov 18:00”. Before arrival or after departure, tasks don’t count as missed and the 🔥 streak is kept; before and after that, whatever normally applies (rules, holiday arrangement). Without a time, the whole day as before.
- **▾ Collapsible parents’ Today:** In the 📋 Today tab, every child and – with ⏰ Day blocks – every block (Morning, Midday, Afternoon, Evening, No time) can now be collapsed and expanded with a tap. When collapsed, name, stars, 😊/😠 and 🎁 stay visible, plus the progress (“2/5 done today” or 2/3 for a block). The device remembers what is collapsed; by default everything is open. Times of day that are over or completely done collapse automatically (as in the kids view, setting “⏰ Collapse past blocks”); a tap reopens them for today. With several children, “▸ Collapse all” collapses all at once.
- **🔁 Sensors available right after a restart** ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13), reported by [@RkcCorian](https://github.com/RkcCorian)): Until now `sensor.yippee_<name>` was gone after a Home Assistant restart until someone opened the card – a card only runs in the browser, and Home Assistant forgets such values on restart. New and optional under ⚙️ → 🔌 Devices & voice → 📊 Sensors: “🔁 Available right after a restart”. The card then shows a ready-made template (📋 copy → `configuration.yaml` → restart) and additionally stores each child’s status in the Yippee list – also from kids’ devices, without administrator. Home Assistant reads it itself at startup and every minute; all attributes are kept (daily values = last known status). Same sensor names as before, automations don’t need to be changed. The easiest way is to save the template as its own file `packages/yippee.yaml` (if “packages” is set up). Once it runs, the card only shows “✅ Persistent sensors active” (the template itself is collapsed); if it no longer matches after new or renamed children, “⚠️ Copy the template again” appears with the affected children. With a family goal there is also `sensor.yippee_familienziel` (state = collected stars; attributes `ziel`, `ziel_sterne`, `fehlen`, `prozent`, `erreicht`, `prognose_tage`, `prognose_datum`) – e.g. for an announcement when the goal is reached. When someone ticks something off, the sensors are up to date within a few seconds (not only at the next minute). Requires Home Assistant 2025.10 or newer.
- **🌙 Colour presets in dark mode:** If Home Assistant is set to dark on a device, the light presets (☀️ Light, 🌸 Pastel, 🌊 Ocean, 🌲 Forest, 🌞 Sun, 🍭 Candy) automatically turn dark there – in the same hue instead of glaring light boxes on a black background. When you switch, the card follows instantly. 🌙 Dark and 🌌 Night stay as they are. ✏️ Custom colours can also be darkened if you like (“🌙 Automatically dark in dark mode”, off by default).
- **🤖 Ready-made automations** (via button for administrators or as YAML, using the sensors): 🎉 announcement on the selected speakers and a message to the parents as soon as the family goal is reached (🎁 Rewards → 👨‍👩‍👧 Family goal) · 📋 evening reminder at a selectable time (default 19:00): one message saying which child still has what open – only for children who are present, and only if something is still open (⚙️ → 🔔 Notifications → 🔔 Notify on …). If something changes in the settings, the card offers “🔄 Rewrite automation”.
- **📱 Handled approvals disappear from all phones** ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14), idea by [@RkcCorian](https://github.com/RkcCorian)): When a parent approves or rejects a task or reward – in the card or via a button in the message – the Home Assistant app push message is also removed from the other parents’ phones. The same goes for decided “missed” messages, grades and when a child takes back a task. With Telegram, the buttons in the chat are removed as before.

### Fixed
- **🎟️ Completed vouchers came back:** The card settles point bookings (including “✓ Received”) with the child’s status in the background. If there was a pause between reading and saving – e.g. because a phone with an open card went to standby – and another device had booked something in the meantime, the card then wrote back an outdated status: ticked-off vouchers reappeared. Now the card reads fresh data right before saving and only discards bookings once they are safely saved.
- **🌙 “The evening before” with custom weekdays:** If you picked e.g. Monday and Tuesday for a school task plus “🌙 The evening before”, the task still came on Monday and Tuesday instead of the evening before. Now: you pick the days with school or the appointment (Mon, Tue), and the task comes on the evening before each (Sun, Mon) – as already in the 🎽 sports days dialog. Open existing tasks with this setting once and check the days.
- **Custom emojis** ([#15](https://github.com/Chrism1412/yippee-kids-chores-card/issues/15), reported by [@RkcCorian](https://github.com/RkcCorian)): Newer emojis such as 🪥 🫧 🪶 🧊 🪁 were silently replaced with older ones (🦷 🧼 …) when saving, so that old devices wouldn’t show an empty box. Emojis you choose yourself now stay as they are – for tasks, rewards and children. The built-in templates still only use emojis that display everywhere.
- **🌐 Language with several cards on one page:** If you chose the language by hand (first window, assistant or ⚙️), another Yippee! card on the same page could reset it shortly afterwards. The chosen language now stays.
- **🧙 Setup assistant:** If the card redrew in between (e.g. because something was saved on another device), ticks you had just set for tasks, rewards or features were lost. The selection is now kept.
- **🙋 Bonus tasks in the parents’ Today:** After their time window ended, they showed a red ✕ like missed required tasks – although they are voluntary and can’t be missed. Now without ✕.
- **📊 Reports:** The “Weeks” tab was lowercase in some languages (e.g. English “weeks” next to “Days”).
- **“Really …?” confirmations** (Clean up old entries, Remove PIN, Apply data check, Clear points history): If the card redrew between the two taps (e.g. because another device saved something), the confirmation was gone and the second tap asked again. The confirmation now stays for 8 seconds.
- **Page jumped to the top while scrolling:** After redrawing, the card restores the scroll position one frame later. If that came late (e.g. on slow tablets), it could reset a position that had changed in the meantime. Now it only readjusts if the redraw actually moved the page.
- **🏠 Presence on narrow phones:** For rules and exceptions, the right-hand date fields and the ✕ button stuck out over the edge.

## [1.6.0] – 2026-10-30

### New
- **👆 Tap the summary card** ([#12](https://github.com/Chrism1412/yippee-kids-chores-card/issues/12), idea by [@RkcCorian](https://github.com/RkcCorian)): The small summary (`summary: true`) now supports `tap_action`, `double_tap_action` and `hold_action` like other Home Assistant cards – e.g. tap opens the page with the child’s big card, double tap the points history. Easy in the card editor under “👆 When tapping the summary” (open page, open details, open link) or via YAML with all Home Assistant actions. `{kind}` in the page path is replaced with the name of the tapped child (`/dashboard-haus/{kind}` → `/dashboard-haus/mia`); “Details” automatically shows the child’s `sensor.yippee_<name>`. Without a setting, everything stays as before.
- **📥 Download counter in HACS:** With every release, GitHub now automatically attaches the card’s files. HACS installs from them and counts the downloads again (the counter had stood still since 1.1.0). If the files are ever missing, HACS installs from the repository as before.

### Fixed
- **Parents view on the phone** ([#11](https://github.com/Chrism1412/yippee-kids-chores-card/issues/11), reported by [@RkcCorian](https://github.com/RkcCorian)): In the 📋 Today tab, two children were shown side by side instead of stacked on narrow screens, and the card stuck out on the right. The cause was a name used twice in the styling of the new colour pickers – now back to how it was in 1.4.0.

## [1.5.0] – 2026-10-29

Thanks to everyone who contributed ideas! Many of the ideas in this version come from you:
- [@Locodice67](https://github.com/Locodice67) – from his fork; what wasn’t finished there yet (nap time) is now fully built in
- [@RkcCorian](https://github.com/RkcCorian) – summary card per child, appearance, order of children, equal-height tiles and the hint about the ✓ buttons ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), [#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), [#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), [#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), [#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10))
- [@gogui63](https://github.com/gogui63) – negative balance with net score and stars via automation/voice assistant ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), [#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8))

### New
- **🧒 Small summary card per child** ([#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), idea by [@RkcCorian](https://github.com/RkcCorian)): `summary: true` with `mode: kid` or `kids` shows only points, done today, goal, level and net score – ideal for the family dashboard. Selectable with `show:`, also in the card editor. For history graphs there is still `sensor.yippee_<name>`.
- **🎨 Customise the appearance** ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), idea by [@RkcCorian](https://github.com/RkcCorian)): `compact` (less spacing), `transparent` (no own background) and `scale` (70–130 %) – also in the card editor. For themes and card_mod there are the variables `--yippee-bg`, `--yippee-surface`, `--yippee-accent`, `--yippee-text` and `--yippee-text-secondary`.
- **📏 Equal-height tiles** ([#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10), idea by [@RkcCorian](https://github.com/RkcCorian)): Every task tile has room for three lines of name and two lines of info – if several kids cards are side by side, the rows line up. Longer names are shortened with “…”. The 🎁 rewards are aligned the same way (name two lines, button flush at the bottom). `equal_tiles: true` or via switch.
- **🎨 Colours without card_mod** (⚙️ General → 🎨 Appearance): colour presets to tap – like the dashboard, ☀️ Light, 🌙 Dark, 🌸 Pastel, 🌊 Ocean, 🌲 Forest, 🌞 Sun, 🌌 Night, 🍭 Candy – or ✏️ custom colours with a colour picker for background, tiles, text and accent. If you only choose the background, matching text and tiles are set automatically; if the text is hard to read, the card warns you. While dragging in the colour picker you see the change instantly. Per card in the card editor or with `colors: dark` etc.
- **🎨 Appearance also under ⚙️ Settings** (⚙️ General → 🎨 Appearance): Equal-height tiles, Compact, No background and Size apply there to all cards on all devices. What is set in the card editor of a single card takes priority (there now each “as in ⚙️ Settings / on / off” – with the currently valid value, e.g. “as in ⚙️ Settings (on)”).
- **👧 Order of children** ([#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), idea by [@RkcCorian](https://github.com/RkcCorian)): ▲▼ in the 👧 Kids tab – applies to all views, reports and messages.
- **➖ Allow a negative balance** ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), idea by [@gogui63](https://github.com/gogui63), ⚙️ → ⭐ Points & bonuses): If you like, minus points also go below 0. The kids view, summary, end of day and weekly review then show the net score (earned minus deducted); the sensors have the new attributes `heute_netto` and `woche_netto`. The setting applies from the moment it is switched on – earlier bookings stay as they were.
- **🤖 Stars via automation or voice assistant** ([#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8), idea by [@gogui63](https://github.com/gogui63)): The script `script.yippee_sterne` (fields `kind`, `sterne`, `grund`) gives or deducts stars – from automations, scripts or via one script per child with Google Assistant/Alexa. Create it with one tap under 🔌 Devices & voice → 📊 Sensors & automations (as administrator) or via YAML. It is booked as soon as a Yippee! card is open; the history shows “🤖 …”.
- **🎁 Rewards only for certain children:** In the reward editor, “For which children?” – e.g. the Lego set only for Ben. Other children don’t see the reward and can neither redeem it nor choose it as a goal. Under 🎁 Rewards it says “👧 only for …”. The default stays: for everyone (existing rewards don’t change). Shared rewards still use their own selection of children.
- **📊 Weekly review compared to the previous week:** e.g. “75/118 done (↗ +8 %)”. On Sundays also for stars (“+100 ⭐ earned (↘ −12)”) – during the week, comparing stars with an unfinished week would be misleading.
- **⬇️ Reports as a table (CSV):** under 📊 Reports – days or weeks with done, due, stars and redeemed per child, straight into Excel (in the Home Assistant app via “Share”).
- **📊 Reports** in the 👧 Kids tab: one table with all children – **Days** (done/due, stars earned, pending approvals; tapping shows the day’s tasks and bookings) and **Weeks** (including redeemed stars). After each day the card stores a small, frozen snapshot per child – 60 days and 52 weeks, together only about 3 KB per child. The values don’t change later, not even through changed tasks or “Clean up”. Filled from the update onwards.
- **🌙 End of day and 📊 weekly review compact:** at the top one line with all children (“🦊 Mia 6/6 ✅ · 🐻 Ben 4/5”) – so you can see each child even in the collapsed phone notification – below that stars, pending items and status per child. Open tasks only on request (“📋 List open tasks too”). New: **“👧 One message per child”** (then everything in one line, the name is in the title) and **“Send to”** – selectable per report which phones/Telegram chats it goes to (default: all). Also applies to the 🌙 background automation (rewritten automatically as administrator).
- **💬 Telegram commands `/heute` and `/woche`:** End of day or weekly review right away in the chat. The command automation is extended automatically the next time an administrator opens the card.
- **📚 Events as tasks** (new feature, ⚙️ Settings → ✅ Tasks & daily routine): “＋ Link calendar” – every entry of a Home Assistant calendar becomes its own task with its text as the title, ideal for homework (“HW: Maths p. 42” appears the day before it’s due). Selectable: children, emoji, stars, the day before or on the day, keyword filter and minus points (default 0). Under ✅ Tasks → 📚 From calendars, single events can be hidden with 🙈.
- **🗓️ Calendar for any task:** Under When? → 🗓️ Calendar, any calendar now works, not just the waste calendar – e.g. “Pack sports bag” the evening before every training session (keyword “Training”). In the 🗑️ waste calendar, “＋ Create task “Take out the rubbish”” creates the matching task with one tap.
- **⚙️ Create lists with one tap** (administrators only): If the storage list is missing, the card creates it itself in the first window – no more detours via the integrations. Likewise, the separate photo list and the second backup list can be created directly in the settings, with a name of your choice (e.g. “Yippee pictures”). If a list with that name already exists, it is used instead of being created twice. Normal users and kids’ accounts don’t see the buttons and never call the admin interface.
- **🌐 Language right in the first window:** Choice of all 27 languages (each in its own spelling), preselected is the Home Assistant language. Only the chosen language pack is loaded; the choice is applied as soon as the list is created. The same selection is available in the setup assistant.
- **📊 Behaviour chart** under 👧 Kids (with 😊 Behaviour switched on): bars for the last 14 days – green = well-behaved, red = naughty, height = stars of the day – plus the average per day and a trend arrow ↗ ↘ →.
- **🏖️ “Only on school-free days”** for tasks (✎ → bottom): The task only appears at weekends, in the school holidays and on public holidays – the counterpart to “🎒 School days only” (both together isn’t possible, the tick switches over).
- **🕒 More relaxed times on school-free days** (optional, ⚙️ Settings → ✅ Tasks & daily routine → ⏰ Day blocks): On school-free days a time window lasts longer – adjustable: until the end of the day block (default; “Brush teeth until 9:00” then until the end of 🌅 Morning), 30 minutes, 1 or 2 hours longer or no time limit. Tasks that must always be on time (e.g. medicine) get the tick “⏰ Fixed time on school-free days too” in the editor. Also applies to reminders, the minus points question, NFC and the background automation.
- **👶 Templates for toddlers from 2 years:** 6 new tasks (e.g. “Take nappies and wipes away yourself”, “Help tidy up toys”, “Help empty the dishwasher”), plus “😴 Take a nap” and “🤫 Quiet time (play quietly)”. Now 221 templates.
- **More fitting age limits:** About 50 templates are now suggested to younger children (e.g. brush teeth, wash hands, put on pyjamas from 2; put on shoes, set the table, feed the pet from 3) – a 2-year-old now gets 28 suggestions, a 4-year-old 67 instead of 35.
- **📋 5 new routines** (now 11): 😴 nap routine, 🛁 bath routine, 🍽️ mealtime routine, 🐾 pet routine and ⚽ sports routine – each with ready-made steps, filtered by age, in all 27 languages.
- **🎒 Saturday school:** School days count as Monday to Friday. If a child also has lessons on Saturdays (e.g. in Italy or Russia), you can tick that for the child (👧 Kids → ✎) – already in the setup assistant. Then school tasks for this child also come on Saturdays (“Pack school bag” on Friday evening), holidays and public holidays stay free, and “🏖️ Only on school-free days” tasks are skipped on their school Saturdays.

### Improved
- **📈 5-week chart now in 📊 Reports:** The former “monthly statistics” (which actually showed 5 weeks) is no longer a separate switch but the third tab “📈 5 weeks” under 👧 Kids → 📊 Reports – for all children at a glance, next to “Days” and “Weeks”.
- **💾 Backup tidied up:** at the top the backup file (Download, Share, Copy, Restore), below it the automatic backup with “Back up now”; the list of existing backups and the second list can be expanded, the data check is at the end.
- **✓ Buttons in push messages easier to check** ([#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), reported by [@RkcCorian](https://github.com/RkcCorian)): Under ⚙️ → 🔌 Devices & voice → ✓ Buttons & Telegram commands it now says when the last button press arrived, from whom and what happened (booked / already decided / ignored – not registered as a parent). If the “📱 HA app” automation is missing, the card points this out clearly there and at 🔔 Approvals – before, the message simply disappeared when tapped without anything being booked.
- **🔒 Clear permissions:** Buttons that only an administrator may use (“⚙️ Create automatically”, “🔄 Rewrite automation”, “＋ Create list”, switching the resource) are no longer shown to normal users – instead it says “🔒 Administrators only – or copy the YAML”. The card also never calls an admin interface for them in the background (verified by tests).
- **✓ Approve all tasks:** If several completed tasks are waiting in the 📋 Today tab, you can approve them with one button (with confirmation). Rewards, wishes and grades stay individual.
- **⧉ Copy:** In the editor of a task or reward, “⧉ Copy” creates a copy that you only need to adjust (e.g. “Brush teeth in the evening” from “… in the morning”).
- **Kids view tidied up:** 🏅 Badges (with counter and the badges earned) and 📅 Coming up (with count) are collapsed and can be tapped open – each device remembers this.
- **👧 Kids tab more compact:** Points − / + and the buttons are in one row; on narrow phones only with icons.
- **🌙 Dark design:** Coloured hints (plausibility check, update, holidays, birthday, double points, behaviour buttons, waiting tasks) now adapt to the Home Assistant theme – easy to read in light and dark.
- **🎁 Rewards sorted:** grouped by type – 🎁 for one child · 👫 shared/invite · 🃏 Joker – and within that either by ⭐ stars (same price → alphabetical) or 🔤 A–Z (“Sort” button under 🎁 Rewards). The order also applies in the kids view.
- **✨ Kids view:** Rewards the stars are already enough for are at the very top under “✨ Redeem now”.
- **👧 Kids tab:** Each child has their own card – at the top stars, today’s progress with bar and level, expanded points ±, goal, buttons, 5-week statistics and behaviour chart. Tapping collapses the card (remembered per device).
- **🔎 Search in the settings:** Under “All settings”, a search field finds every setting. At first only sections with the word in their title or description appear – mere mentions in the text (e.g. “… on approval”) can be added with “🔎 Show more matches in the text” if needed. If there is no title match, the text is searched directly.
- **Switches right in the row:** Every extra feature has an on/off switch on the right of its row – you only need to expand it for options like times or stars.
- **📖 More in the manual:** In every settings section, a button opens the matching manual topic directly.
- **↩️ Undo:** Right after deleting a child, a task or a reward, “Undo” appears for a few seconds – one tap and everything is back (with points and history; also works with the trash switched off).
- **🧭 Setup assistant with 5 steps:** New step “⚙️ Features” – ⏰ Day blocks, 📋 Routines, 👍 Approval and 🎂 Birthday can be switched on right away. The task suggestions are now grouped by time of day (🌅 Morning, ☀️ Midday, 🌇 Afternoon, 🌙 Evening, 📌 No time) – each group can be expanded and collapsed, with a counter “ticked/total” and its own “Select all / None”. Also:
  - **👧 Step 1:** choose avatar and colour right away (expandable, with preview).
  - **✅ Step 2:** **📋 Routines** are now included and appear at the top of each time-of-day group – with all steps to read. Choosing a routine switches 📋 Routines on automatically. 🔎 Search field for all suggestions; with several children every task shows who gets it.
  - **🎁 Step 3:** The star prices can be changed right next to each reward.
  - **⚙️ Step 4:** Choose the phone for notifications right away.
  - **🎉 Step 5:** Ready-made text for the kids card with “📋 Copy” and short instructions.
- **📱 Tabs on narrow phones:** If the names don’t quite fit, the card shows only the (larger) icons instead of cut-off words.
- **⚙️ Settings re-sorted:** The big “🧩 Extra features” block is gone. Every feature is now where it belongs by topic, in 8 groups: ⚙️ General · ✅ Tasks & daily routine · ⭐ Points & bonuses · 🎁 Rewards & money · 🔔 Notifications · 🔌 Devices & voice · 📈 Analysis · 💾 Data. Each feature has its own expandable section showing “on” or “off” (e.g. ⏰ Day blocks with times and relaxed times in one place, all bonuses together under ⭐ Points & bonuses). All settings are kept; “Simple” stays as usual. The manual and hints in the card show the new paths.
- **🕐 Set the day blocks yourself** (⚙️ Settings → ✅ Tasks & daily routine → ⏰ Day blocks): You set when Midday, Afternoon and Evening begin. Each block ends where the next begins – overlaps are impossible, wrong orders are rejected. New default: Midday from 11:30, Afternoon from 16:00, Evening from 18:00 (before: midday 12–14). Tasks without a time stay under 📌 No time.
- **🗑️ Trash:** retention selectable – 7, 14 or 30 days (default now 7 instead of 30); after that, items are deleted permanently. Each entry shows when. “🧹 Clean up old entries” now also respects this period (it used to delete after 7 days already).
- **🗂️ Tasks tab clearly structured:** Tasks are listed **per child** under their own heading (with count, collapsible); tasks without a child under “👤 No child”. Below that, selectable (“Group by:”): **⏰ Time of day** (by your day blocks), **🏷️ Type** (📋 Routines / ✅ Required / 🙋 Bonus / ⚡ Special) or **none**. Shared tasks appear with each child with “👥 with …”. ▲▼ only moves within the same child and the same group. The browser remembers the selection and collapsed groups.
- **📖 Manual** extended in all 27 languages (only on school-free days, Saturday school, behaviour chart, relaxed times, custom day block times, trash duration, 11 routine templates).
- **📋 Template choice:** When creating a task for several children, all templates that fit **at least one** selected child are now offered (before, only those that fit all).
- **Routines for older kids:** Morning, evening, weekend and mealtime routines are now suggested up to 14 years (before up to 12).
- **📱 Title on the phone:** “Yippee! - Kids Chores” wraps on narrow screens instead of being cut off.
- **🗂️ Tasks tab:** With “⏰ Time of day” it shows when Midday, Afternoon and Evening begin – and where to change that.
- **📖 Manual:** The setup assistant mentions Saturday school.
- **README:** new features, updated template table (from 2 years) and thanks to Locodice67.

### Fixed
- **Switching the storage list:** If a message from the old list still arrived after switching to another list (e.g. during first setup), the card briefly took over its status – e.g. the language just chosen in the setup assistant was gone again. Messages from the old list are now ignored.
- **📊 Weekly review / statistics in the middle of the week:** Today already counted completely as due – in the morning this made the rate look much too bad. Now only tasks from today count that are done or reported, or whose time window is over.
- **📊 Weekly review / statistics:** Stars for a 💝 invitation or a 👫 share of a shared reward counted as “minus” – now correctly as “🎁 redeemed” (refunded shares are deducted again). Push message, 📊 Reports and 📈 Statistics therefore show the same values.
- Tasks “school days only” showed “daily · 🎒 school days only”. Now it only says “🎒 school days only”.
- Setup assistant: the name and date of birth of a new child could be lost if the card redrew during input.
- “📋 ＋ Routine” only showed the templates that matched the age of **all** selected children – often only 3 or 4. Now all 11 routine templates are always available.

## [1.4.0] – 2026-10-21

### New
- **📖 Manual** in the parents area (📖 top right or ⚙️ Settings): all features briefly explained, with search and keywords (e.g. NFC, presence, PIN), in all 27 languages – 47 topics, also on the setup assistant, shared rewards, storage and all level stages and badges. It is a separate file `yippee-kids-chores-manual.js` next to the card – HACS installs it automatically.
- **🌐 Two new languages: Türkçe (Turkish) and Русский (Russian)** – including the manual. That makes 27 languages.
- **More templates:** 39 new task templates (now 208, e.g. make a salad, water the vegetable patch, take in the washing, settle an argument peacefully), 22 new rewards (now 51, e.g. karaoke night, breakfast in bed, climbing hall, circus) and 4 new routines (after school, homework, room, weekend).
- **More emojis:** about 250 emojis for tasks and 120 for rewards, grouped by topic (e.g. personal care, kitchen, household, school, animals & garden), plus 67 kids’ avatars.
- **🧭 Setup assistant** on first start: children with date of birth → tick matching tasks → choose rewards → done. Can be restarted at any time under ⚙️ Settings. Existing installations don’t see it.
- **⚙️ Settings “Simple” / “All settings”:** only the essentials if you like. After the assistant the card starts in “Simple”; existing installations still see everything.
- **💽 Storage display** under 🔒 Security & data: how much the card uses in the to-do list, with “🧹 Clean up old entries”.

### New (all optional under ⚙️ Settings → 🧩 Extra features)
- **📋 Routines:** own button “📋 ＋ Routine” under ✅ Tasks. Add steps via a search field – matching own tasks and templates appear from the first letter – and sort with ▲▼. Tasks that are part of a routine no longer appear individually, only as a step. The child ticks off every step; the stars come with the last tick. 6 templates: morning, evening, after-school, homework, room and weekend routine.
- **🔮 Savings forecast:** The savings goal and the family goal show roughly when they will be reached at the current pace.
- **🧮 Price assistant:** “≈ days of saving” per child for every reward (clearly arranged: price and saving time per child in one line, with different prices the range on the right, e.g. “50–100 ⭐”) and “Suggest prices” matching the weekly stars (including the family goal).
- **🏷️ NFC tags:** tick off tasks with an NFC tag and the phone; the card creates the automation itself. If no card is open when scanning, the task is ticked off the next time a card opens (the time of the scan counts); the settings show the last scan with its result.
- **👫 Shared rewards:** The price of a reward is split between several children; each pays their share themselves – or one child invites the others and pays everything (“💝 Invite” / “💝 Pay the rest”). Invited children pay nothing and don’t use up their weekly limit. Rejecting, taking back or expiring after 7 days refunds all stars. The other child sees “💝 Mia invites you …” or “👫 Mia would like to share … with you – are you in?” at the top of their dashboard, with a join button.
- **🎟️ Vouchers:** redeemed rewards are only ticked off once the child has received them – in the parents’ 📋 Today tab they are listed as “Redeemed – not received yet” (collapsible), and also with the child.
- **🏅 Weekly bonus** and **👫 Team bonus** for fully completed days.
- **🏠 Welcome on arrival** for children with presence, optionally with a morning message to the parents.
- **🎙️ Voice commands** for the Home Assistant voice assistant (“What does Mia still have to do today?”, “How many stars does Mia have?”).
- **🟦 LaMetric:** completed tasks, “All done!” and rewards on a LaMetric TIME.
- **🩺 Plausibility check** (on by default): hints about inconsistent settings in the Today tab.

### Improved
- **🏅 Tap badges:** In the kids view, tapping a badge shows what it stands for and whether it has been achieved – handy on the phone, where there is no mouse pointer.
- **😊 Behaviour more visible:** In the 📋 Today tab there are now clear buttons – green “😊 +1” and red “😠 −1” with the set number of stars – instead of small icons. The setting is now under 🧩 Extra features → 🎁 Rewards & bonuses.
- **Clearer display for “first come” tasks:** If another child has already done a shared or bonus task, it now says “✓ Already done by Ben” or “⏳ Ben did it – waiting for approval” instead of the misleading “Ben’s turn”.
- **Panel view / wide dashboards:** In the Today tab, the behaviour buttons move into their own row in narrow kids columns instead of overlapping name and stars.
- **🗑️ Waste calendar:** If there is no calendar yet, the hint links directly to the “Waste Collection Schedule” integration.
- **🌐 Language per card:** The hint now correctly explains that a language set in the card editor applies to a single card (e.g. on the kids tablet) – with “Automatic”, every device shows the language of the logged-in user.
- **📊 Weekly review:** Day and time are now adjustable (⚙️ Settings → 🔔 Notify on …).
- **Point bookings as separate entries:** If two devices tap something at the same time, no booking is lost any more.
- **No outdated manual any more:** Manual and language files are reloaded as soon as the card’s resource version is raised (or HACS updates) – even with the same card version.
- **Faster:** The languages are now small separate files next to the card, only the chosen one is loaded – the card shrinks from 1.9 MB to ≈ 0.45 MB and starts faster. HACS installs all files automatically. Presence and streaks are also cached – smoother on older tablets.
- **README:** new screenshots and a thank-you section for the projects Yippee! builds on.
- **GitHub:** templates for bug reports and ideas (they ask for version, installation, device etc. right away), demo animation in the README.
- **Automatic tests:** Every upload to GitHub runs more than 300 checks, including that accounts without admin rights never call admin interfaces.

## [1.3.1] – 2026-10-10

### New
- **👧 Prices per child** (optional, ⚙️ Settings → Extra features): Each reward can have its own price for each child – e.g. because older children can collect more stars per day. In the reward editor each child shows how many stars it can earn on a normal day; “⚖️ Share fairly” recalculates the prices so that every child has to save for about the same time. Children see, save and redeem at their own price.

### Fixed
- **IP ban for kids’ accounts without admin rights** ([#3](https://github.com/Chrism1412/yippee-kids-chores-card/issues/3)): Even for users without administrator rights, the card tried to write the `sensor.yippee_…` sensors and query the status of the automations. Home Assistant rejects this and counts it as a failed login – with `ip_ban_enabled` the device was banned after a short time. The card now only makes these calls for administrators.
- **Photo proof with accounts without admin rights:** no more upload to the media folder (Home Assistant only allows that for administrators). Instead the card stores a downsized photo in a to-do list – either in the main list or in a separate list (⚙️ Settings → Extra features → 📷 Photo proof). The parents see it in the card when approving; it is deleted after the decision. Also applies to photos of school grades.
- **Missing icons:** Some template emojis (e.g. for “Empty the dishwasher”, “Dust”, “Brush teeth”) appeared only as an empty box on older phones and tablets. They have been replaced with emojis every device knows; existing tasks and rewards automatically show the new icon.

**Note:** If a device has already been banned, delete the line with its IP in `/config/ip_bans.yaml` and restart Home Assistant.

## [1.3.0] – 2026-10-09

### New
- **Task database: 163 instead of 81 templates in 12 areas** – all in 25 languages, with a suitable age
  - new areas **❤️ Health & exercise** (e.g. drink enough water, play outside for 30 min, sunscreen, dental floss) and **👨‍👩‍👧 Family & togetherness** (e.g. call grandma or grandpa, write a thank-you card, phone-free hour)
  - morning and evening routine for small children from 4 years (get up, have breakfast, put on shoes, put on pyjamas, go to bed …) – contributed by [@Locodice67](https://github.com/Locodice67) ([#1](https://github.com/Chrism1412/yippee-kids-chores-card/pull/1))
  - more for schoolchildren (pack PE bag, study for the test, prepare a presentation, walk to school alone) and teenagers (do your own laundry completely, make your own doctor’s appointment, scrape the car windows, clean the toilet)
  - new seasons: sunscreen May–September, harvest fruit June–September, bake cookies December, scrape car windows December–March
- **29 instead of 21 reward templates**, including choose the music in the car, 30 min phone time, exclusive time with Mom or Dad, new audio book, stay out longer, €5 pocket money
- **🏠 Presence** (optional, per child) for separated parents and patchwork families: “mostly with us” or “mostly elsewhere” plus any number of rules (here / not here, every week or every 2–4 weeks, from day + time to day + time – e.g. every Wed 14:00 to Thu 08:00 and every 2nd weekend), holiday arrangement per type of holiday (all with us, with the other parent, first/second half, first/last … weeks), alternating yearly, exceptions and preview. If the child isn’t here, there are no tasks, reminders or “missed”; on days with arriving and leaving, only tasks within the presence time. New sensor attribute `anwesend`
- **🃏 Joker** (optional, under Settings → Extra features): a reward that lets the child skip one of today’s required tasks without minus points; the streak is kept and the parents get a message. Parents can also give or take Jokers by hand for a child (✎)
- **😊 Behaviour** (optional): “Well-behaved” button in the Today tab for quick praise with adjustable stars, optionally also 😠 “Naughty” with a deduction; entries in the points history and change log – idea by [@Locodice67](https://github.com/Locodice67)
- **🔁 Several times a day:** up to 5 time windows per task instead of 2; templates like “Wash hands” and “Go to the toilet” come with time windows for morning, midday and evening
- **↕️ Custom order** (optional): sort tasks under ✅ Tasks with ▲▼
- **⏰ Day blocks** (optional): kids and parents views grouped into Morning, Midday, Afternoon, Evening and No time, each with its own progress; blocks can be expanded and collapsed, past ones collapse automatically (can be switched off)
- **＋ Task** directly in the Today tab; the last opened tab is remembered
- **🌙 “The evening before”** with “School days only”: for packing the school bag or PE bag – comes when there is school the next day; for the PE bag the card asks for the sports days
- Order, several time windows, day blocks, fewer clicks and the routine templates: ideas and implementation by [@Locodice67](https://github.com/Locodice67) ([#1](https://github.com/Chrism1412/yippee-kids-chores-card/pull/1)), incorporated and adapted

### Changed
- **Clearer operation:** settings in 4 groups (General · Points & rules · Notifications · Security & data), extra features in 3 groups (For kids · Tasks · Analysis)
- The tab bar fits in one line on every phone; open approvals are only shown in the Today tab, with a counter 🔴 on the tab
- Task list with a filter per child and “＋ Task” at the top; template search in the task editor
- Buttons in the kids list with labels (Suggestions, Grade, History, Edit)
- “Minus points also reduce the family goal” now under ⚙️ Settings → 👍 Approval
- The kids view is now **expanded** by default; still collapsed with `collapsed: true`
- “Wash hands morning/evening/before eating” and “Go to the toilet morning/evening” are each combined into one template with several time windows; new template area ☀️ Midday

### Fixed
- After ticking off, the page no longer jumps to the top (the scroll position is kept)
- “Pack school bag for tomorrow” didn’t come on Sunday evening, but did on the last school day before the holidays – now it counts whether there is school the next day (existing tasks are detected automatically)
- “Rewards” header in the kids view: buttons (🃏 Joker, 🎓 Grade, 💡 Wish) are in their own row and also fit on narrow phones

## [1.2.0] – 2026-10-09

### New
- **🎓 School grades** (optional, under Settings → Extra features): stars for good grades ([#2](https://github.com/Chrism1412/yippee-kids-chores-card/issues/2))
  - enter a grade per child: subject from a quick selection or free text, plus the grade
  - stars automatically by grade table – grading scale matching the country (e.g. DE 1–6, CH 6–1, FR 0–20, IT/ES/NL 1–10, PL 1–6, percent), stars per grade freely adjustable, never a deduction
  - bonus for improving (better than the last grade in the same subject) and report card bonus
  - children report grades themselves, optionally with a photo of the test; approval in the card or via push/Telegram button
  - grade overview per subject with average, count and trend; grade stars count towards level and family goal

## [1.1.0] – 2026-10-08

### New
- **School start per country:** The school templates follow the usual school starting age of the chosen country (e.g. Ireland 5, Germany 6, Poland 7 years)
- **“Started school in (month/year)”** for the child (optional): overrides the country value; the card then shows the school year (e.g. “8 years · 2nd grade”)
- **Detect duplicate resources:** If the card is registered as a resource more than once (e.g. an old file under /local/ and HACS), the parents area warns and removes the unnecessary entries at the push of a button

### Fixed
- Old test versions (e.g. 46, 48) no longer count as newer than 1.x when comparing versions
- Check workflow on GitHub switched to current versions (no more Node.js 20 warnings)

## [1.0.0] – 2026-10-07

First public version.

### Included
- Parents, kids and single-child view with visual editor
- Tasks with weekdays, fixed dates, one-off special tasks and waste calendar; taking turns, “one is enough”, bonus tasks, twice a day, season and “school days only”
- Approval by parents, minus points only after the parents decide
- Rewards with savings goal, wishes, family goal, pocket money conversion
- Levels, badges, streak bonus, double points days, birthday (bonus, points factor, confetti)
- School holidays and public holidays for 36 countries (OpenHolidays, fallback via Home Assistant calendar), own holiday periods
- Notifications via the Home Assistant app and Telegram with buttons, Telegram commands, end of day, weekly review
- Voice output (TTS, Alexa Media Player): morning announcement and reminders
- Sensors per child for your own automations
- Background automation: announcements and messages even without an open card
- Automatic backups (also into a second list), data check, trash, change log
- Parents = selected Home Assistant users, PIN with lock after failed attempts
- Update hints (HACS); after an update the card raises the resource version automatically
- 25 languages: German, Swiss German and all other official EU languages
