-- MEMORY 응원 메시지 게시판. Supabase 대시보드 > SQL Editor 에서 실행한다.
-- 방문자가 쓴 글은 바로 게시된다. 부적절한 글은 Table Editor 에서 해당 줄을 삭제한다.

create table if not exists public.memory_messages (
  id          bigint generated always as identity primary key,
  sender_name text        not null default '익명' check (char_length(sender_name) between 1 and 16),
  message     text        not null check (char_length(message) between 1 and 140),
  color       text        not null default 'yellow' check (color in ('red','blue','lime','pink','yellow')),
  created_at  timestamptz not null default now()
);

-- 승인 방식을 쓰던 버전에서 올라오는 경우를 위해 (처음 만드는 경우엔 아무 일도 안 한다)
drop index if exists public.memory_messages_approved_idx;
alter table public.memory_messages drop column if exists approved;

create index if not exists memory_messages_created_at_idx
  on public.memory_messages (created_at desc);

alter table public.memory_messages enable row level security;

-- 방문자(anon)는 읽기·쓰기만 가능. 수정·삭제는 대시보드에서만.
revoke all on public.memory_messages from anon, authenticated;
grant select, insert on public.memory_messages to anon;

drop policy if exists "memory read"   on public.memory_messages;
drop policy if exists "memory insert" on public.memory_messages;

create policy "memory read"   on public.memory_messages for select to anon using (true);
create policy "memory insert" on public.memory_messages for insert to anon with check (true);
