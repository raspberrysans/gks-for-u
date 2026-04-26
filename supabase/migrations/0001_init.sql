-- gks-for-u initial schema
-- Run with: supabase db push  (after `supabase init` and `supabase link`)

create extension if not exists "uuid-ossp";

create table public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text,
  country_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.gks_track as enum (
  'embassy-general',
  'embassy-overseas-korean',
  'embassy-irts',
  'university-uic',
  'university-rgks',
  'associate'
);

create type public.application_status as enum ('draft', 'ready', 'exported');

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  cycle int not null default 2026,
  track public.gks_track,
  status public.application_status not null default 'draft',
  rubric_total int,
  rubric_max int,
  competitiveness_tier text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_idx on public.applications(user_id);

create table public.application_form_data (
  application_id uuid not null references public.applications on delete cascade,
  section text not null,
  data jsonb not null default '{}'::jsonb,
  version int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (application_id, section)
);

create table public.essays (
  application_id uuid not null references public.applications on delete cascade,
  kind text not null check (kind in ('personal_statement','study_plan','recommendation')),
  body text not null default '',
  ai_feedback jsonb,
  updated_at timestamptz not null default now(),
  primary key (application_id, kind)
);

create table public.score_snapshots (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references public.applications on delete cascade,
  rubric jsonb not null,
  competitiveness jsonb not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.application_form_data enable row level security;
alter table public.essays enable row level security;
alter table public.score_snapshots enable row level security;

create policy "profiles are self-readable" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles are self-writable" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "applications are self-readable" on public.applications
  for select using (auth.uid() = user_id);
create policy "applications are self-writable" on public.applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "form data follows application owner" on public.application_form_data
  for all using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  );

create policy "essays follow application owner" on public.essays
  for all using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  );

create policy "score snapshots follow application owner" on public.score_snapshots
  for all using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  );

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger applications_updated before update on public.applications
  for each row execute function public.set_updated_at();
create trigger form_data_updated before update on public.application_form_data
  for each row execute function public.set_updated_at();
create trigger essays_updated before update on public.essays
  for each row execute function public.set_updated_at();
