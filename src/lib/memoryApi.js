// MEMORY 응원 메시지 저장소. Supabase REST(PostgREST)를 fetch 로 직접 호출한다 (별도 패키지 없음).
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 없으면 이 브라우저(localStorage)에만 저장하는 미리보기 모드.
// supabase/memory.sql 로 테이블을 만든 뒤 .env 에 값을 넣는다.
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TABLE = 'memory_messages';
const STORAGE_KEY = 'graduation-memory-2026';
const LIMIT = 200;

export const isShared = Boolean(URL && KEY);

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const readLocal = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadMessages = async () => {
  if (!isShared) return readLocal();
  const res = await fetch(
    `${URL}/rest/v1/${TABLE}?select=id,sender_name,message,color,created_at&order=created_at.desc&limit=${LIMIT}`,
    { headers },
  );
  if (!res.ok) throw new Error(`load ${res.status}`);
  return res.json();
};

export const addMessage = async ({ sender_name, message, color }) => {
  if (!isShared) {
    const next = [
      { id: Date.now(), sender_name, message, color, created_at: new Date().toISOString() },
      ...readLocal(),
    ].slice(0, LIMIT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return;
  }
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ sender_name, message, color }),
  });
  if (!res.ok) throw new Error(`insert ${res.status}`);
};
