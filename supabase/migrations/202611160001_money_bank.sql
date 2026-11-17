-- Money Garden: authenticated, read-only client banking feed.
-- Apply only in your PRIVATE Supabase project. Do not insert any banking data
-- into GitHub or seed test data containing actual balances or transactions.
create extension if not exists pgcrypto;

create table if not exists public.money_bank_items (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 plaid_item_id text not null unique,
 encrypted_access_token text not null,
 cursor text,
 created_at timestamptz not null default now(),
 last_synced_at timestamptz
);
alter table public.money_bank_items enable row level security;
-- No user policies: only server-side service role can access bank tokens.

create table if not exists public.money_bank_accounts (
 id text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 item_id uuid not null references public.money_bank_items(id) on delete cascade,
 name text not null,
 mask text,
 kind text,
 current_balance numeric,
 available_balance numeric,
 updated_at timestamptz not null default now()
);
create index if not exists money_bank_accounts_owner on public.money_bank_accounts(user_id);
alter table public.money_bank_accounts enable row level security;
drop policy if exists "owner reads bank accounts" on public.money_bank_accounts;
create policy "owner reads bank accounts" on public.money_bank_accounts for select to authenticated using ((select auth.uid())=user_id);

create table if not exists public.money_bank_transactions (
 id text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 item_id uuid not null references public.money_bank_items(id) on delete cascade,
 account_id text not null,
 date date not null,
 merchant text not null,
 description text,
 amount numeric not null, -- Plaid sign: positive is outflow, negative is inflow
 category_primary text,
 category_detailed text,
 pending boolean not null default false,
 updated_at timestamptz not null default now()
);
create index if not exists money_bank_tx_user_date on public.money_bank_transactions(user_id,date desc);
alter table public.money_bank_transactions enable row level security;
drop policy if exists "owner reads transactions" on public.money_bank_transactions;
create policy "owner reads transactions" on public.money_bank_transactions for select to authenticated using ((select auth.uid())=user_id);

-- Do not add client-side write policies. The authenticated browser can ONLY read
-- its own rows. The Edge Function's server-side service role performs inserts
-- and upserts after Plaid authentication and a validated user session.
revoke all on public.money_bank_items from anon, authenticated;
grant select on public.money_bank_transactions, public.money_bank_accounts to authenticated;
