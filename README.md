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

## November 16–December 31, 2026 · first wellness season

This first season spans **46 days**, beginning Monday, November 16 and ending Thursday, December 31. All day pickers and calendar views are bounded to this period.

The dashboard provides **two different percentages**:

- **Selected day:** completed checkmarks divided by scheduled rituals on whichever day you are viewing.
- **Overall · full 46 days:** completed checkmarks divided by every scheduled ritual from November 16 through December 31. Future unchecked rituals are part of the goal from the start, so one checkbox changes the overall percentage only a little. The percentage displays one decimal place.

The calendar shows per-day completion percentages and soft color shading. Changing a recurrence schedule recalculates history; all user entries remain locally stored in the browser, not uploaded to GitHub.

Hair care changes across seven evenings (including Wednesday moisturizing wash, Monday/Friday dandruff washes if prescribed, and recovery days); mental-wellness prompts, nourishing drink and meal suggestions, and gentle nighttime skincare guidance also vary by weekday. Lubricating eye drops remain in the evening on an editable every-two-days reminder; this schedule is for prompting, not a medical limit on when drops can be used. As always, follow product and clinician instructions.


## Money Garden (private personal-finance tab)

The **Money Garden** navigation tab is a responsive, blue-and-mocha personal budget and financial planning tracker. It includes a two-paycheck monthly income baseline for biweekly employees, editable spending envelopes, daily/weekly/monthly pacing, transaction history, bill dates, autopay flags, user-confirmed paid checkboxes, loan balances/interest/payoff illustrations, goal progress, and hypothetical net-income-raise scenarios.

**Security boundary:** this is a static public GitHub Pages site. It **does not** receive data directly from Bank of America, Finances, Plaid, or loan servicers. It never requests or stores bank passwords, credentials, access tokens, or account numbers. Money Garden stores manually supplied/imported data in this browser's unencrypted localStorage under a separate key from the wellness tracker. This protects it from the public repository but is **not** suitable for shared devices or confidential banking secrets.

To personalize it, download your **private Money Garden starter JSON file** from the chat, then open *Money Garden → Setup & privacy → Import Money Garden starter / backup JSON*. Private starter snapshots and transaction exports **must never be committed to this repository**. Refresh spending via the *Spending diary* CSV import (accepts Bank of America-style exports and the Finances transaction CSV format), and review transfer/credit-card payment categorizations to avoid double-counting. Backup/restore JSON remains local.

Alerts are **in-app visual nudges only** and work when you open the website with updated data. The static site cannot send automatic emails/SMS or monitor linked accounts in the background. Any separate ChatGPT spending-monitoring task or Finances account connection is independent of the local website and must be managed in ChatGPT.

All proposed category budgets and unverified bill dates are **editable planning assumptions**. The calculated 'unallocated in this plan' is *not* a safe-to-spend available bank balance. Confirm current cash, remaining bills, payment timing, and expenses outside connected accounts before making spending decisions. Estimated loan payoff durations use a simplified monthly-interest model, not lender payoff quotes.
