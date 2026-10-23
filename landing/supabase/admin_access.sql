-- 랜딩 페이지 signups 접근 제어
-- 방문자(anon): 신청서 제출(insert)과 신청자 수 조회(signup_count)만 가능
-- 관리자: Supabase Auth로 로그인하고 admin_users에 등록된 계정만 전체 조회 가능

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admin_users enable row level security;
-- admin_users에는 정책을 두지 않는다: 대시보드(SQL Editor)에서만 관리

alter table public.signups enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'signups' loop
    execute format('drop policy %I on public.signups', p.policyname);
  end loop;
end $$;

create policy "anyone can sign up" on public.signups
  for insert to anon, authenticated
  with check (true);

create policy "admins can read signups" on public.signups
  for select to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create or replace function public.signup_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$ select count(*) from public.signups $$;

revoke all on function public.signup_count() from public;
grant execute on function public.signup_count() to anon, authenticated;
