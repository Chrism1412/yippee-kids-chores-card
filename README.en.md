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
  <img src="https://img.shields.io/badge/languages-25-ffc93c" alt="25 languages">
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT"></a>
</p>

<p align="center"><a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/README.md">🇩🇪 Deutsche Version</a></p>

---

## What is Yippee!?

**Yippee! - Kids Chores** is a single JavaScript card for the Home Assistant dashboard. Kids see today's chores as big, colourful tiles, tap them and earn stars ⭐. They spend their stars on rewards, level up and unlock badges.

Parents create chores and rewards, approve finished chores (also right from the push or Telegram notification) and decide for themselves whether a missed chore costs stars – **nothing is deducted automatically**.

- **No cloud, no account, no server:** all data lives in a *Local To-do* list in your Home Assistant.
- **One file, no dependencies:** no other HACS cards needed, light enough for older tablets.
- **Made for phones:** works in the Home Assistant app in portrait mode just as well as on a wall tablet.

> ### 💡 Ready to go: 93 chores and 21 rewards built in
> No need to start from scratch. The card ships with a **chore database of 93 templates in 9 categories** – from "brush teeth" and "pack school bag" to "empty the dishwasher", "walk the dog" and "mow the lawn" – each with emoji, points and time of day, plus **21 reward templates** (ice cream voucher, movie night, cinema, zoo, theme park …).
>
> **Age-appropriate by birthday:** enter a child's birthday and the template list only shows chores that fit their age (5–17): 30 suggestions at age 5, 63 at age 8, more than 75 from age 12. The 💡 button on a child suggests all fitting chores they don't have yet – tick and done.

## Screenshots

| Kids view | Parents view | Rewards | Settings |
|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/kinder-ansicht.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eltern-heute.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/belohnungen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/einstellungen.png" width="200"> |

*(Screenshots in German – the card shows your Home Assistant language automatically.)*

## Features

### For kids
- Big chore tiles with emoji, points and time window
- Star balance, **10 levels** and **9 badges**
- **Savings goal** 🎯, **wishes** 💡, a shared **family goal** 👨‍👩‍👧
- **Streaks** 🔥 with bonus stars, **"Coming up"** 📅 preview
- **Birthday** 🎂: confetti, bonus, point multiplier, optional day off
- Collapsed view: only name and points until tapped

### Chores
- **Weekdays**, **fixed dates**, **one-off special chores** (first come, first served) or **from a waste collection calendar**
- **Rotation** 🔄 between kids (skips kids on holiday), **"One is enough"** 🤝, **extra chores** 🙋
- **Twice a day** with separate time windows, **seasons** (e.g. mowing April–October), **school days only**
- **Photo proof** 📷 per chore
- **Chore database with 93 templates** in 9 categories (morning, school, kitchen, cooking & shopping, tidying & cleaning, laundry, house/garden/pets, responsibility, evening), filtered by the child's age from their birthday; school chores follow the usual school starting age of the selected country (or an optional "started school in" month per child, which also shows the school year); seasonal chores get their season, school chores "school days only" automatically
- **21 reward templates** (ice cream voucher, movie night, cinema, zoo, theme park …)

### For parents
- **Approval** of chores and rewards – in the card, via app button or Telegram button
- **Penalties only after your decision**: missed = excused, minus stars or done after all
- Manual adjustments, **points history**, **monthly statistics**, **pocket money** conversion, **double-points days**
- **Holidays** per kid, **school holidays and public holidays** automatically
- **Daily summary** and **weekly review** messages, **morning announcement** and **reminders** on speakers

### Safety and data
- **Automatic backups** (optionally into a second list), backup file download
- **Data check** that warns about missing or externally changed entries
- **Trash** (30 days) and **change log**
- **Parents = selected Home Assistant users**, **PIN** with lockout

## Requirements

- **Home Assistant 2024.10** or newer
- The built-in **Local To-do** integration
- Optional: Home Assistant companion app, Telegram bot, a TTS integration, a calendar integration for waste collection

## Installation

### HACS (recommended)

1. HACS → ⋮ (top right) → **Custom repositories**
2. Repository: `https://github.com/Chrism1412/yippee-kids-chores-card` · Type: **Dashboard** → **Add**
3. Search **Yippee! - Kids Chores** → **Download**
4. Reload the page

HACS adds the resource automatically.

### Manual

