-- Row Level Security for ExpenseFlow.
-- The anon key in script.js is public by design, so these policies are the only
-- thing stopping one user from reading or deleting another user's expenses.
-- Run once in the Supabase SQL editor.

alter table public.expenses enable row level security;

drop policy if exists "own rows: select" on public.expenses;
drop policy if exists "own rows: insert" on public.expenses;
drop policy if exists "own rows: delete" on public.expenses;

create policy "own rows: select" on public.expenses
  for select using (auth.uid() = user_id);

create policy "own rows: insert" on public.expenses
  for insert with check (auth.uid() = user_id);

create policy "own rows: delete" on public.expenses
  for delete using (auth.uid() = user_id);

-- No update policy: the app never edits rows, so updates stay blocked.

-- Check: should list the three policies above and rowsecurity = true.
select tablename, rowsecurity from pg_tables where tablename = 'expenses';
select policyname, cmd from pg_policies where tablename = 'expenses';
