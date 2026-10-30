# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Anyone who wants to track personal spending. Adults managing a monthly budget who want a quick view of where money went this week and this month.

## Product Purpose
A free personal expense tracker. Users log an expense with a description, amount and category, and see weekly, monthly and all-time totals. Success means a user can log a purchase in seconds and know the week's total at a glance.

## Positioning
Open item: the user did not confirm a differentiator beyond "free and simple". Do not claim features (bank sync, budgets, reports) that the code does not have.

## Operating Context
Used on a phone or laptop, often right after a purchase. Accounts are created with email and password through Supabase; expenses sync to the cloud. Hosted on GitHub Pages.

## Capabilities and Constraints
- Sign up, sign in, sign out (Supabase auth).
- Add expense: description, amount (₹), category (Food, Transport, Shopping, Entertainment, Bills, Other).
- Delete expense.
- Totals: this week, this month, all time. Currency is Indian rupee (₹).
- Static HTML/CSS/vanilla JS; no build step. Supabase anon key is public by design; row-level security protects data (see supabase-rls.sql).
- Undecided: editing expenses, export, budgets, multi-currency.

## Brand Commitments
Name: ExpenseFlow. Existing visual identity is black with electric blue (#0a84ff) and a purple accent. Keep the name and this palette unless the user asks to change them.

## Evidence on Hand
Live demo: https://akshat-agrawal18.github.io/expense-flow/. No user testimonials, usage numbers or press exist. Do not invent any.

## Product Principles
- Logging an expense takes seconds; keep the form short.
- Totals are the point of the product; they stay visible and accurate.
- Never claim features the app does not have.
- Money figures are shown in tabular numerals so they line up.

## Accessibility & Inclusion
Keyboard-operable controls with visible focus, readable placeholder and secondary text (WCAG AA contrast), and layouts that work on phones.
