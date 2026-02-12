-- 1) Table profil utilisateur (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- 2) Table annonces
create table if not exists public.listings (
  id bigint generated always as identity primary key,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  category text not null check (category in ('Féminisées', 'Regular', 'Auto', 'Packs')),
  image_url text not null,
  created_at timestamptz not null default now()
);

-- 3) Table messages (messagerie entre utilisateurs)
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.messages enable row level security;

-- Policies profils
create policy if not exists "Profiles are readable"
  on public.profiles for select using (true);
create policy if not exists "User can upsert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "User can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Policies annonces
create policy if not exists "Listings are readable"
  on public.listings for select using (true);
create policy if not exists "Authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);
create policy if not exists "Owner can update listing"
  on public.listings for update using (auth.uid() = seller_id);
create policy if not exists "Owner can delete listing"
  on public.listings for delete using (auth.uid() = seller_id);

-- Policies messages
create policy if not exists "Participants can read messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy if not exists "Authenticated users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Indexes
create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists messages_listing_id_idx on public.messages(listing_id);
create index if not exists messages_receiver_id_idx on public.messages(receiver_id, created_at desc);
