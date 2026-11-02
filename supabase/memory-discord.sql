-- 새 MEMORY 글이 올라오면 Discord 채널로 알림을 보낸다. memory.sql 실행 후 한 번 실행한다.
-- 아래 'DISCORD_WEBHOOK_URL' 을 Discord 채널 설정 > 연동 > 웹후크 URL 로 바꾼 뒤 실행할 것.
-- (이 파일의 URL 은 저장소에 커밋하지 말고, 값을 넣은 채로는 SQL Editor 에만 붙여넣는다.)

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_memory_discord()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url     := 'DISCORD_WEBHOOK_URL',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := jsonb_build_object(
      'content', format(E'새 MEMORY 글 #%s (%s)\n**%s**: %s', new.id, new.color, new.sender_name, new.message),
      'allowed_mentions', jsonb_build_object('parse', jsonb_build_array())
    )
  );
  return new;
end;
$$;

drop trigger if exists memory_discord_notify on public.memory_messages;
create trigger memory_discord_notify
  after insert on public.memory_messages
  for each row execute function public.notify_memory_discord();
