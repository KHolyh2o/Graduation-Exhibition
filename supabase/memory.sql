-- MEMORY 응원 메시지 게시판. Supabase 대시보드 > SQL Editor 에서 한 번 실행한다.

create table if not exists public.memory_messages (
  id          bigint generated always as identity primary key,
  sender_name text        not null default '익명' check (char_length(sender_name) between 1 and 16),
  message     text        not null check (char_length(message) between 1 and 140),
  color       text        not null default 'yellow' check (color in ('red','blue','lime','pink','yellow')),
  created_at  timestamptz not null default now()
);

create index if not exists memory_messages_created_at_idx
  on public.memory_messages (created_at desc);

alter table public.memory_messages enable row level security;

-- 방문자(anon)는 읽기·쓰기만 가능. 수정·삭제는 대시보드(Table Editor)에서만.
revoke all on public.memory_messages from anon, authenticated;
grant select, insert on public.memory_messages to anon;

drop policy if exists "memory read"   on public.memory_messages;
drop policy if exists "memory insert" on public.memory_messages;

create policy "memory read"   on public.memory_messages for select to anon using (true);
create policy "memory insert" on public.memory_messages for insert to anon with check (true);
