import React, { useState, useEffect, useRef } from 'react';
import './MemoryPage.css';

// sha_copy/memory.html + js/memory.js 이식.
// 아직 공유 DB(Supabase)가 없어 현재 브라우저(localStorage)에만 저장한다 — 미리보기 모드.
const STORAGE_KEY = 'graduation-memory-2026';
const MAX_MESSAGES = 200;
const MAX_LENGTH = 140;

const COLORS = [
  { id: 'red',    label: '빨강' },
  { id: 'blue',   label: '파랑' },
  { id: 'lime',   label: '연두' },
  { id: 'pink',   label: '분홍' },
  { id: 'yellow', label: '노랑' },
];
const COLOR_IDS = COLORS.map((c) => c.id);
const ANGLES = [-2, 1.5, -1, 2, 0.5, -1.5];

const readMessages = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return { iso: d.toISOString(), text: d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) };
};

const MemoryPage = () => {
  const [messages, setMessages] = useState(readMessages);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('lime');
  const [status, setStatus] = useState('현재는 이 브라우저에만 저장되는 미리보기 모드입니다.');
  const messageRef = useRef(null);

  useEffect(() => {
    document.title = 'MEMORY | 2026 졸업전시회';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) {
      setStatus('메시지를 입력해 주세요.');
      messageRef.current?.focus();
      return;
    }
    const next = [
      {
        id: Date.now(),
        sender_name: name.trim() || '익명',
        message,
        color: COLOR_IDS.includes(color) ? color : 'yellow',
        created_at: new Date().toISOString(),
      },
      ...messages,
    ].slice(0, MAX_MESSAGES);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setStatus('등록에 실패했습니다. 다시 시도해 주세요.');
      return;
    }
    setMessages(next);
    setText('');
    setName('');
    setColor('lime');
    setStatus('응원 메시지가 포스트잇으로 등록됐어요!');
    messageRef.current?.focus();
  };

  return (
    <div className="memory-root">
      <main className="memory-page">
        <section className="memory-hero">
          <p className="memory-eyebrow">2026 GRADUATION EXHIBITION</p>
          <h1>MEMORY</h1>
          <p className="memory-description">
            졸업을 축하하는 마음을 남겨주세요.<br />
            남겨주신 메시지는 포스트잇이 되어 이곳에 기록됩니다.
          </p>
        </section>

        <section className="memory-write-section">
          <div className="memory-section-heading">
            <h2>응원 메시지 남기기</h2>
            <p>마음을 담아 자유롭게 작성해 주세요.</p>
          </div>

          <form className="memory-form" onSubmit={handleSubmit}>
            <div className="memory-form-main">
              <label htmlFor="memory-message">MESSAGE</label>
              <textarea
                id="memory-message"
                ref={messageRef}
                className="memory-message-input"
                name="message"
                placeholder="졸업을 축하하는 메시지를 적어주세요."
                maxLength={MAX_LENGTH}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="memory-form-bottom">
                <input
                  type="text"
                  className="memory-name-input"
                  name="name"
                  maxLength={16}
                  placeholder="이름 또는 별명 (선택)"
                  aria-label="이름 또는 별명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="memory-length">{text.length} / {MAX_LENGTH}</span>
              </div>
            </div>

            <div className="memory-form-side">
              <fieldset className="memory-colors">
                <legend>POST-IT COLOR</legend>
                <div className="memory-color-options">
                  {COLORS.map((c) => (
                    <label key={c.id} className="memory-color-option">
                      <input
                        type="radio"
                        name="color"
                        value={c.id}
                        checked={color === c.id}
                        onChange={() => setColor(c.id)}
                      />
                      <span className={`memory-color-dot ${c.id}`} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="memory-submit">
                포스트잇 붙이기
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>

          <p className="memory-status" role="status" aria-live="polite">{status}</p>
        </section>

        <section className="memory-wall-section">
          <div className="memory-wall-heading">
            <div>
              <p className="memory-wall-eyebrow">WORDS FOR OUR GRADUATES</p>
              <h2>남겨진 마음들</h2>
            </div>
            <p className="memory-total">
              <strong>{messages.length}</strong>
              Messages
            </p>
          </div>

          <div className="memory-board" aria-label="응원 메시지 포스트잇 게시판">
            {messages.map((item, i) => {
              const date = formatDate(item.created_at);
              return (
                <article
                  key={item.id}
                  className="memory-note"
                  data-color={COLOR_IDS.includes(item.color) ? item.color : 'yellow'}
                  style={{ '--note-rotate': `${ANGLES[i % ANGLES.length]}deg` }}
                >
                  <p className="memory-note-message">{item.message}</p>
                  <div className="memory-note-footer">
                    <span className="memory-note-author">{item.sender_name || '익명'}</span>
                    {date && <time dateTime={date.iso}>{date.text}</time>}
                  </div>
                </article>
              );
            })}
          </div>

          {messages.length === 0 && (
            <p className="memory-empty">
              아직 등록된 메시지가 없습니다.<br />
              첫 번째 응원 메시지를 남겨주세요!
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default MemoryPage;
