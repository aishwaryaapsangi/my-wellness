# Bloom & Balance — My Wellness Garden 🌷

A date-driven, editable scrapbook-style wellness tracker built with **React 19, Vite, and Tailwind CSS v4**. The project is a static client-side app: no login, backend, telemetry or remote journal storage.

## Your day, not another dashboard

- **Sunrise ritual**: hydration/rotating drinks, intentions, optional gua sha, skin barrier care, journaling, *and only the hair or eye-care steps scheduled for the selected day*.
- **After work**: rotating 3-ab/1-upper/1-lower training plan, food ideas, recovery and optional work catch-up.
- **Sunset ritual**: a 9 PM reset, gentle skincare, conditional scalp treatments, optional heatless curls, eye compresses, journaling, reading and a gentle bedtime target.
- **Nourish & move**: vegetarian breakfast, pre-workout, post-workout and dinner suggestions change with weekday; rotating lemon, kefir, chia and green-smoothie ideas.
- **Calendar**: select any date, see whether hair care or exercise is due and view what you completed on that date.
- **Ritual Studio**: click a routine and edit its text, steps, time, section and recurrence (**daily, chosen weekdays, every N days from a chosen anchor, or optional/as-needed**). Add your own recurring reminders.
- **Privacy**: daily mood, energy, stress, journal entries, completed rituals and water count stay in the same browser's localStorage. Export/import a JSON backup under **My Space**. Backups contain sensitive notes—treat them privately.

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
