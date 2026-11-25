<p align="center">
  <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/icon-512.png" width="120" alt="Yippee! - Kids Chores logo">
</p>

<h1 align="center">Yippee! - Kids Chores</h1>

<p align="center">
  <b>Tick off chores · collect stars · redeem rewards</b><br>
  A Home Assistant card that lets kids do their household chores while parents keep track of everything.
</p>

<p align="center">
  <a href="https://www.home-assistant.io/integrations/marketplace/"><img src="https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg" alt="Marketplace Custom"></a>
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/releases"><img src="https://img.shields.io/github/v/release/Chrism1412/yippee-kids-chores-card" alt="Version"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.10%2B-03a9f4" alt="Home Assistant 2024.10+">
  <img src="https://img.shields.io/badge/languages-27-ffc93c" alt="27 languages">
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT"></a>
  <a href="https://buymeacoffee.com/Chrism1412"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95-ffdd00" alt="Buy me a coffee"></a>
</p>

<p align="center"><a href="https://buymeacoffee.com/Chrism1412"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="44"></a></p>

<p align="center"><a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/README.md">🇩🇪 Deutsche Version</a></p>

> ### 🎉 New in version 2.0: pets, your own AI pets, learning games, screen time and pocket money
> **Nothing to change** – everything new is optional and has to be switched on first.
>
> - **🐾 [Pet](#pet--optional):** 🐶 dog, 🐱 cat, 🦖 dino, 🦄 unicorn, 🐦 bird, 🦸 superhero or 🧚 fairy – animated, grows from an egg to a big pet with a crown, is happy, sleeps at night and gets sad when chores are left undone. Hero and fairy with their own skin, hair and cape colours.
> - **🎨 [Your own pet with AI](#your-own-pet-with-ai-):** describe the animal, copy the prompt, paste it into ChatGPT, Gemini, Claude or Copilot, paste the answer back – your own animated pet is ready.
> - **🗺️ [Flocke's Adventure](#adventure--jump--run):** a jump & run of its own with the pet as the hero – title screen, 10 long levels in 5 worlds, 16-bit style music.
> - **🎮 [Mini games](#mini-games--optional):** one game per character plus memory, counting, maths and movement – maths and counting **matched to age and school year**, points only for correct answers, also as a **chore** (“solve 3 sums”).
> - **📺 [Screen time](#screen-time--optional):** start the voucher → TV or console turns on, a countdown runs, at the end it's switched off.
> - **💰 [Pocket money](#pocket-money--optional):** a piggy bank for every kid – regular allowance, swapping stars for money, savings goal, currency by language, 🔒 PIN and 📊 monthly report to the phone.
>
> **Also new:**
> - **1.9:** 📱 compact kids view, ⏱️ task timer, 🔊 early reader mode, 📅 recap and ⚡ faster start
> - **1.8:** 🦷 the [toothbrush timer](#toothbrush-timer--optional) – brush a picture free with music, stars right away, Oral-B support and an AI prompt for your own pictures
> - **1.7:** 🎄 the [advent calendar](#advent-calendar--optional) – 24 doors for every kid with text, a picture, stars or a reward as a present
> - **1.7.2:** 📱 approving via the button in the notification removes the message from all phones right away, even without an open card
---

## What is Yippee!?

**Yippee! - Kids Chores** is a single JavaScript card for the Home Assistant dashboard. Kids see today's chores as big, colourful tiles, tap them and earn stars ⭐. They spend their stars on rewards, level up and unlock badges.

Parents create chores and rewards, approve finished chores (also right from the push or Telegram notification) and decide for themselves whether a missed chore costs stars – **nothing is deducted automatically**.

- **No cloud, no account, no server:** all data lives in a *Local To-do* list in your Home Assistant.
- **One file, no dependencies:** no other add-on cards from the Marketplace needed, light enough for older tablets.
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

**🎨 New in 2.0: your own pet with AI**

| 🤖 Create the prompt | 👀 Preview and fine-tune | 🐷 At the kid |
|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-prompt.png" width="200" alt="Create the prompt"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-vorschau.png" width="200" alt="Preview"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-kind.png" width="200" alt="Own pet at the kid"> |

**📱 New in 2.0: one kid per page, rain and bedtime**

| 📱 One kid per page (swipe) | ☂️ In the rain | 💤 Bedtime |
|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/kinder-seiten.png" width="200" alt="One kid per page"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-regen.png" width="200" alt="Pet with umbrella"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-schlaeft.png" width="200" alt="Pet asleep"> |

**🐾 New in 2.0: pet, mini games and screen time**

| 🐾 Pet (kid) | 🏠 Pet page | 🦸 Pick a character | 🧮 Mini game | 📺 Screen time | 👨‍👩‍👧 Pet tab |
|:---:|:---:|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-kind.png" width="160" alt="Pet"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-seite.png" width="160" alt="Pet page"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-auswahl.png" width="160" alt="Pick a character"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/minispiel-rechnen.png" width="160" alt="Maths mini game"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/bildschirmzeit.png" width="160" alt="Screen time"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-eltern.png" width="160" alt="Pet tab"> |

**💰 New in 2.0: pocket money**

| 💰 Piggy bank (kid) | ⭐ Swap stars | 👨‍👩‍👧 Pocket money tab (parents) |
|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-kind.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-tausch.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-eltern.png" width="200"> |

**📱 New in 1.9: compact kids view, task timer, recap**

| 🏆 Collection | ⏱️ Task timer | 📅 Recap | 🔊 Early reader | 🎄 Advent reads aloud |
|:---:|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/kinder-sammlung.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/aufgaben-timer.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/rueckblick.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/leseanfaenger.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/advent-vorlesen.png" width="200"> |

**🎄 New in 1.7: advent calendar and dark mode**

| 🎄 Advent calendar | 🎁 Door opened | 🚪 Filling doors (parents) | 🌙 Dark mode |
|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/adventskalender.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/advent-tuerchen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/advent-eltern.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/darkmode.png" width="200"> |

*(Screenshots in German – the card shows your Home Assistant language automatically.)*

## Features

### For kids
- **📱 One kid per page** (optional, for the card with all kids): the kids at the top to tap, below always just one kid – **swipe to the next kid** – on a PC drag with the mouse button held down or swipe with two fingers on the touchpad. Each device remembers the last kid shown. Switch it on under ⚙️ Settings → 🎨 Look or with the card option `pages: true`.
- **📱 Compact view** (default from 1.9): header with level ring and a big star count, goal bar and round **collection buttons** (🎄 🦷 🏅 👨‍👩‍👧 📅), below only what is **up now** – done tasks in one line, later ones collapsed. At the bottom a bar **🏠 Today · 🎁 Rewards · 🏆 Collection**. Prefer the long page? ⚙️ Settings → 🎨 Appearance → 🧒 Kids view → Classic
- **⏱️ Task timer** (optional, per task): e.g. “Read for 15 min” – a big countdown ring with calm music, pause and cancel (books nothing). At the end **tick off automatically**, **let the child confirm** or **countdown only**. Approval and photo proof work as always
- **🔊 Early reader mode** (optional, per kid): big pictures, stars as symbols and a 🔊 button on every task – read out by the device or, if you like, by the speakers from 🔊 Voice output. In the 🎄 Advent calendar, doors and lock messages are read aloud (each can be turned off)
- **📅 Recap:** “Your October” all month in the 🏆 Collection, or in the classic view as a 📅 button below the badges (marked as “new” from the 1st to the 14th) – stars compared to the month before, longest streak, teeth brushing, favourite task, redeemed rewards; in January also “Your year”. Parents find it all under 📊 Reports → 📅 Recap
- Big chore tiles with emoji, points and time window
- Star balance, **10 levels** (from 🌱 Beginner to 💎 Chore King) and **9 badges** – tap a badge to see what it stands for; the 📖 manual explains all levels and badges
- **Savings goal** 🎯, **wishes** 💡, a shared **family goal** 👨‍👩‍👧 (its total can be corrected anytime with 🔧 −10 · −1 · +1 · +10, with history; with a **📋 queue** the next goal starts automatically after redeeming, and stars earned after reaching a goal already count for the next one)
- **Joker** 🃏 (optional): redeem it as a reward and skip one required chore without minus stars
- **Rewards for specific children only** 🎁: in the editor under “For which children?” – e.g. the Lego set only for Ben. Other children don't see it
- **Prices per child** 👧 (optional): each reward can have its own price per child – “⚖️ Share fairly” matches it to the stars each child can collect per day
- **Streaks** 🔥 with bonus stars, **"Coming up"** 📅 preview
- **Birthday** 🎂: confetti, bonus, point multiplier, optional day off
- **School grades** 🎓 (optional): stars for good grades – kids can report a grade themselves, optionally with a photo of the test
- **Advent calendar** 🎄 (optional): a door every day in December – with text, a picture, stars or a reward as a present
- Collapsed view: only name and points until tapped

### Chores
- **Weekdays**, **fixed dates**, **one-off special chores** (first come, first served) or **from a calendar** (waste collection, training …) – and optionally **every calendar entry becomes its own chore** (e.g. homework)
- **Rotation** 🔄 between kids (skips kids on holiday), **"One is enough"** 🤝, **extra chores** 🙋
- **Several times a day** (up to 5 time windows, e.g. wash hands morning, noon and evening), optional **own order** ↕️ with ▲▼, **"the evening before"** 🌙 for packing the school or gym bag (shows when the next day is a school day; asks for the PE days; school days count Monday to Friday – tick "🎒 Saturday school" on the child if they also have lessons on Saturdays), optional **day blocks** ⏰ (morning / noon / afternoon / evening, collapsible, past blocks fold automatically, also in the parents view), **seasons** (e.g. mowing April–October), **school days only**
- **Photo proof** 📷 per chore – also works with non-admin kid accounts: the card then stores a smaller photo in a to-do list (ideally a separate one, e.g. “Yippee Photos”)
- **Chore database with 221 templates** (ages 2–17) in 12 categories (morning, noon, school, kitchen & cooking, shopping, tidying & cleaning, laundry, house/garden/pets, responsibility, health & exercise, family & togetherness, evening), filtered by the child's age from their birthday; school chores follow the usual school starting age of the selected country (or an optional "started school in" month per child, which also shows the school year); seasonal chores get their season, school chores "school days only" automatically
- **51 reward templates** (ice cream voucher, karaoke night, breakfast in bed, movie night, one-on-one time with mum or dad, 🃏 joker, cinema, climbing gym, zoo, circus, theme park …)

### Presence 🏠 – for separated parents and patchwork families (optional)

If a child doesn't always live in your household, set it **per kid** under **👧 Kids → ✎ → 🏠 Presence**: **normally** "mostly with us" or "mostly elsewhere", plus any number of **rules** – *here* or *away*, **every week or every 2, 3, 4 weeks**, from day + time to day + time (e.g. away every week **Wed 14:00 – Thu 08:00** and every 2nd weekend **Fri 15:00 – Sun 18:00**). Add a **holiday arrangement** per holiday type (summer, autumn, Christmas, winter, Easter, Whitsun: rules continue, all with us, all with the other parent, first/second half, **first/last … weeks with us**), optionally **alternating every year**, and **exceptions** (date ranges "here"/"away", optionally with an arrival/departure time – chores due before arrival don’t count as missed). A preview of the next 8 weeks is shown in the editor.

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

### Advent calendar 🎄 (optional)

Turn on under **⚙️ Settings → ⚙️ General → 🎄 Advent calendar** – the parents view then gets a **🎄 Advent** tab. The calendar uses the kids, stars, rewards, PIN and colours of Yippee! directly – nothing else to set up.

- **🚪 Doors** from December 1 to 24 (or 31) for every kid, in mixed order: text, emoji, picture, 💌 message, ⭐ stars and a 🎁 **reward as a present** (costs no stars; with 🎟️ vouchers it arrives as a voucher)
- **✨ Fill automatically** from templates (baking, crafts, vouchers, riddles …) and special days – St Nicholas, the four Advent Sundays (recalculated every year), Christmas Eve
- **🔊 Reading aloud for early readers** (new in 1.9): for kids with 🔊 early reader mode, the calendar reads out the door text, message, stars and gift when it opens – and lock messages like “3 more days …”. Each can be turned off, and a 🔊 button in the door reads it again.
- **🔗 Condition:** a door only opens once a specific task or X tasks are done today
- **🎄 Advent calendar only:** tick it on a reward – kids don’t see it anywhere else, only a door can give it
- **Look:** starry night with garlands and a snowy landscape, colourfully patterned doors, ❄️ snowfall, 🔔 bells or your own sound, ⏳ countdown, progress bar, 🎚️ door size slider – for everyone, for this device only (📱) or for one card only (`advent_size`), adapts automatically on phones
- **📁 Files:** upload your own JPG pictures and MP3 sounds (stored under Media → advent; administrator only)
- **📱 Morning message** in December to the kid’s phone (the card creates the automation; administrator only) and **🧪 test mode** to try it out in November
- **🧹 Reset completely** (per kid): closes the doors and takes back stars, vouchers and gifts of this season – e.g. after a test with a changed date. “🚪 Close all doors” keeps stars and gifts

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/adventskalender.png" width="260" alt="Advent calendar"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/advent-tuerchen.png" width="260" alt="Door opened"></p>

In December kids open their doors with the **🎄 button** in their view – or in a separate card with `mode: advent`. The calendar lives in its own file (`yippee-kids-chores-advent.js`), loaded only when it is switched on.

### Toothbrush timer 🦷 (optional)

Switch it on under **⚙️ Settings → ⚙️ General → 🦷 Toothbrush timer** – brushing tasks then get a **🦷 Let's go!** button in the kids view, and the parents view gets a **🦷 Teeth** tab.

- **Brush the picture free:** the screen is full of toothpaste foam. The timer runs in 4 areas (top left, top right, bottom left, bottom right) – it is scrubbed tooth by tooth – first the foam gets thinner, then it is brushed away, with foam splashes, leftovers that “pop” at the end and soft transitions between the areas. Plus a tip and a change sound. When the time is up the picture stays: **🖼️ View picture**, only **Next** goes back to the chores.
- **⭐ Stars right away:** with the timer the task is ticked off without approval (can be switched off). Stars **the same for all** or **per child & time of day** – if a child dislikes brushing in the morning, give more stars there and the tile shows “🔥 Extra!”. Optional **🔒 tick off only with timer** and **🔥 bonus after 7 days in a row**.
- **🖼️ 14 templates** (moon landing, dragon castle, diving, treehouse, pirate ship, dino valley, fire brigade, farm, penguins, safari, circus, unicorn meadow, magic forest, steam train) plus **📷 your own pictures** – 🎲 random (a picture only comes again when all others had their turn, never twice a day) or in 🔢 fixed order. Every revealed picture is collected under “🦷 My brushing pictures”.
- **👧 Pictures per kid:** below each picture (template or your own), tap the kids who should get it – e.g. rockets for the big one, unicorns for the little one. Nothing selected = all kids.
- **🎵 Music:** a specially composed, calm 2-minute tune, your own MP3s or random; ⏱️ brushing time per child 1, 2 or 3 minutes. Optionally with a **🔊 brushing sound** (scrubbing or electric toothbrush).
- **🤖 Your own pictures with AI:** the 🦷 Teeth tab contains a ready-made prompt – enter a subject (or 🎲), copy it, paste it into ChatGPT, Gemini or Microsoft Designer. In the same chat you can keep adjusting the picture, e.g. “make the dragon green”.
- **✨ Moving effects** and optional **🌫️ picture sharp only at the end** – for kids who otherwise just look at the picture instead of brushing.
- **↩️ Take back a single brushing:** if the kid just let the timer run, parents set the task to “not done” under “Today” – the stars, picture, counter, streak day and streak bonus of that brushing are taken back too.
- **📋 As a routine step:** a linked tooth-brushing task or a step with 🦷 (e.g. from the routine templates) starts the timer inside a routine (“🦷 Let's go!”) – the brushing counts for pictures and streak, the stars come at the end of the routine.
- **🦷 Oral-B:** with Home Assistant's “Oral-B” integration (Bluetooth) the timer starts by itself as soon as the toothbrush runs, pauses when it's off and warns about too much pressure.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-kachel.png" width="200" alt="Tile with button"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-timer.png" width="200" alt="Toothbrush timer"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-fertig.png" width="200" alt="Picture revealed"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-eltern.png" width="200" alt="Teeth tab"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-routine.png" width="200" alt="Tooth-brushing timer as a routine step"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/zahnputz-je-kind.png" width="200" alt="Pictures per kid"></p>

The timer lives in its own file (`yippee-kids-chores-teeth.js`, the music in `yippee-kids-chores-teeth-music.js`), loaded only when needed. Own pictures and MP3s are stored under Media → yippee-zaehne (upload by administrators only). The screenshots show the German interface.

### Pocket money 💰 (optional)

Switch it on under **⚙️ Settings → ⚙️ General → 💰 Pocket money** – then every kid gets a **piggy bank**: the **“💰 My piggy bank”** button in the kids view (a collection button in the compact view) and the **💰 Pocket money** tab in the parents view. It starts at 0 – enter the current amount once as the **🏁 starting balance**.

- **➕ ➖ Bookings:** income and spending with text, emoji and date, e.g. “from Grandma” or “comic book”. Only parents can delete.
- **🌍 Currency by language:** euro, Swiss franc, pound, dollar, Danish and Swedish krone, złoty, Czech koruna, forint, leu, rouble and lira – preset by the card's language (for English by Home Assistant's currency), changeable with one tap.

Everything else can be switched on separately:
- **✍️ Kids book it themselves** – kids add bookings on their own (without going below zero).
- **📅 Regular pocket money** – an amount per kid each week (Mondays) or month (on the 1st), booked automatically. Optionally **in full only from e.g. 80 % of chores done**, pro rata below that.
- **⭐ Swap stars for money** – rate per kid (e.g. 10 ⭐ = €1) and a minimum; deleting a swap gives the stars back. The existing “💶 Pay out” then also books into the piggy bank.
- **🎁 Rewards with a money amount** – money goes into the piggy bank when redeemed (e.g. “€5 for the school report”) or is paid from the pocket money (e.g. a trip to the cinema).
- **🎯 Savings goal** (on by default) – progress bar and “At your pace around …”.
- **🌍 Other currencies** – holiday money shown separately, not counted in the total.
- **📅 In the recap** (on by default) – income, spending and balance of the month.
- **🔒 PIN for the piggy bank** – every kid gets their own PIN so siblings can't peek (parents don't need one).
- **📊 Monthly report** – on the 1st of every month at 9 am, income, spending and balance of every kid to the phone (to the weekly report recipients).
- **📦 Summarise old bookings** (on by default) – bookings older than 12 months are combined per month into one sum for income and spending. The balance stays the same, the list in Home Assistant stays slim.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-kind.png" width="200" alt="Piggy bank"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-tausch.png" width="200" alt="Swap stars"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/taschengeld-eltern.png" width="200" alt="Pocket money tab"></p>

Pocket money lives in its own file (`yippee-kids-chores-money.js`), which is only loaded when it's switched on. Bookings are stored in the Yippee list like everything else and are part of the backup.

### Pet 🐾 (optional)

Switch it on under **⚙️ Settings → ⚙️ General → 🐾 Pet**, then per kid with “🐾 on” in the new **🐾 Pet** tab – kids who don't want one don't get one. The first time, the kid picks a character and gives it a name.

- **7 characters:** 🐶 dog, 🐱 cat, 🦖 dino, 🦄 unicorn, 🐦 bird, 🦸 superhero and 🧚 fairy – any kid can pick any of them. For the **hero**: skin colour, hair colour, hairstyle (short or ponytail) and the colour of suit and cape; for the **fairy**: skin colour, hair colour and the colour of dress and wings.
- **Grows with the stars:** 🥚 egg (📦 hero box for the hero, 🌷 bud for the fairy) → baby → young → big with a crown 👑. You set the speed (fast, normal, slow). It **lives forever, never shrinks** and never gets sick.
- **Animated:** blinks, breathes, wags, looks around, yawns, sneezes, spins, wings flutter, the mane waves. Jumps for joy when a chore is done, cheers for rewards, confetti at a new level – and sleeps at night (adjustable), on holidays and when the kid isn't there.
- **Mood:** content when nothing is due; bored while chores are open; from the afternoon (default 4 pm) **sad with a tear** and a hint at the open chores – they are **only shown, never read aloud**. The tear can be switched off.
- **Pet, feed, play, dress up:** petting and dressing up always work. Feeding, playing and the mini games unlock **by % of chores** (default 50 %), **after X chores done today**, **after X stars earned today**, **after specific chores** or are **always there** – the same for all or different per kid. With “after certain chores” pick a kid at the top to see only their chores.
- **🎟️ Free-game voucher:** a reward can contain free games (e.g. 3 free games for 20 ⭐). Redeemable only once games are unlocked today. Free games count once the daily limit is reached, work for all games that are switched on and for adventure levels (1 level = 1 free game) and never expire. A restart after “all hearts gone” is free – or counts like a new level per kid (🐾 Pet → 🎮 Games → 🗺️ Adventure → “🔁 Restart counts as a new level”, tick the kids). The balance is shown under ✎ at the kid and can be corrected there.
- **Clear buttons:** Care on top (🤚 Pet, feed, play together, 👕 dress up), below two big tiles: 🕹️ **Arcade** (mini games & adventure) and 🏠 **Home** with the coin balance.
- **🍎 Feeding per day:** 1–10 (default 3, also per kid), at least 5 minutes between two meals – then the pet is full.
- **Accessories** unlock with the levels (top hat, bow, glasses, scarf, medal …), plus a 🎅 hat in December, a 🥳 party hat on the birthday and 🌦️ **weather** from Home Assistant: a ☂️ umbrella over its head in the rain, scarf in the snow, sunglasses in the sun.
- **💤 Bedtime:** while the pet sleeps (at night, on holiday or when the kid isn't there) there are no buttons – just a note when it wakes up. Game chores still work.
- **🥚 New egg** any time – the old pet goes into 📸 Memories.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustiere-uebersicht.png" width="640" alt="All characters in all stages"><br><sub>All 7 characters: start, baby, young, big, happy, sad, sleeping</sub></p>

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-kind.png" width="200" alt="Pet"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-seite.png" width="200" alt="Pet page"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-auswahl.png" width="200" alt="Pick a character"></p>

### Your own pet with AI 🎨

In the **🐾 Pet tab → 🎨 Own pets → ➕ Own pet** – a pet of your own idea, drawn by an AI:

1. **Describe** what it should be (e.g. “pink pig with a curly tail and floppy ears”) and **🤖 copy the prompt**.
2. Paste it into **ChatGPT, Gemini, Claude or Copilot**. The AI answers with a JSON code block containing the animal as vector graphics in parts (head, body, ears, tail …).
3. **Paste** the answer (or open it as a file) – a **preview** appears right away: normal, happy, sad, baby, with hat. If something isn't right, tell the AI in the same chat what to change – or nudge eyes, mouth, hat and scarf with **Fine-tune**.
4. Give it a name, pick the kids (nothing selected = all), save.

The card draws eyes, mouth, cheeks and tears itself – so your own pet also blinks, is happy and cries, wags its tail, grows from egg to big, wears accessories and plays the mini games.

**Safe:** the card only keeps pure drawing elements (paths, circles, gradients) – no scripts, no links, no styles, no external references. No code is ever run. The pet is stored in the Yippee list and is part of the backup.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-prompt.png" width="200" alt="Create the prompt"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-vorschau.png" width="200" alt="Preview"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eigenes-haustier-kind.png" width="200" alt="Own pet"></p>

### Mini games 🎮 (optional)

On the pet page (switch in the 🐾 Pet tab):
- **One game per character:** 🦴 catch the treats (dog), 🐭 catch the mice (cat), 🌵 jumping (dino), ⭐ collect stars (unicorn and hero), 🎵 copy the song (bird), ✨ catch the fireflies (fairy).
- **For everyone:** 🧠 memory (6, 8 or 10 pairs depending on difficulty – or a fixed 6–12), 🔢 counting, 🧮 maths (matching the school year from 🎓 school grades) and 🏃 copy me – jumping jacks, frog jumps, standing on one leg.
- **New learning games:** 🕐 **reading the clock** (full hour down to the minute – read it, find the matching clock, “in … minutes”, “how long?”, 24-hour time), 🔤 **letters & words** (first, last and missing letter, picture for a letter, correct spelling – in all 27 languages), 💰 **counting money** (coins and notes in the card's currency – count, find the matching money, change), 🧩 **sliding puzzle** with your own pet – **3×3 or 4×4** (tap or swipe into the gap; with a template picture, 💡 hint, 🔀 shuffle and 🔢 numbers on/off) and 🌈 **colour memory** – optionally with ★ ● ▲ ■ **shapes** on the colours so it also works without colour vision. Clock, words and money also work as “game as a chore”.
- **🔊 Read aloud:** in every game the speaker button reads the question – for kids who can't read yet.
- Free-time games give **no stars**, just a 🏆 record – with a **daily limit** (default 3 games).
- **🔄 Reset game progress:** ✎ at the kid in the 🐾 tab – records of single games, the adventure or “played today”.
- **🔢 Questions per round per kid** (3–30, default 5) – for “game as a chore” either a fixed number or **“number as set for the kid”**: with *one* shared chore the first-grader gets e.g. 7 and the big one 15 sums.
- **Points only for correct answers:** for maths and counting you set **1–3 tries per question**. When they're used up, the game shows the answer and asks the next question.
- **🔁 Repeat mistakes later:** questions where the answer had to be shown come back in later rounds (marked “🔁 Repeat”) until they stick. Remembered per kid on the device, can be switched off. Under ✎ at the kid the 📊 learning statistics also show **“🔁 Often wrong”** – the questions that went wrong most often.
- **🎯 Daily challenge:** every day a different game per kid at the top of the arcade – play it twice for 🪙 coins (default 10, per kid). Can be switched off.
- **🕹️ Games and 🗺️ adventure levels per day per kid** (optional under ✎): e.g. 3 games a day for the little one, 5 for the older one.
- **📱 Landscape too:** on a phone held sideways, question and answers sit side by side, with the maze and treasure map controls next to them.
- **🎮 Settings per game:** in the 🐾 tab every game has its own collapsible section – game on/off (switched-off games disappear from the menu and the chore editor), tries and repeating per learning game, memory pairs, puzzle size, numbers and hint button, shapes for “colour memory” and a fixed difficulty for the adventure.
- **📊 Learning statistics** (can be switched off): under ✎ at the kid, per learning game: what was solved, where the answer was shown and how often the first try was right – this month and the last 6 months.
- **Right for their age:** the questions follow the school year – from the school start (🎓 school grades) or from the birthday and **your country's school starting age** (e.g. Germany 6, England 5, Sweden 7). From **preschool** (up to 5) via times tables to **year 6** (e.g. 14 × 16). Adjustable per kid.
- **🎮 Game as a chore:** pick a game and a goal in the chore editor (e.g. maths, 10 correct). The kid taps “🎮 Let's go!” – once the goal is reached, the chore is ticked off.
- **🔁 How often playable (per day):** a game chore always works – even while games are still locked – and never costs a free game. If you like, it can be played 1–5× a day: the first successful round completes the chore, after that “🔁 Practise again” follows without stars.
- **🧩 Question games:** 🏰 **Maze** (a knight’s castle with stone walls, flickering 🔥 torches and 🛡️ shields; use the d-pad from the 🚪 castle gate to the 👑 throne room – 📜 scrolls with questions only appear when you get close), 🚂 **Train ride** (the right answer sets the switch), 🏴‍☠️ **Treasure map** (a pirate treasure map on parchment with shipwreck, pirate ship, kraken, shark, compass rose and skull rock, the pet wearing a pirate hat, the goal is the treasure chest at the red ✕, a question on almost every field, 🏖️ rest stops for a breather; roll the dice – right = 2 squares forward, alone or with two players) , 🐸 **Lily pad hop** (a pond with reeds, water lilies and 🐟 fish and a 🦆 duck swimming around – jump onto the lily pad with the right answer, also times tables), 🚀 **Space** (the rocket flies to the planet with the right answer) and 🦕 **Dino dig** (knock the right stone free – after 6 bones the dino skeleton stands). Questions from maths, counting, letters, clock and money – matched to the school year, one try per question.

### Adventure 🗺️ (jump & run)

At the top of the games menu: **“Flocke's Adventure”** – the name comes from the pet. A jump & run of its own with the pet (your own AI pet too) as the hero:
- **Title screen** with the pet, a 16-bit style logo and title music.
- **10 long levels in 5 worlds:** 🌳 meadow, 🏖️ beach, 🍭 candy land, ❄️ snow, 🌙 starry night – with stars to collect, food, springs, spikes, moving platforms and little enemies to jump on.
- **Little frustration:** fall down and you lose a ❤️ and restart at the last 🚩 flag; only when all hearts are gone does the level start again. At the goal there are 1–3 👑 crowns, the next level unlocks and progress is saved.
- **Controls:** walk with ◀ ▶ and jump with ⤒ (arrow keys and space bar too). The buttons sit **below the play area** (in landscape left and right of it) and never cover the game.
- **“Easy”** (slower, fixed bridges, 5 ❤️), **“Normal”** (faster, moving platforms, 3 ❤️) or **“🔥 Hard”** (even faster, small moving platforms, 2 ❤️ and special enemies: 🐸 hoppers, 🐀 dashers, 🦔 hedgehogs – don't jump on them! – and 🐝 flyers above the gaps) – plus a **⤒⤒ double jump** (tap again in mid-air) and high ledges with hard-to-reach 🎁 boxes.
- **🎁 Bonus boxes** in every level: bump them from below for +3 ⭐.
- **For little ones:** ✎ at the kid → “Runs by itself” – the pet runs on its own, tap = jump.
- **16-bit style music** – original tunes for each world, generated in the browser (🔊/🔇).
- **⏱️ Best time per level:** the finish shows your time, the map shows the best time – a reason to play levels again.
- **Daily limit** in the 🐾 Pet tab (“Adventure levels per day”, default 3). There you can also fix the difficulty to “Easy”, “Normal” or “Hard”. Gives no stars.
- Separate file `yippee-kids-chores-adventure.js`, only loaded when the adventure is opened.
- **🚪 Question gates** (🐾 tab → Adventure, off by default): a gate before the flags opens with a question from the learning games – right = +3 ⭐.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/spiele-menue.png" width="200" alt="Games menu"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/abenteuer-titel.png" width="200" alt="Adventure title screen"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/abenteuer-karte.png" width="200" alt="Adventure map"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/abenteuer-level.png" width="200" alt="Adventure level"></p>

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/lernspiel-uhr.png" width="200" alt="Reading the clock"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/lernspiel-geld.png" width="200" alt="Counting money"></p>

### Screen time 📺 (optional)

Switch it on under **⚙️ Settings → ⚙️ General → 📺 Screen time**. Then tick **📺 Screen time** in the reward editor and choose minutes and device.

- When redeemed, the reward becomes a **voucher**. When the kid starts it, the device is **switched on** (switch, plug, TV, script …), a **countdown** runs at the top, there's a **warning** 5 minutes before, and at the end it's **switched off** or a script runs.
- Parents see running times in the 📋 Today tab and can give **+10 min** or **⏹️ stop**. Switching off is done by any open card, e.g. the wall tablet.
- **Finding the device:** the list is grouped by kind (📺 TV & media, 🔌 switches & plugs, 💡 lights, 📜 scripts …) and sorted by name. Use **🔎 Search device** and just type part of the name.
- **📱 Phone or tablet:** can't be switched on and off directly. Use the device's **internet switch** instead (e.g. from your router integration such as FRITZ!Box: “… Internet access”) or your own script – internet during the time, none afterwards.
- **Tip:** don't cut a games console's power at the plug – better switch off the TV or use a script, e.g. to block the console's internet in your router.

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/lernspiel-loesung.png" width="200" alt="Answer after a wrong try"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/lernspiel-schwierigkeit.png" width="200" alt="Difficulty per kid"></p>

<p align="center"><img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/minispiel-rechnen.png" width="200" alt="Maths mini game"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/bildschirmzeit.png" width="200" alt="Screen time"> <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/haustier-eltern.png" width="200" alt="Pet tab"></p>

Pet, mini games and screen time live in their own files (`yippee-kids-chores-pet.js`, `yippee-kids-chores-games.js`, `yippee-kids-chores-screen.js`), loaded only when switched on. The characters are drawn in code – there are no image files. The screenshots show the German interface.

### Learning, reading & pet home 🏠 (optional)
- **🏠 Pet home** (🐾 tab → switch on “🏠 Home”): a room of its own for the pet. Through the window you see the weather from Home Assistant – rain and snow stay outside, indoors the pet needs no umbrella. You pay with **🪙 coins** – a currency of their own: coins come from all pet games (learning games 1 coin per right answer, skill games 1 coin per 5 points, at most 20 per round) and at the goal in the 🏃 adventure. Real ⭐ stay untouched; if you like, create a reward with “🪙 Coins for the pet home” – then the kid swaps stars for coins there (coin rewards are always single, never shared). How many ⭐ per day may be swapped is set with the prices (default: at most 10, no limit also possible). With them the kid buys 20 things (bed, sofa, rug, lamp, aquarium, wallpaper …), tap and confirm; the 🛏️ bed is always in the room (move only); bought things can be put away, set up again and moved around the room: tap and move with the arrow pad, or drag with your finger. Nothing overlaps – furniture stays on the floor, pictures on the wall, “↺ Tidy up” puts everything back. While the pet sleeps you can still visit: moonlight falls into the dark room and the pet sleeps in its bed – just watching. You set the prices yourself: cheaper or dearer for everything (½×–3×) or each thing on its own (0 = free). Plus, each can be switched off: 🎄 **seasonal decorations** (December, Easter, October), 🎂 **birthday in the room** with garland, cake, party hat and birthday coins once, a 🌳 **garden** as a second room for 200 🪙 with its own shop (slide, paddling pool, dog house …) and 👋 **visits** from a sibling’s pet (+2 🪙 for both once a day). Own file `yippee-kids-chores-home.js`.
- **💡 Note for parents** (can be switched off): the 📋 Today tab shows a note when a kid hasn’t done a chore for 3 days or their pet is sad – only in the card, no message.
- **🇬🇧 English words** (new learning game): about 270 words by school year in four kinds of questions (picture → word, listen → picture, read → picture, missing letter), read aloud in English with 🔊 right next to each answer. Hidden when the card itself is in English.
- **✖️ Times tables** (new learning game): pick the rows, 10 sums against the clock, with a best time per row or selection. Both new games also work as a 🎮 game task and count in the learning statistics.
- **📚 Reading diary** (⚙️ Settings → 🎉 Fun & collecting): kids add their books, log reading minutes (+10′ … +30′) and put finished books on the 📚 bookshelf. Each book earns stars (default 5) – with approval switched on only after your ✓ under 🔔 Approvals. Own file `yippee-kids-chores-read.js`.

### Fun & collecting 🎉 (optional)
All optional under ⚙️ Settings → 🎉 Fun & collecting (own file `yippee-kids-chores-fun.js`, only loaded when something of it is on):
- **🎡 Wheel of fortune:** whoever has done all of today’s tasks may spin once – by default +1, +2 or +5 ⭐, a 🎟️ free game or “Nothing this time”. You set the prizes and their weight (how often they come up).
- **📒 Sticker album:** with a bit of luck (default 30 %) every finished task brings a sticker – 4 albums (animals, vehicles, space, sea) with 24 stickers each, doubles are counted. Optional bonus stars for a full album. Unticking and ticking again brings no second sticker.
- **🥚 Easter egg hunt** (Palm Sunday to Easter Monday) and **🎃 pumpkin hunt** (24–31 October), each switchable: about every third task randomly hides something – the kid finds it when finishing the task and collects it in the 🧺 Easter nest or 🎃 pumpkin basket, optionally with +1 ⭐.
- **📊 Weekly report** (🔔 Notify on …): Sundays from 6 pm per kid tasks, stars, balance, piggy bank, stickers and Easter eggs – to the devices of the weekly review.
- **🔔 Reminder at fixed times** (🔊 Voice output): at your times the speaker says what a kid still has open – only if they are home, optionally on separate speakers. Needs an open card (e.g. the wall tablet).

### More extra features (all optional)

Each can be switched on under **⚙️ Settings** – every feature sits where it belongs by topic: **⚙️ General · ✅ Tasks & daily routine · ⭐ Points & bonuses · 🎁 Rewards & money · 🔔 Notifications · 🔌 Devices & voice · 📈 Analysis · 💾 Data**, each in its own collapsible section showing “on” or “off”.

- **📋 Routines:** several steps in one chore (e.g. a morning routine); the child ticks off each step, the stars come with the last one. Own “📋 ＋ Routine” button; add steps via search (suggestions from the first letter) from your chores and templates or type them, sort with ▲▼. Chores in a routine only appear as a step. 11 templates included: morning, evening, after-school, homework, room, weekend, nap, bath, mealtime, pet and sports routine.
- **📖 Manual** in the parents area (📖 top right) in **chapters like the settings**, with **search and keywords** (e.g. NFC, presence, PIN) in all 27 languages – 57 topics from “Getting started” to “👫 Shared rewards” and “💽 Storage & clean-up” – a separate file `yippee-kids-chores-manual.js` next to the card, installed automatically by the Marketplace and loaded only when opened.
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
- **Settings “Simple” or “All”**: optionally only the essentials (language, vacation, approval, notifications, backup, access protection) – everything else one tap away as **🧩 tiles per area** (tapping shows only that area), with a **🔎 search field** across all settings (title matches first), **toggles right in the row** and a **📖 button** to the matching manual topic; the same tiles with search are in the tabs 🐾 Pet, 💰 Pocket money, 🦷 Teeth and 🎄 Advent
- **Behaviour** 😊 (optional): reward with one tap on the green “😊 +1” button in the Today tab (stars adjustable), optionally deduct stars with the red “😠 −1” button – logged in the points history. Under 👧 Kids a **📊 behaviour chart** shows the last 14 days with average and trend
- **🏖️ Only on school-free days** for chores that should only appear at weekends, in the holidays and on public holidays – the counterpart to “🎒 school days only”
- **🕒 More relaxed times on school-free days** (optional): on school-free days a time window runs longer – you choose how much: until the end of its day block (“brush teeth until 9:00” then counts until the end of 🌅 Morning), 30 minutes, 1 or 2 hours longer, or no time limit. Chores that must always be on time (e.g. medicine) get the tick **⏰ Fixed time on days without school too**. Sleeping in isn't “missed”. **You set the day block times yourself** (default: midday from 11:30, afternoon from 16:00, evening from 18:00) – each block ends where the next begins, no overlaps; the Tasks tab lists chores **per child**, optionally divided by time of day, by type (routines / required / bonus / special) or not at all – each group collapsible
- **Approval** of chores and rewards – in the card, via app button or Telegram button; handled approvals disappear from all phones – via the button in the message even without an open card
- **Penalties only after your decision**: missed = excused, minus stars or done after all
- **◀ Catch up on past days**: go back up to 7 days in the Today tab and tick or untick there – e.g. when something is still missing after midnight (parents only)
- Manual adjustments, **points history**, **5-week chart** under 📊 Reports, **💶 pay out stars** (with 💰 pocket money it goes into the piggy bank), **double-points days**
- **Holidays** per kid, **school holidays and public holidays** automatically
- compact **daily summary** and **weekly review** messages (one line per child, optionally one message per child and per-report recipients), **📊 reports** in the Kids tab (60 days, 52 weeks, frozen daily snapshots, CSV download), trend vs. last week in the weekly review, **morning announcement** and **reminders** on speakers

### Safety and data
- **Automatic backups** (optionally into a second list), backup file download
- **Data check** that warns about missing or externally changed entries
- **📴 Offline buffer**: if Home Assistant is briefly gone (Wi-Fi, restart), the kids’ device remembers the ticks (“📴 offline – will be added later”) and adds them automatically
- **♿ Accessibility**: high contrast and less motion (for all devices or just one), keyboard operation, labelled buttons for screen readers
- **▾ Collapsible parent Today tab:** tap a child or a time-of-day block (Morning … No time) to collapse/expand it, remembered on the device; finished or past times of day collapse automatically, “▸ Collapse all” for all children at once
- **🎁 Parents redeem directly:** 📋 Today → 🎁 next to the kid – right away, no approval; shared rewards by share or 💝 invitation
- **🎁 Rewards sorted by type** (for one kid · together · Joker), by ⭐ stars or 🔤 A–Z – or **👧 by child** (per child, for all, together); the kid view shows redeemable ones first
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

### Marketplace (recommended)

Since Home Assistant 2026.11, HACS is built in as the **Marketplace**.

**Quickest:** tap the button – it opens Yippee! directly in the Marketplace of your Home Assistant, then just **Install**:

[![Open in the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Chrism1412&repository=yippee-kids-chores-card&category=plugin)

Or by hand:

1. **Settings → Marketplace** → the link icon (🔗 with ➕) next to the search, top right → **Add from link**
2. GitHub link: `https://github.com/Chrism1412/yippee-kids-chores-card` → **Add** (if asked, choose type **Dashboard**)
3. Open **Yippee! - Kids Chores** → **Install** → confirm the version → **Install**
4. Reload the page

The Marketplace adds the resource automatically. Custom repositories need a connected GitHub account (the Marketplace asks the first time). Alternatively use ⋮ → **Custom repositories**.

> **Older Home Assistant with HACS:** HACS → ⋮ (top right) → **Custom repositories** → repository `https://github.com/Chrism1412/yippee-kids-chores-card`, type **Dashboard** → **Add** → search **Yippee! - Kids Chores** → **Download** → reload the page.

### Manual

1. Download all files from the [`dist/`](https://github.com/Chrism1412/yippee-kids-chores-card/tree/main/dist) folder: the card `yippee-kids-chores-card.js`, the 👨‍👩‍👧 parents area `yippee-kids-chores-admin.js`, the 📖 manual `yippee-kids-chores-manual.js`, the 🎄 advent calendar `yippee-kids-chores-advent.js`, the 🦷 toothbrush timer `yippee-kids-chores-teeth.js` with its music `yippee-kids-chores-teeth-music.js`, the 💰 pocket money `yippee-kids-chores-money.js`, the 🐾 pet `yippee-kids-chores-pet.js`, the 🎮 mini games `yippee-kids-chores-games.js`, the 📺 screen time `yippee-kids-chores-screen.js`, the 🗺️ adventure `yippee-kids-chores-adventure.js`, the ✏️ card editor `yippee-kids-chores-editor.js`, the 🧩 extra features `yippee-kids-chores-extras.js`, 🎉 fun & collecting `yippee-kids-chores-fun.js`, the 🏠 pet home `yippee-kids-chores-home.js`, the 📚 reading diary `yippee-kids-chores-read.js` and the language files `yippee-kids-chores-lang-xx.js`.
2. Create the folder **`/config/www/community/yippee-kids-chores-card/`** and copy all files into it. This is the same folder the Marketplace (formerly HACS) uses, so you can switch later without changes.
3. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.7.2`
   - Type: **JavaScript module**
4. Reload the page.

> **Manual updates:** copy **all files from [`dist/`](https://github.com/Chrism1412/yippee-kids-chores-card/tree/main/dist)** into the same folder again (not just the card – otherwise it shows up in German and the manual, advent calendar, toothbrush timer or pocket money is missing) – that's it. The card raises the number after `?v=` in the resource automatically when an administrator opens the parents area – see [Updates](#updates).

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
```yaml
# Just the 🎄 advent calendar (switch it on under ⚙️ Settings first; leave out child = all kids to switch between)
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: advent
child: Mia
advent_size: 120   # optional: door size for this card only (50–220)
```

**🎄 Advent calendar as its own dashboard** across the full width – create a new dashboard → ✏️ Edit → ⋮ → **Raw configuration editor** → replace everything with:
```yaml
views:
  - title: Advent
    path: advent
    type: panel
    cards:
      - type: custom:yippee-kids-chores-card
        storage: todo.yippee_kids_chores
        mode: advent
```
Important: `views:` starts at the very left, each level below is indented by 2 more spaces. With `child: Mia` (below `mode: advent`) the dashboard shows only one kid – e.g. for the tablet in the kids' room.

3. In the parents view: add **kids**, **chores**, **rewards**, then go through **⚙️ Settings**. All settings apply to every kids card and device automatically.

A complete example dashboard is in [`examples/dashboard.yaml`](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/examples/dashboard.yaml).

## Card options

| Option | Values | Default | Description |
|---|---|---|---|
| `storage` | `todo.…` | – | **Required.** The Local To-do list used as storage |
| `mode` | `admin`, `kids`, `kid`, `advent` | `admin` | Parents view, all kids, one kid or just the 🎄 advent calendar |
| `child` | name | – | With `mode: kid`: which kid. Optional with `mode: advent` (without: all kids to switch between) |
| `pages` | `true` / `false` | as ⚙️ | With `mode: kids`: one kid per page – the kids at the top to tap, swiping switches the kid |
| `collapsed` | `true` / `false` | `false` | Show kids collapsed |
| `summary` | `true` / `false` | `false` | Only a small summary per kid (points, today, goal, level, balance) – e.g. for a family dashboard |
| `show` | list | all | With `summary`: which parts – `points`, `today`, `goal`, `level`, `net` |
| `equal_tiles` | `true` / `false` | as ⚙️ | Equal-height task tiles (room for three lines) and rewards – several kid cards line up side by side |
| `colors` | `default`, `light`, `dark`, `pastel`, `ocean`, `forest`, `sun`, `night`, `candy`, `custom` | as ⚙️ | Colour preset for this card only (`default` = like the dashboard, `custom` = your own colours from ⚙️) |
| `tap_action` / `double_tap_action` / `hold_action` | Home Assistant action | – | Only with `summary`: what happens when the summary is tapped, double-tapped or held, e.g. `action: navigate` with `navigation_path: /dashboard-haus/{kind}` or `action: more-info` (the child’s sensor). `{kind}` is replaced by the child’s name |
| `compact` | `true` / `false` | as ⚙️ | Less spacing |
| `transparent` | `true` / `false` | as ⚙️ | No own background – blends into the dashboard |
| `scale` | `70`–`130` | as ⚙️ | Card size in percent. Under ⚙️ → 🎨 Appearance there is also **🔠 Size on this device only** (90–150 %, e.g. a bigger font on the kids’ tablet) – it takes priority |
| `advent_size` | `50`–`220` | as ⚙️ | With `mode: kid`, `kids` and `advent`: size of the 🎄 advent calendar doors in px for this card only (e.g. wall tablet). “📱 This device only” from the parents view takes priority |
| `family` | `true` / `false` | automatic | Show the family goal on this card (automatically only once per page) |
| `language` | e.g. `en`, `fr` | setting / HA language | Language for this card only (e.g. on the kids’ tablet) |
| `wizard` | `true`, `false` | `true` | `false` = no setup assistant on first start (can still be started under ⚙️ Settings) |
| `pin` | digits | – | Legacy PIN. Better: set it in Settings → 🔒 Access |
| `pin_minutes` | number | `5` | Lock the parents area again after this many idle minutes |

“as ⚙️”: if not set, the card uses what is set in the parents view under ⚙️ Settings → ⚙️ General → 🎨 Appearance for all cards (default: off / 100 %). A value in the card config wins – e.g. only the tablet card larger.

## Integrations

All integrations are **optional** and can be switched on and off individually.

- **Home Assistant companion app:** notifications for finished chores, reward requests, missed chores, daily summary and weekly review – with **action buttons** (approve / reject, excused / minus stars / done). The card creates the needed automation with one tap. After a tap, the automation removes the message right away from the other selected phones too – no open card needed.
- **Telegram:** the same messages with **inline buttons**, photos for photo proof, and the commands `/punkte` (points), `/offen` (open chores), `/heute` (daily summary now), `/woche` (weekly review now) and `/hilfe` (help). The settings show when the last button press arrived, from whom and whether it was booked – and warn clearly if the buttons automation is missing. A test button shows Telegram's error message if buttons are rejected.
- **Text-to-speech / Alexa:** any TTS integration with media players, or *Alexa Media Player* (Marketplace) – for the **morning announcement** ("Good morning Mia! Today: brush teeth, make bed and take out the trash (paper).") and **reminders** shortly before a time window ends.
- **🗑️ Trash calendar:** chores like "Take out the trash" or "Pack the sports bag" (keyword `Training`) take their dates from any Home Assistant calendar – e.g. **[Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule)** (Marketplace, hundreds of providers), a **Remote calendar** with your provider's ICS link, or a **Local calendar**. Per chore: keywords (e.g. `paper, residual`), and **"the evening before"** so the bin goes out in time. The tile shows what is collected.
- **📚 Events as tasks:** under ⚙️ Settings **＋ Link a calendar** – each entry turns into its own chore with its text as the title. Ideal for homework: “HW: Maths p. 42” due Friday shows up on Thursday for the chosen child. Settings: calendar, children, emoji, stars, “the day before” or “on the day”, keyword filter (e.g. `HW:`) and minus points (default **0**). **✅ Tasks → 📚 From calendars** lists the next 14 days; single events can be hidden with 🙈 without touching the calendar.
- **School holidays and public holidays:** choose country and region – the card fetches the data itself from the **[OpenHolidays API](https://www.openholidaysapi.org)** (free, **no API key**, 36 countries). Fallback: the built-in **Holiday** integration and a school-holiday calendar.
- **Stars from automations / voice assistants:** the card creates the script `script.yippee_sterne` (fields `kind`, `sterne` – negative to deduct –, `grund`), usable in automations, scripts and – via one script per kid – Google Assistant or Alexa.
- **🎨 Appearance** (⚙️ Settings → ⚙️ General for all cards, or per card in the card editor): **🎨 colour presets** to tap (like the dashboard, light, dark, pastel, ocean, forest, sun, night, candy) or ✏️ your own colours with a colour picker – text and tiles adapt automatically, with a warning if the text is hard to read; in Home Assistant's dark mode, light presets automatically turn dark on that device, own colours optionally too –, 📏 equal-height tiles (several kid cards side by side line up), compact, no background and size 70–130 %.
- **Theming:** CSS variables `--yippee-bg`, `--yippee-surface`, `--yippee-accent`, `--yippee-text`, `--yippee-text-secondary` for themes or card_mod.
- **Sensors:** `sensor.yippee_<name>` per kid (state = points) with the attributes `heute_erledigt`, `heute_gesamt`, `alles_erledigt`, `offen`, `wartet_auf_freigabe`, `level`, `level_name`, `gesamt_verdient`, `abzeichen`, `ziel`, `urlaub`, `anwesend`, `feiertag`, `ferien` (and `euro`) – e.g. "TV only after all chores are done". Updated while the card is open for an administrator. **🔁 Available right after a restart** (1.7.0, optional): ⚙️ → 🔌 Devices & voice → 📊 Sensors → turn on “Available right after a restart”, **📋 Copy template**, save it as `packages/yippee.yaml` (if packages are set up) or paste it into `configuration.yaml` and restart Home Assistant – a template sensor then reads each kid's last state from the Yippee list, no open card needed. The card shows ✅ when it is running and ⚠️ when it needs to be copied again after adding or renaming children. If the template itself changes (e.g. after an update), the parents view shows a hint at the top – just copy it again, paste it and restart. **Important:** the template may only be in one place – replace an older copy (e.g. in `configuration.yaml`), don’t add a second one. If it is entered twice, the card tells you. Sensors update within seconds when something is checked off. Ready-made automations at the tap of a button: 🎉 announcement and message when the family goal is reached, and 📋 an evening reminder if a child hasn't finished everything. With a family goal there is also `sensor.yippee_familienziel` (state = stars collected; attributes `ziel`, `ziel_sterne`, `fehlen`, `prozent`, `erreicht`, `prognose_tage`, `prognose_datum`). Home Assistant 2025.10 or newer.
- **Background automation:** morning announcement, reminders, missed-chore messages, daily summary and Telegram commands run inside Home Assistant – **even when no card is open**. The card writes a 14-day plan and creates the automation with one tap.

## Data safety

- **Backup file** (`YippeeKidsChoresDDMMYYYY.json`) to download, share, copy and restore
- **Automatic backups** daily or weekly (last 4 kept), optionally also in a **second Local To-do list** that survives if the main list is deleted
- **🛡️ Back up before updates:** when there is a new Yippee! version (Marketplace/HACS) – or it starts for the first time – the card makes an extra backup right away (can be switched off)
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

- **Update available:** when the Marketplace (formerly HACS) knows a newer version, the parents area shows a notice.
- **Resource raised automatically:** when the file on the server is newer than the one running in the browser, the card writes the new version into the resource itself (`?v=1.5.0` …) as soon as an administrator opens the parents area, then offers a reload button. With the Marketplace (formerly HACS), the Marketplace updates the resource; the card just offers the reload. Can be switched off under ⬆️ Updates.

See the [CHANGELOG](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/CHANGELOG.en.md) (also available in [German](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/CHANGELOG.md)).

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
- **[RkcCorian](https://github.com/RkcCorian)** – summary card per kid, appearance options, kid order, equal-height tiles, tap actions on the summary card, persistent sensors after a restart, clearing handled approvals on all phones and the reports about the ✓ buttons, the phone layout and own emojis ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), [#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), [#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), [#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), [#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10), [#11](https://github.com/Chrism1412/yippee-kids-chores-card/issues/11), [#12](https://github.com/Chrism1412/yippee-kids-chores-card/issues/12), [#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13), [#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14), [#15](https://github.com/Chrism1412/yippee-kids-chores-card/issues/15)).
- **[gogui63](https://github.com/gogui63)** – negative balance with net score and stars from automations or voice assistants ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), [#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8)).
- **[Sysman2018](https://github.com/Sysman2018)** – the idea for 🎓 stars for good school grades ([#2](https://github.com/Chrism1412/yippee-kids-chores-card/issues/2)).
- **[Daniel-PT](https://github.com/Daniel-PT)** – found the IP-ban bug for non-admin users ([#3](https://github.com/Chrism1412/yippee-kids-chores-card/issues/3)).
- **[OpenHolidays API](https://www.openholidaysapi.org)** – provides public and school holidays.
- **[Home Assistant](https://www.home-assistant.io)** and **[HACS](https://hacs.xyz)** (now the Marketplace in Home Assistant) – without them this card would not exist.

## Support ☕

Yippee! is and will stay free and open source. If it makes your family life a bit easier, I’d be happy about a coffee: **[buymeacoffee.com/Chrism1412](https://buymeacoffee.com/Chrism1412)** – completely optional. A ⭐ on GitHub or an idea or bug report as an [issue](https://github.com/Chrism1412/yippee-kids-chores-card/issues) helps just as much.

<p align="center"><a href="https://buymeacoffee.com/Chrism1412"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="50"></a></p>

## License

[MIT](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE) © 2026 Chrism1412
