# Bloom & Balance — My Wellness Garden 🌷

A date-driven, editable **seven-day** scrapbook-style wellness tracker built with **React 19, Vite, and Tailwind CSS v4**. The project is a static client-side app: no login, backend, telemetry or remote journal storage.

## Your day, not another dashboard

- **Sunrise ritual**: optional 5 AM coding (Mon/Wed/Fri) or 6 AM gentle run (Tue/Thu/Sat), sunlight, prayer, rotating drinks, gentle gua sha (skip irritation), barrier care, daily journal, polished get-ready routine (pressed outfit + cared-for hair) and an early weekday work-start target. **Hair care and lubricating eye drops are scheduled in the evening, not the morning.**
- **After work**: rotating 3-ab/1-upper/1-lower training plan, food ideas, recovery, a 3:30 PM homecoming goal (subject to approved hours and actual travel), a protected weekday 6:45 PM Google/DSA coding block, optional 8–9 PM catch-up and a weekend social block tied to real plans.
- **Sunset ritual**: all-seven-day rotating, detailed hair routine (Mon/Fri dandruff wash, Tue scalp rest, Wed moisture, Thu optional scalp tonic, Sat recovery, Sun wash-or-rest), a 9 PM reset, gentle skincare, optional heatless curls, eye compresses, gratitude, a *different mental wellness prompt every day*, reading, and a gentle sleep target.
- **Nourish & move**: vegetarian breakfast, pre-workout, post-workout and dinner suggestions change with weekday; rotating lemon, kefir, chia and green-smoothie ideas.
- **Calendar + seven-day atlas**: select any date, see that day’s hair care, movement, mood focus and saved social events, with interactive completion dots.
- **Mind & social garden**: add your own dated outings, meetups, calls and notes; the event automatically feeds that date’s rituals (and the weekend connection block), stays only in the browser, and appears as a lavender calendar dot. Includes seven rotating small social-confidence challenges.
- **Ritual Studio**: click a routine and edit its text, steps, time, section and recurrence (**daily, chosen weekdays, every N days from a chosen anchor, or optional/as-needed**). Add your own recurring reminders.
- **Privacy**: your social calendar, daily mood, energy, stress, journal entries, completed rituals and water count stay in the same browser's localStorage. Export/import a JSON backup under **My Space**. Backups contain sensitive notes—treat them privately.

## How recurrence works

All built-in reminders are editable. In **Ritual Studio**, change a ritual to daily, specific weekdays, every N days (with a start date), or optional; the selected day recalculates instantly. The seven-day atlas reflects customized hair schedules as well. Hairwash product steps are examples based on the supplied planner, **not prescriptions**. Default **weekday** morning ritual times run earlier to fit a 7–7:30 AM work start, while **weekends** have a gentler, later time schedule. Editing any item time in Ritual Studio overrides the dynamic weekend preset. Being **home at 3:30 PM** is a goal, not the same as leaving the office at 3:30 PM; allow commute time and follow approved work hours. Morning early coding/running blocks are optional goals: prioritise adequate sleep, especially with a 10 PM bedtime and 5 AM wakeup. Gua sha is always skippable if skin is irritated.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm test
npm run dev
```

Then visit `http://localhost:5173`.

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

Vite's public base is configured for the `aishwaryaapsangi/my-wellness` repository at `/my-wellness/`. GitHub Actions workflow: `.github/workflows/deploy.yml`.

1. In repository **Settings → Pages**, choose **GitHub Actions** as Source.
2. Go to **Actions** and run **Build and publish wellness garden**, or push to `main`.
3. After it succeeds, open `https://aishwaryaapsangi.github.io/my-wellness/`.

The repo can be public, but all **personal** journal entries and custom schedules live in the user's browser only; the source contains general example routines. There is no cross-device sync. Avoid committing exported JSON backups to GitHub.

## Important care boundaries

This is a customizable **habit tracker, not medical guidance or a medication administration app**. It does not schedule isotretinoin doses, claim to prevent adverse reactions or automatically prescribe supplements. Its hairwash/eye-compress cadence is an editable example inspired by the supplied plan and should be adjusted with a clinician. Eye lubrication should be used as needed rather than constrained to scheduled reminder days. During isotretinoin, avoid harsh scrubs, retinoids and exfoliating acids unless specifically cleared by your dermatologist.

- Dermatology reference: [AAD isotretinoin safety, side effects and skin care](https://www.aad.org/public/diseases/acne/derm-treat/isotretinoin/side-effects)
- For any severe mood change, eye pain or loss of vision, severe headache with visual changes, or other urgent symptoms, seek medical advice rather than relying on a checklist.

## Technical notes

- `src/planner.js` — default routines, healthy food rotations, exercise split, date and recurrence engine. Recurrence is **local-calendar-based**, not dependent on UTC date parsing.
- `src/App.jsx` — UI and persistence interactions.
- `src/storage.js` — versioned local storage and JSON backup logic.
- `src/styles.css` — custom scrapbook design system layered on Tailwind v4.
- `tests/planner.test.js` — recurrence/date/split unit checks using Node's built-in test runner.

Adapted from the project owner's personal routine references. The UI artwork is original SVG created for this project rather than copies of reference websites.
