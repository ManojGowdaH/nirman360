-- Enquiry storage for the marketing website.
-- Apply this in the Supabase SQL editor before using the server forms.
-- The service-role key bypasses RLS and must stay on the server.
-- Do not add a policy that lets the anon or authenticated roles insert or read these rows.

create extension if not exists pgcrypto;

create table if not exists public.website_requests (
  id uuid primary key,
  kind text not null check (kind in ('contact', 'partner', 'deletion')),
  payload jsonb not null,
  ip_hash text,
  status text not null default 'received' check (status in ('received', 'in_review', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.website_requests enable row level security;

create index if not exists website_requests_created_at_idx
  on public.website_requests (created_at desc);

comment on table public.website_requests is
  'Website enquiries only. Recording a deletion row does not delete an auth user.';
