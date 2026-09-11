-- Keeply initial schema: products + email_notifications
-- Run once in the Supabase SQL Editor.

create type public.product_type as enum ('warranty', 'guarantee', 'subscription');

create type public.product_status as enum ('active', 'expired', 'cancelled');

create type public.reminder_type as enum ('7_days_before', '3_days_before', 'expired');

create type public.notification_status as enum ('pending', 'sent', 'failed');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text,
  notes text,
  product_purchase_url text,
  product_asset_url text,
  product_asset_public_id text,
  receipt_url text not null,
  receipt_public_id text,
  claim_url text,
  purchase_date date not null,
  duration integer not null check (duration > 0),
  expires_at date generated always as (purchase_date + duration) stored not null,
  type public.product_type not null,
  status public.product_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.email_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  reminder_type public.reminder_type not null,
  subject text not null,
  status public.notification_status not null default 'pending',
  provider_message_id text,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  constraint email_notifications_product_reminder_unique
    unique (product_id, reminder_type)
);

create index products_user_id_idx on public.products (user_id);
create index products_expires_at_idx on public.products (expires_at);
create index email_notifications_user_id_idx on public.email_notifications (user_id);
create index email_notifications_product_id_idx on public.email_notifications (product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.email_notifications enable row level security;

create policy "products_insert_own"
  on public.products for insert to authenticated
  with check (auth.uid() = user_id);

create policy "products_select_own"
  on public.products for select to authenticated
  using (auth.uid() = user_id);

create policy "products_update_own"
  on public.products for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "products_delete_own"
  on public.products for delete to authenticated
  using (auth.uid() = user_id);

create policy "email_notifications_select_own"
  on public.email_notifications for select to authenticated
  using (auth.uid() = user_id);
