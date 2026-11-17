# Money Garden — private automatic bank-feed setup

The React site is public GitHub Pages. It MUST NEVER contain real bank records,
account login credentials, Plaid secrets or access tokens. Connected ChatGPT
Finances data cannot be shared directly with an unrelated GitHub Pages site.

## Architecture

- Public static React/Vite site: Supabase Auth email login, then Plaid Link.
- Supabase (PRIVATE, user-owned project): Auth + Postgres tables protected by
  per-user RLS; server-only Edge Functions.
- Plaid Transactions API: authorized, read-only account and transaction
  data via access token encrypted with AES-GCM in a private server-side table.
- Optional scheduled Edge Function: periodic transaction sync; not in-browser.
- The client sends no access tokens to GitHub. Your raw bank login details
  are entered only in the official Plaid/Bank of America consent flow.

## Provisioning checklist

1. Create or choose a Supabase project in YOUR account.
2. Execute migration `migrations/202611160001_money_bank.sql` in the project SQL editor.
3. Configure Supabase Auth email sign-in and add
   `https://aishwaryaapsangi.github.io/my-wellness/` to the allowed redirect URLs.
   Configure email deliverability for production.
4. Create a separate Plaid developer account at https://dashboard.plaid.com/signup.
   For eligible new US/Canada developers in 2026, the **free Plaid Trial** plan
   includes real bank data through Production for up to 10 linked Items, and
   supports OAuth institutions including Bank of America. Complete its Trial
   application and select a personal-finance use case. Follow any additional
   institution-specific steps; eligibility and limits may change. If not
   eligible, follow Plaid's production-access approval/pricing process.
   Plaid Sandbox returns simulated—not real—bank transactions.
   Register the allowed OAuth redirect URI as
   `https://aishwaryaapsangi.github.io/my-wellness/`.

5. Set the following **server-side Supabase Edge Function secrets** (never
   copy these into a repository or an email/chat message):
    - `PLAID_CLIENT_ID`: assigned by Plaid
    - `PLAID_SECRET`: your private Plaid production secret
    - `PLAID_ENV=production`
    - `PLAID_REDIRECT_URI=https://aishwaryaapsangi.github.io/my-wellness/`
    - `MONEY_GARDEN_ORIGIN=https://aishwaryaapsangi.github.io` (origin only;
      no `/my-wellness/` path)
    - `MONEY_GARDEN_ALLOWED_EMAIL`: the owner's authorized login email
    - `MONEY_GARDEN_TOKEN_KEY`: unique 32 cryptographically random bytes
      encoded as base64. Do not rotate without planning reauthorization.
    - `MONEY_GARDEN_CRON_SECRET`: long unique cryptographically random secret
    - Supabase's own server keys (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
      `SUPABASE_ANON_KEY`) available securely to your Edge Functions
6. Deploy `bank-api` and `bank-cron` using the Supabase CLI or connector.
   Both function handlers perform explicit authentication; `bank-cron`
   accepts only the configured private cron secret.
7. Configure the frontend **public** environment values using GitHub Actions
   variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
   See the website deployment workflow, which passes these at build time.
8. Trigger website deployment; visit Money Garden and follow the private
   email sign-in link. Click *Securely connect Bank of America* and complete
   the Plaid/Bank of America approval in the official Plaid Link modal.
9. Set a recurring server-side POST to
   `https://YOUR-PROJECT.supabase.co/functions/v1/bank-cron` with header
   `x-cron-secret: YOUR_PRIVATE_MONEY_GARDEN_CRON_SECRET`. Supabase's
   scheduler / pg_cron + pg_net can be used if configured securely.
   Schedule at most daily initially; inspect successful function logs.
10. Confirm that real transactions populate and update; check that no data
    appears when signing out and that a second test user cannot read the
    owner's records (RLS isolation).

## Important limitations

- Connecting Supabase to ChatGPT does NOT authorize Plaid or connect an
  existing ChatGPT Finances credential to this website. These are separate
  explicit permission grants.
- The site can't initiate payments or banking transfers.
- Automatic bank syncing is NOT active until you perform these steps. The
  website displays a setup message until it is provisioned.
- Local edits and bill schedules remain browser-local at present; linked
  transaction rows live in the private Supabase project. Avoid shared devices.
- The dashboard reads up to 1,000 recent rows per refresh. Expand pagination
  for longer bank histories before relying on exhaustive long-term reports.
- Category classification is heuristic. Verify external transfers, repayments
  and refunds when creating a personal budget to prevent double counting.
- Supabase/Plaid services can incur costs; check terms and pricing before
  using a production integration.
- The backend needs an ongoing owner-managed deployment and functioning
  secret storage, not just a static GitHub Pages site.
