-- Run this in your Supabase SQL editor

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Bookings table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_id text not null,
  date text not null,
  time_slot text not null,
  address text not null,
  notes text,
  price numeric not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc', now())
);

-- Quotes table
create table quotes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  service_id text not null,
  address text not null,
  details text,
  status text default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLS policies
alter table profiles enable row level security;
alter table bookings enable row level security;
alter table quotes enable row level security;

-- Profiles: users can read/write their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Bookings: users can read/write their own
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);

-- Quotes: anyone can insert (guest quote requests)
create policy "Anyone can submit quotes" on quotes for insert with check (true);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
