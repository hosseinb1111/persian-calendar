# Persian Calendar (تقویم شمسی)

A single-file Persian (Solar Hijri / Jalali) calendar web page with light and dark mode, Persian occasions, and a Vazirmatn typeface.

## Features

- Persian month and year display, with Saturday-first weeks and Friday highlighted
- Previous and next month navigation, plus a "Today" button
- Tap any day to see its Persian and Gregorian dates and any occasion
- Official holidays (تعطیل رسمی) in red, cultural occasions (مناسبت فرهنگی) marked with a gold dot
- Light and dark mode that follows your system setting, with a manual toggle remembered in the browser
- Responsive layout that works on phones and desktops

## Usage

No build step or dependencies are needed. Open `persian-calendar.html` in any modern browser.

Persian dates are computed with the browser's built-in `Intl` API (`en-u-ca-persian`), so no conversion library is required. The Vazirmatn font is loaded from Google Fonts. If the network is unavailable, the page falls back to system fonts.

## Deploying

The page is a single self-contained HTML file. You can host it on any static host:

- **Cloudflare Pages:** `npx wrangler pages deploy <folder>`, or drag the folder into a Pages project in the dashboard.
- **GitHub Pages:** push the file to a repository and enable Pages from the repository settings.

## Adding occasions

Occasions are defined in the `OCCASIONS` object in the script. Keys are `"month-day"` on the Persian calendar, for example `"1-1"` for 1 Farvardin:

```js
'1-1': { title: 'نوروز، آغاز سال نو', holiday: true },
```

Set `holiday: true` for official public holidays and `holiday: false` for cultural occasions.

**Note:** Only fixed-date occasions are included. Lunar-calendar holidays such as Ramadan, Eid al-Fitr, Eid al-Adha, Tasua, and Ashura move each year and are not yet computed. Check the official Iranian holiday list before relying on the occasions for anything important.

## Credits

Created by Hossein Seyed Bagheri.

