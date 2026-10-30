<p align="center">
  <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/icon-512.png" width="120" alt="Yippee! - Kids Chores logo">
</p>

<h1 align="center">Yippee! - Kids Chores</h1>

<p align="center">
  <b>Tick off chores · collect stars · redeem rewards</b><br>
  A Home Assistant card that lets kids do their household chores while parents keep track of everything.
</p>

<p align="center">
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/releases"><img src="https://img.shields.io/github/v/release/Chrism1412/yippee-kids-chores-card" alt="Version"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.10%2B-03a9f4" alt="Home Assistant 2024.10+">
  <img src="https://img.shields.io/badge/languages-27-ffc93c" alt="27 languages">
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT"></a>
</p>

> ⚠️ **Important for updates:** **Since version 1.4.0 the card consists of several files** (card, 📖 manual and one small file per language).<br>
> **HACS:** nothing to do – the update loads everything automatically.<br>
> **Manual installation:** when updating, please copy **all files from [`dist/`](https://github.com/Chrism1412/yippee-kids-chores-card/tree/main/dist)** into the same folder – otherwise the card shows up in German and the manual is missing.


<p align="center"><a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/README.md">🇩🇪 Deutsche Version</a></p>

---

## What is Yippee!?

**Yippee! - Kids Chores** is a single JavaScript card for the Home Assistant dashboard. Kids see today's chores as big, colourful tiles, tap them and earn stars ⭐. They spend their stars on rewards, level up and unlock badges.

Parents create chores and rewards, approve finished chores (also right from the push or Telegram notification) and decide for themselves whether a missed chore costs stars – **nothing is deducted automatically**.

- **No cloud, no account, no server:** all data lives in a *Local To-do* list in your Home Assistant.
- **One file, no dependencies:** no other HACS cards needed, light enough for older tablets.
- **Made for phones:** works in the Home Assistant app in portrait mode just as well as on a wall tablet.

> ### 💡 Ready to go: 221 chores and 51 rewards built in
> No need to start from scratch. The card ships with a **chore database of 221 templates in 12 categories** (including 11 ready-made routines) – from "brush teeth" and "pack school bag" to "empty the dishwasher", "walk the dog" and "mow the lawn" – each with emoji, points and time of day, plus **51 reward templates** (ice cream voucher, movie night, cinema, climbing gym, zoo, circus, theme park …) and about 250 emojis to choose from, sorted by topic.
>
> **Age-appropriate by birthday:** enter a child's birthday and the template list only shows chores that fit their age (4–17): 27 suggestions at age 4, 79 at age 6, 103 at age 8, more than 110 from age 10. The 💡 button on a child suggests all fitting chores they don't have yet – tick and done.

## Screenshots

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/demo.gif" width="300" alt="Demo: ticking off chores"><br><sub>Tap – done – stars! ⭐</sub></p>

| Kids view | Parents view | Rewards | Settings | Presence |
|:---:|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/kinder-ansicht.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eltern-heute.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/belohnungen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/einstellungen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/anwesenheit.png" width="200"> |

*(Screenshots in German – the card shows your Home Assistant language automatically.)*

## Features

### For kids
- Big chore tiles with emoji, points and time window
- Star balance, **10 levels** (from 🌱 Beginner to 💎 Chore King) and **9 badges** – tap a badge to see what it stands for; the 📖 manual explains all levels and badges
- **Savings goal** 🎯, **wishes** 💡, a shared **family goal** 👨‍👩‍👧
- **Joker** 🃏 (optional): redeem it as a reward and skip one required chore without minus stars
- **Rewards for specific children only** 🎁: in the editor under “For which children?” – e.g. the Lego set only for Ben. Other children don't see it
- **Prices per child** 👧 (optional): each reward can have its own price per child – “⚖️ Share fairly” matches it to the stars each child can collect per day
- **Streaks** 🔥 with bonus stars, **"Coming up"** 📅 preview
- **Birthday** 🎂: confetti, bonus, point multiplier, optional day off
- **School grades** 🎓 (optional): stars for good grades – kids can report a grade themselves, optionally with a photo of the test
- Collapsed view: only name and points until tapped

### Chores
- **Weekdays**, **fixed dates**, **one-off special chores** (first come, first served) or **from a calendar** (waste collection, training …) – and optionally **every calendar entry becomes its own chore** (e.g. homework)
- **Rotation** 🔄 between kids (skips kids on holiday), **"One is enough"** 🤝, **extra chores** 🙋
- **Several times a day** (up to 5 time windows, e.g. wash hands morning, noon and evening), optional **own order** ↕️ with ▲▼, **"the evening before"** 🌙 for packing the school or gym bag (shows when the next day is a school day; asks for the PE days; school days count Monday to Friday – tick "🎒 Saturday school" on the child if they also have lessons on Saturdays), optional **day blocks** ⏰ (morning / noon / afternoon / evening, collapsible, past blocks fold automatically, also in the parents view), **seasons** (e.g. mowing April–October), **school days only**
- **Photo proof** 📷 per chore – also works with non-admin kid accounts: the card then stores a smaller photo in a to-do list (ideally a separate one, e.g. “Yippee Photos”)
- **Chore database with 221 templates** (ages 2–17) in 12 categories (morning, noon, school, kitchen & cooking, shopping, tidying & cleaning, laundry, house/garden/pets, responsibility, health & exercise, family & togetherness, evening), filtered by the child's age from their birthday; school chores follow the usual school starting age of the selected country (or an optional "started school in" month per child, which also shows the school year); seasonal chores get their season, school chores "school days only" automatically
- **51 reward templates** (ice cream voucher, karaoke night, breakfast in bed, movie night, one-on-one time with mum or dad, 🃏 joker, cinema, climbing gym, zoo, circus, theme park …)

### Presence 🏠 – for separated parents and patchwork families (optional)

If a child doesn't always live in your household, set it **per kid** under **👧 Kids → ✎ → 🏠 Presence**: **normally** "mostly with us" or "mostly elsewhere", plus any number of **rules** – *here* or *away*, **every week or every 2, 3, 4 weeks**, from day + time to day + time (e.g. away every week **Wed 14:00 – Thu 08:00** and every 2nd weekend **Fri 15:00 – Sun 18:00**). Add a **holiday arrangement** per holiday type (summer, autumn, Christmas, winter, Easter, Whitsun: rules continue, all with us, all with the other parent, first/second half, **first/last … weeks with us**), optionally **alternating every year**, and **exceptions** (date ranges "here"/"away"). A preview of the next 8 weeks is shown in the editor.

While the child is away there are **no chores, reminders or "missed"**, the streak 🔥 is kept, rotations skip the child and the morning announcement leaves them out. On days with arrivals or departures only chores whose time window falls into the time the child is here appear. The holiday arrangement uses the school holidays of your region (⚙️ Settings → 🏖️ Holidays).

### Joker 🃏 (optional)

Turn on under **⚙️ Settings → 🎁 Rewards & money → 🃏 Joker** and add the reward template "🃏 Joker: skip one task" (default 30 ⭐). After redeeming it, the kid gets a **🃏 Joker** button and picks one of today's required chores to skip – no stars, but no minus stars either, and the streak 🔥 is kept. You get a notification and the audit log records it. Any reward can become a joker with the "🃏 Is a joker" checkbox.

### School grades 🎓 (optional)

Turn on under **⚙️ Settings → ⭐ Points & bonuses → 🎓 School grades**.

- **Enter a grade** under **👧 Kids** with 🎓 – pick the subject from a quick list or type it, then the grade
- **Stars from a grade table** that matches your country's grading scale (Germany 1–6, Switzerland 6–1, France 0–20, Italy/Spain/Netherlands 1–10, Poland 1–6 with 6 best, percent …) – fully editable. Lower grades give 0 stars; **stars are never taken away**.
- **📈 Improvement bonus** (default +3 ⭐) when a grade beats the last one in the same subject
- **📜 Report card bonus** (default 20 ⭐)
- **Kids report grades themselves** with 🎓 on their card, optionally with a **photo of the test**; you approve under 🔔 Approvals or straight from the **app or Telegram button**. The photo is deleted after your decision.
- **📊 Grade overview** per kid and subject: average, count, latest grade and trend
- Grade stars count towards **levels** and the **family goal** like all earned stars

### More extra features (all optional)

Each can be switched on under **⚙️ Settings** – every feature sits where it belongs by topic: **⚙️ General · ✅ Tasks & daily routine · ⭐ Points & bonuses · 🎁 Rewards & money · 🔔 Notifications · 🔌 Devices & voice · 📈 Analysis · 💾 Data**, each in its own collapsible section showing “on” or “off”.

- **📋 Routines:** several steps in one chore (e.g. a morning routine); the child ticks off each step, the stars come with the last one. Own “📋 ＋ Routine” button; add steps via search (suggestions from the first letter) from your chores and templates or type them, sort with ▲▼. Chores in a routine only appear as a step. 11 templates included: morning, evening, after-school, homework, room, weekend, nap, bath, mealtime, pet and sports routine.
- **📖 Manual** in the parents area (📖 top right) with **search and keywords** (e.g. NFC, presence, PIN) in all 27 languages – 47 topics from “Getting started” to “👫 Shared rewards” and “💽 Storage & clean-up” – a separate file `yippee-kids-chores-manual.js` next to the card, installed automatically by HACS and loaded only when opened.
- **🔮 Savings forecast:** savings goal and family goal show roughly when they will be reached at the current pace (real stars of the last 3 weeks).
- **🧮 Price assistant:** every reward shows how many days each child saves for it; "Suggest prices" recalculates prices from the children's weekly stars (e.g. "2 rewards per week") and suggests a family goal.
- **👧 Prices per child:** each reward can have its own price per child; "⚖️ Share fairly" calculates from stars per day.
- **👫 Shared rewards:** for rewards several kids enjoy (e.g. waffles for breakfast). The price is split and each kid pays their own share (“👫 Share” – the others see “… wants to share with you – are you in?” right at the top of their view, with a join button). Or one kid **invites** the others and pays everything (“💝 Invite” or “💝 Pay the rest”) – the invited kid sees “💝 … is treating you” at the top. Invited kids pay nothing and don’t use up their weekly limit. After approval every paying kid gets a voucher; rejecting or taking back refunds all stars, open requests expire after 7 days with a refund.
- **🏷️ NFC tags:** a child scans an NFC tag with the phone to complete a chore; the card creates the automation itself. If no card is open while scanning, the chore is checked off the next time the card opens (the time of the scan counts). ⚙️ Settings → ✅ Tasks & daily routine → 🏷️ NFC tags shows the last scan – and why nothing was checked off if it didn't work.
- **🎟️ Vouchers:** redeemed rewards become vouchers that are ticked off once the child got them.
- **🏅 Weekly bonus** and **👫 team bonus** for complete days.
- **🏠 Welcome on arrival** for children with presence, optionally with a morning message to the parents.
- **🎙️ Voice commands:** ask the Home Assistant voice assistant "What does Mia still have to do today?" or "How many stars does Mia have?"
- **🟦 LaMetric:** completed chores, "All done!" and redeemed rewards on a LaMetric TIME.
- **🩺 Plausibility check** (on by default): points out inconsistent settings in the Today tab.

### For parents
- **🧭 Setup assistant** on first start: add kids with date of birth, avatar and colour → tick suitable routines and chores (grouped by time of day, with search) → choose rewards with your own prices → switch on popular features and the phone for notifications → done, including ready-made text for the kids card. Can be restarted any time under ⚙️ Settings
- **Settings “Simple” or “All”**: optionally only the essentials (language, vacation, approval, notifications, backup, access protection) – everything else one tap away, sorted by topic, with a **🔎 search field** (title matches first), **toggles right in the row** and a **📖 button** to the matching manual topic
- **Behaviour** 😊 (optional): reward with one tap on the green “😊 +1” button in the Today tab (stars adjustable), optionally deduct stars with the red “😠 −1” button – logged in the points history. Under 👧 Kids a **📊 behaviour chart** shows the last 14 days with average and trend
- **🏖️ Only on school-free days** for chores that should only appear at weekends, in the holidays and on public holidays – the counterpart to “🎒 school days only”
- **🕒 More relaxed times on school-free days** (optional): on school-free days a time window runs longer – you choose how much: until the end of its day block (“brush teeth until 9:00” then counts until the end of 🌅 Morning), 30 minutes, 1 or 2 hours longer, or no time limit. Chores that must always be on time (e.g. medicine) get the tick **⏰ Fixed time on days without school too**. Sleeping in isn't “missed”. **You set the day block times yourself** (default: midday from 11:30, afternoon from 16:00, evening from 18:00) – each block ends where the next begins, no overlaps; the Tasks tab lists chores **per child**, optionally divided by time of day, by type (routines / required / bonus / special) or not at all – each group collapsible
- **Approval** of chores and rewards – in the card, via app button or Telegram button
- **Penalties only after your decision**: missed = excused, minus stars or done after all
- Manual adjustments, **points history**, **5-week chart** under 📊 Reports, **pocket money** conversion, **double-points days**
- **Holidays** per kid, **school holidays and public holidays** automatically
- compact **daily summary** and **weekly review** messages (one line per child, optionally one message per child and per-report recipients), **📊 reports** in the Kids tab (60 days, 52 weeks, frozen daily snapshots, CSV download), trend vs. last week in the weekly review, **morning announcement** and **reminders** on speakers

### Safety and data
- **Automatic backups** (optionally into a second list), backup file download
- **Data check** that warns about missing or externally changed entries
- **🎁 Rewards sorted by type** (for one kid · together · Joker), by ⭐ stars or 🔤 A–Z – the kid view shows redeemable ones first
- **👧 Kids tab** with one card per kid: stars, today's progress, statistics and behaviour chart in one place
- **✓ Approve all chores** with one tap and **⧉ copy** chores and rewards
- **🌙 Light and dark:** all coloured hints adapt to the Home Assistant theme
- **↩️ Undo** right after deleting, **trash** (7, 14 or 30 days, adjustable) and **change log**
- **💽 Storage overview**: how much the card uses in the to-do list (data, backups, photos …), with a “🧹 Clean up old entries” button
- **Parents = selected Home Assistant users**, **PIN** with lockout

## Requirements

- **Home Assistant 2024.10** or newer
- The built-in **Local To-do** integration
- Optional: Home Assistant companion app, Telegram bot, a TTS integration, a calendar integration for 🗑️ the trash calendar or 📚 events as tasks

## Installation

### HACS (recommended)

1. HACS → ⋮ (top right) → **Custom repositories**
2. Repository: `https://github.com/Chrism1412/yippee-kids-chores-card` · Type: **Dashboard** → **Add**
3. Search **Yippee! - Kids Chores** → **Download**
4. Reload the page

HACS adds the resource automatically.

### Manual

1. Download all files from the [`dist/`](https://github.com/Chrism1412/yippee-kids-chores-card/tree/main/dist) folder: the card `yippee-kids-chores-card.js`, the 📖 manual `yippee-kids-chores-manual.js` and the language files `yippee-kids-chores-lang-xx.js`.
2. Create the folder **`/config/www/community/yippee-kids-chores-card/`** and copy all files into it. This is the same folder HACS uses, so you can switch to HACS later without changes.
3. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.6.0`
   - Type: **JavaScript module**
4. Reload the page.

> **Manual updates:** copy the new file to the same place – that's it. The card raises the number after `?v=` in the resource automatically when an administrator opens the parents area – see [Updates](#updates).

## Setup

1. **Easiest:** add the card to a dashboard and open it as an administrator – the first window offers a 🌐 language picker and the button **“⚙️ Create list “Yippee Kids Chores””**. One tap, done. **Or by hand:** **Settings → Devices & services → Add integration → "Local To-do"** → name: **`Yippee Kids Chores`** → entity `todo.yippee_kids_chores`. This list is the card's storage – please don't edit its entries by hand.
2. Add the cards (the visual editor asks for storage, view and child), or in YAML:

```yaml
# Parents
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: admin
```
```yaml
# All kids (new kids appear automatically)
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: kids
```
```yaml
# One child, e.g. for a tablet in the kid's room
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: kid
child: Mia
```

3. In the parents view: add **kids**, **chores**, **rewards**, then go through **⚙️ Settings**. All settings apply to every kids card and device automatically.

A complete example dashboard is in [`examples/dashboard.yaml`](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/examples/dashboard.yaml).

## Card options

| Option | Values | Default | Description |
|---|---|---|---|
| `storage` | `todo.…` | – | **Required.** The Local To-do list used as storage |
| `mode` | `admin`, `kids`, `kid` | `admin` | Parents view, all kids or one kid |
| `child` | name | – | Only with `mode: kid` |
| `collapsed` | `true` / `false` | `false` | Show kids collapsed |
| `summary` | `true` / `false` | `false` | Only a small summary per kid (points, today, goal, level, balance) – e.g. for a family dashboard |
| `show` | list | all | With `summary`: which parts – `points`, `today`, `goal`, `level`, `net` |
| `equal_tiles` | `true` / `false` | as ⚙️ | Equal-height task tiles (room for three lines) and rewards – several kid cards line up side by side |
| `colors` | `default`, `light`, `dark`, `pastel`, `ocean`, `forest`, `sun`, `night`, `candy`, `custom` | as ⚙️ | Colour preset for this card only (`default` = like the dashboard, `custom` = your own colours from ⚙️) |
| `tap_action` / `double_tap_action` / `hold_action` | Home Assistant action | – | Only with `summary`: what happens when the summary is tapped, double-tapped or held, e.g. `action: navigate` with `navigation_path: /dashboard-haus/{kind}` or `action: more-info` (the child’s sensor). `{kind}` is replaced by the child’s name |
| `compact` | `true` / `false` | as ⚙️ | Less spacing |
| `transparent` | `true` / `false` | as ⚙️ | No own background – blends into the dashboard |
| `scale` | `70`–`130` | as ⚙️ | Card size in percent |
| `family` | `true` / `false` | automatic | Show the family goal on this card (automatically only once per page) |
| `language` | e.g. `en`, `fr` | setting / HA language | Language for this card only (e.g. on the kids’ tablet) |
| `wizard` | `true`, `false` | `true` | `false` = no setup assistant on first start (can still be started under ⚙️ Settings) |
| `pin` | digits | – | Legacy PIN. Better: set it in Settings → 🔒 Access |
| `pin_minutes` | number | `5` | Lock the parents area again after this many idle minutes |

“as ⚙️”: if not set, the card uses what is set in the parents view under ⚙️ Settings → ⚙️ General → 🎨 Appearance for all cards (default: off / 100 %). A value in the card config wins – e.g. only the tablet card larger.

## Integrations

All integrations are **optional** and can be switched on and off individually.

- **Home Assistant companion app:** notifications for finished chores, reward requests, missed chores, daily summary and weekly review – with **action buttons** (approve / reject, excused / minus stars / done). The card creates the needed automation with one tap.
- **Telegram:** the same messages with **inline buttons**, photos for photo proof, and the commands `/punkte` (points), `/offen` (open chores), `/heute` (daily summary now), `/woche` (weekly review now) and `/hilfe` (help). The settings show when the last button press arrived, from whom and whether it was booked – and warn clearly if the buttons automation is missing. A test button shows Telegram's error message if buttons are rejected.
- **Text-to-speech / Alexa:** any TTS integration with media players, or *Alexa Media Player* (HACS) – for the **morning announcement** ("Good morning Mia! Today: brush teeth, make bed and take out the trash (paper).") and **reminders** shortly before a time window ends.
- **🗑️ Trash calendar:** chores like "Take out the trash" or "Pack the sports bag" (keyword `Training`) take their dates from any Home Assistant calendar – e.g. **[Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule)** (HACS, hundreds of providers), a **Remote calendar** with your provider's ICS link, or a **Local calendar**. Per chore: keywords (e.g. `paper, residual`), and **"the evening before"** so the bin goes out in time. The tile shows what is collected.
- **📚 Events as tasks:** under ⚙️ Settings **＋ Link a calendar** – each entry turns into its own chore with its text as the title. Ideal for homework: “HW: Maths p. 42” due Friday shows up on Thursday for the chosen child. Settings: calendar, children, emoji, stars, “the day before” or “on the day”, keyword filter (e.g. `HW:`) and minus points (default **0**). **✅ Tasks → 📚 From calendars** lists the next 14 days; single events can be hidden with 🙈 without touching the calendar.
- **School holidays and public holidays:** choose country and region – the card fetches the data itself from the **[OpenHolidays API](https://www.openholidaysapi.org)** (free, **no API key**, 36 countries). Fallback: the built-in **Holiday** integration and a school-holiday calendar.
- **Stars from automations / voice assistants:** the card creates the script `script.yippee_sterne` (fields `kind`, `sterne` – negative to deduct –, `grund`), usable in automations, scripts and – via one script per kid – Google Assistant or Alexa.
- **🎨 Appearance** (⚙️ Settings → ⚙️ General for all cards, or per card in the card editor): **🎨 colour presets** to tap (like the dashboard, light, dark, pastel, ocean, forest, sun, night, candy) or ✏️ your own colours with a colour picker – text and tiles adapt automatically, with a warning if the text is hard to read –, 📏 equal-height tiles (several kid cards side by side line up), compact, no background and size 70–130 %.
- **Theming:** CSS variables `--yippee-bg`, `--yippee-surface`, `--yippee-accent`, `--yippee-text`, `--yippee-text-secondary` for themes or card_mod.
- **Sensors:** `sensor.yippee_<name>` per kid (state = points) with the attributes `heute_erledigt`, `heute_gesamt`, `alles_erledigt`, `offen`, `wartet_auf_freigabe`, `level`, `level_name`, `gesamt_verdient`, `abzeichen`, `ziel`, `urlaub`, `anwesend`, `feiertag`, `ferien` (and `euro`) – e.g. "TV only after all chores are done". Updated while the card is open for an administrator.
- **Background automation:** morning announcement, reminders, missed-chore messages, daily summary and Telegram commands run inside Home Assistant – **even when no card is open**. The card writes a 14-day plan and creates the automation with one tap.

## Data safety

- **Backup file** (`YippeeKidsChoresDDMMYYYY.json`) to download, share, copy and restore
- **Automatic backups** daily or weekly (last 4 kept), optionally also in a **second Local To-do list** that survives if the main list is deleted
- **Data check** with checksums: warns about missing or externally changed entries and restores them from the backup
- **Trash** for 7, 14 or 30 days (default 7, then deleted for good) and a **change log** (who approved, changed, redeemed, deleted or restored what and when)
- The Local To-do list is part of every regular Home Assistant backup

## Access control

- **Who are the parents?** Pick Home Assistant users. Only they see the parents area and may approve, change points and redeem – on every device, including app buttons (kids can't approve themselves).
- **PIN** (4–8 digits), stored only as a hash; 5 wrong attempts lock the parents area on that device for 5 minutes.
- Recommendation: give kids their own Home Assistant account **without administrator rights**. Home Assistant has no per-entity permissions; the data check notices changes made outside the card.

## Languages

27 languages – German built in, every other language as a small separate file (only the chosen one is loaded): German, Swiss German, English, French, Italian, Spanish, Portuguese, Dutch, Danish, Swedish, Finnish, Estonian, Latvian, Lithuanian, Polish, Czech, Slovak, Slovenian, Croatian, Hungarian, Romanian, Bulgarian, Greek, Maltese, Irish, Turkish and Russian. Default is your Home Assistant user's language.

## Updates

- **Update available:** when HACS knows a newer version, the parents area shows a notice.
- **Resource raised automatically:** when the file on the server is newer than the one running in the browser, the card writes the new version into the resource itself (`?v=1.5.0` …) as soon as an administrator opens the parents area, then offers a reload button. With HACS, HACS updates the resource; the card just offers the reload. Can be switched off under ⬆️ Updates.

See the [CHANGELOG](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/CHANGELOG.md).

## Privacy

All data stays in your Home Assistant. No account, no cloud, no tracking. The only internet request is the optional holiday lookup at the OpenHolidays API (country and date range only). Photo-proof pictures are stored in Home Assistant's media folder (admin account) or, reduced in size, in a to-do list (non-admin account), and deleted after the parents' decision.

## Limitations

- Home Assistant has no per-entity permissions – PIN and parents list protect the card, not the to-do list itself.
- Points are booked in the card; button actions are processed as soon as a card is open again.
- Best for 1–4 kids, fine up to about 6, possible up to about 10.

## Thanks

Yippee! stands on the shoulders of great open-source projects and lives from its users’ ideas. A big thank you to:

- **[Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule)** by [@mampfes](https://github.com/mampfes) and all contributors – thanks to this integration, collection dates from hundreds of waste providers go straight into the “Take out the trash” chore.
- **[Locodice67](https://github.com/Locodice67)** – for ideas and groundwork in his fork: behaviour chart, “only on school-free days”, more relaxed times on school-free days and the toddler templates (since 1.5.0), plus the morning and evening routine templates and “😊 Behaviour” ([#1](https://github.com/Chrism1412/yippee-kids-chores-card/pull/1)).
- **[RkcCorian](https://github.com/RkcCorian)** – summary card per kid, appearance options, kid order, equal-height tiles and the report about the ✓ buttons ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), [#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), [#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), [#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), [#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10)).
- **[gogui63](https://github.com/gogui63)** – negative balance with net score and stars from automations or voice assistants ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), [#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8)).
- **[Sysman2018](https://github.com/Sysman2018)** – the idea for 🎓 stars for good school grades ([#2](https://github.com/Chrism1412/yippee-kids-chores-card/issues/2)).
- **[Daniel-PT](https://github.com/Daniel-PT)** – found the IP-ban bug for non-admin users ([#3](https://github.com/Chrism1412/yippee-kids-chores-card/issues/3)).
- **[OpenHolidays API](https://www.openholidaysapi.org)** – provides public and school holidays.
- **[Home Assistant](https://www.home-assistant.io)** and **[HACS](https://hacs.xyz)** – without them this card would not exist.

## License

[MIT](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE) © 2026 Chrism1412
