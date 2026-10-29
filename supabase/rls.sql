-- Row Level Security for ExpenseFlow.
--
-- The anon key in script.js is public by design: anyone can call the
-- Supabase API with it. These policies are what stop one signed-in user from
-- reading, editing or deleting another user's expenses. Run this in the
-- Supabase SQL editor; it is safe to run more than once.

alter table public.expenses enable row level security;
alter table public.expenses force row level security;

-- New rows default to the caller, so a client cannot write rows for others.
alter table public.expenses alter column user_id set default auth.uid();

drop policy if exists "expenses_select_own" on public.expenses;
drop policy if exists "expenses_insert_own" on public.expenses;
drop policy if exists "expenses_update_own" on public.expenses;
drop policy if exists "expenses_delete_own" on public.expenses;

create policy "expenses_select_own" on public.expenses
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "expenses_insert_own" on public.expenses
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "expenses_update_own" on public.expenses
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "expenses_delete_own" on public.expenses
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Anonymous (signed-out) callers get nothing.
revoke all on public.expenses from anon;