1. Download [`dist/yippee-kids-chores-card.js`](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/dist/yippee-kids-chores-card.js) from the [latest release](https://github.com/Chrism1412/yippee-kids-chores-card/releases/latest).
2. Create the folder **`/config/www/community/yippee-kids-chores-card/`** and copy the file into it. This is the same folder HACS uses, so you can switch to HACS later without changes.
3. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.1.0`
   - Type: **JavaScript module**
4. Reload the page.

> **Manual updates:** copy the new file to the same place – that's it. The card raises the number after `?v=` in the resource automatically when an administrator opens the parents area – see [Updates](#updates).

## Setup

1. **Settings → Devices & services → Add integration → "Local To-do"** → name: **`Yippee Kids Chores`** → entity `todo.yippee_kids_chores`. This list is the card's storage – please don't edit its entries by hand.
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
| `collapsed` | `true` / `false` | `true` for `kids` | Show kids collapsed |
| `family` | `true` / `false` | automatic | Show the family goal on this card (automatically only once per page) |
| `language` | e.g. `en`, `fr` | setting / HA language | Language for this device only |
| `pin` | digits | – | Legacy PIN. Better: set it in Settings → 🔒 Access |
| `pin_minutes` | number | `5` | Lock the parents area again after this many idle minutes |

## Integrations

All integrations are **optional** and can be switched on and off individually.

- **Home Assistant companion app:** notifications for finished chores, reward requests, missed chores, daily summary and weekly review – with **action buttons** (approve / reject, excused / minus stars / done). The card creates the needed automation with one tap.
- **Telegram:** the same messages with **inline buttons**, photos for photo proof, and the commands `/punkte` (points), `/offen` (open chores) and `/hilfe` (help). A test button shows Telegram's error message if buttons are rejected.
- **Text-to-speech / Alexa:** any TTS integration with media players, or *Alexa Media Player* (HACS) – for the **morning announcement** ("Good morning Mia! Today: brush teeth, make bed and take out the trash (paper).") and **reminders** shortly before a time window ends.
- **Waste collection calendar:** chores like "Take out the trash" take their dates from any Home Assistant calendar – e.g. **[Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule)** (HACS, hundreds of providers), a **Remote calendar** with your provider's ICS link, or a **Local calendar**. Per chore: keywords (e.g. `paper, residual`), and **"the evening before"** so the bin goes out in time. The tile shows what is collected.
- **School holidays and public holidays:** choose country and region – the card fetches the data itself from the **[OpenHolidays API](https://www.openholidaysapi.org)** (free, **no API key**, 36 countries). Fallback: the built-in **Holiday** integration and a school-holiday calendar.
- **Sensors:** `sensor.yippee_<name>` per kid (state = points) with the attributes `heute_erledigt`, `heute_gesamt`, `alles_erledigt`, `offen`, `wartet_auf_freigabe`, `level`, `level_name`, `gesamt_verdient`, `abzeichen`, `ziel`, `urlaub`, `feiertag`, `ferien` (and `euro`) – e.g. "TV only after all chores are done". Updated while the card is open for an administrator.
- **Background automation:** morning announcement, reminders, missed-chore messages, daily summary and Telegram commands run inside Home Assistant – **even when no card is open**. The card writes a 14-day plan and creates the automation with one tap.

## Data safety

- **Backup file** (`YippeeKidsChoresDDMMYYYY.json`) to download, share, copy and restore
- **Automatic backups** daily or weekly (last 4 kept), optionally also in a **second Local To-do list** that survives if the main list is deleted
- **Data check** with checksums: warns about missing or externally changed entries and restores them from the backup
- **Trash** for 30 days and a **change log** (who approved, changed, redeemed, deleted or restored what and when)
- The Local To-do list is part of every regular Home Assistant backup

## Access control

- **Who are the parents?** Pick Home Assistant users. Only they see the parents area and may approve, change points and redeem – on every device, including app buttons (kids can't approve themselves).
- **PIN** (4–8 digits), stored only as a hash; 5 wrong attempts lock the parents area on that device for 5 minutes.
- Recommendation: give kids their own Home Assistant account **without administrator rights**. Home Assistant has no per-entity permissions; the data check notices changes made outside the card.

## Languages

25 languages built into the one file: German, Swiss German, English, French, Italian, Spanish, Portuguese, Dutch, Danish, Swedish, Finnish, Estonian, Latvian, Lithuanian, Polish, Czech, Slovak, Slovenian, Croatian, Hungarian, Romanian, Bulgarian, Greek, Maltese and Irish. Default is your Home Assistant user's language.

## Updates

- **Update available:** when HACS knows a newer version, the parents area shows a notice.
- **Resource raised automatically:** when the file on the server is newer than the one running in the browser, the card writes the new version into the resource itself (`?v=1.1.0` …) as soon as an administrator opens the parents area, then offers a reload button. With HACS, HACS updates the resource; the card just offers the reload. Can be switched off under ⬆️ Updates.

See the [CHANGELOG](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/CHANGELOG.md).

## Privacy

All data stays in your Home Assistant. No account, no cloud, no tracking. The only internet request is the optional holiday lookup at the OpenHolidays API (country and date range only). Photo-proof pictures are stored in Home Assistant's media folder and deleted after the parents' decision.

## Limitations

- Home Assistant has no per-entity permissions – PIN and parents list protect the card, not the to-do list itself.
- Points are booked in the card; button actions are processed as soon as a card is open again.
- Best for 1–4 kids, fine up to about 6, possible up to about 10.

## License

[MIT](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE) © 2026 Chrism1412 · Holiday data: [OpenHolidays API](https://www.openholidaysapi.org)
