import React, { useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { graduates } from '../data/graduates';
import SafeImg from '../components/SafeImg';
import GraduateModal from '../components/GraduateModal';
import { FALLBACK } from '../hooks/useImageFallback';
import './StudentPage.css';

const FILTERS = [
  { id: 'all',        label: '전체' },
  { id: 'multimedia', label: '멀티미디어' },
  { id: 'video',      label: '영상미디어' },
  { id: 'committee',  label: '졸업전시위원회' },
];

const matchFilter = (g, filter) => {
  if (filter === 'all') return true;
  if (filter === 'committee') return g.committee === true;
  return g.tab === filter;
};

const StudentPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const lastTriggerRef = useRef(null);

  const list = useMemo(() => graduates.filter((g) => matchFilter(g, filter)), [filter]);

  // ?student=<studentId> 로 팝업 상태를 URL과 동기화
  const selectedId = searchParams.get('student');
  const selected = useMemo(
    () => graduates.find((g) => g.studentId === selectedId) ?? null,
    [selectedId]
  );

  const openModal = (g, trigger) => {
    lastTriggerRef.current = trigger;
    setSearchParams({ student: g.studentId });
  };

  const closeModal = () => {
    setSearchParams({}, { replace: true });
    const trigger = lastTriggerRef.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    lastTriggerRef.current = null;
  };

  return (
    <div className="student-page">
      <main id="top">
        <section className="page-title">
          <h1>Profile</h1>
          <p>2026 Seowon University Graduates</p>
          <span>{graduates.length} People</span>
        </section>

        <section className="portfolio-section">
          <div className="category-tabs" role="tablist" aria-label="학생 분류">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`tab${filter === f.id ? ' active' : ''}`}
                id={`tab-${f.id}`}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="student-panel" role="tabpanel" aria-labelledby={`tab-${filter}`}>
            <div className="student-grid">
              {list.map((g) => (
                <button
                  key={g.studentId}
                  type="button"
                  className="student-card"
                  aria-label={`${g.name} 상세 소개 열기`}
                  onClick={(e) => openModal(g, e.currentTarget)}
                >
                  <div className="student-photo">
                    {g.profileImage ? (
                      <SafeImg src={g.profileImage} fallbackSrc={FALLBACK.avatar} alt={`${g.name} 프로필`} />
                    ) : (
                      <div className="photo-placeholder" />
                    )}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{g.name}</h3>
                    <p className="student-english">{g.englishName}</p>
                  </div>
                </button>
              ))}
            </div>

            {list.length === 0 && <p className="empty-state">검색 결과가 없습니다.</p>}
          </div>
        </section>
      </main>


      {selected && <GraduateModal student={selected} onClose={closeModal} />}
    </div>
  );
};

export default StudentPage;
