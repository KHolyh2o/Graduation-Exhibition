import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { graduateByStudentId } from '../data/graduates';
import { TAB_MAP } from '../data/projectTabs';
import { getWorkById, getWorksByStudent, getWorkStudentIds, getWorkTitle, getSubLabel, toEmbedUrl } from '../data/works';
import { FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import './DetailPage.css';

const DetailPage = () => {
  const { id } = useParams();
  const work = getWorkById(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!work) {
    return (
      <div className="detail-page">
        <main className="work-detail-page">
          <Link to="/project" className="work-detail-back">← 돌아가기</Link>
          <p className="detail-not-found">작품을 찾을 수 없습니다. 작품 주소를 확인해 주세요.</p>
        </main>
      </div>
    );
  }

  const isTeam = !!work.members;
  // 공동 작품은 참여 학생 전원을 보여준다
  const students = isTeam ? [] : getWorkStudentIds(work).map((id) => graduateByStudentId[id]).filter(Boolean);
  // 같은 학생(들)의 다른 작품 — 공동 작품이면 참여자 전원의 작품을 합쳐 중복 제거
  const others = isTeam
    ? []
    : [...new Map(
        students.flatMap((s) => getWorksByStudent(s.studentId)).map((w) => [w.id, w])
      ).values()].filter((w) => w.id !== work.id);

  // 팀 작품은 팀원별로 묶어, 각자의 다른 작품으로 바로 이동할 수 있게 한다
  const othersByMember = isTeam
    ? work.members
        .map((m) => ({
          key: m.studentId ?? m.name,
          name: m.name,
          works: getWorksByStudent(m.studentId).filter((w) => w.id !== work.id),
        }))
        .filter((g) => g.works.length > 0)
    : [];

  const proposals = work.proposalImages ?? [];

  return (
    <div className="detail-page">
      <main className="work-detail-page">
        <Link to={`/project?category=${work.tab}`} className="work-detail-back">
          ← 돌아가기
        </Link>

        <div className="work-detail-layout">
          {/* 왼쪽: 학생(팀) 정보 */}
          <aside className="student-sidebar">
            {isTeam ? (
              <>
                <div className="student-profile-photo" />
                <div className="student-name">
                  <strong>{work.teamName}</strong>
                </div>
                <h2 className="student-role">{getSubLabel(work) || TAB_MAP[work.tab].label}</h2>
              </>
            ) : (
              <div className="student-group">
                {students.map((s) => (
                  <div className="student-person" key={s.studentId}>
                    <div className="student-profile-photo">
                      <SafeImg src={s.profileImage} fallbackSrc={FALLBACK.avatar} alt={`${s.name} 프로필 사진`} />
                    </div>
                    <div className="student-name">
                      <strong>{s.name}</strong>
                      <span>{s.englishName}</span>
                    </div>
                    <h2 className="student-role">{s.jobTitle}</h2>
                  </div>
                ))}
              </div>
            )}

            {/* 단독 작품은 그 학생의 소개, 공동 작품은 참여자별 소개, 팀 작품은 작품 설명 */}
            {students.length === 1 && (
              <p className="student-description">{students[0].workIntro}</p>
            )}
            {students.length > 1 && students.map((s) => (
              <p className="student-description" key={s.studentId}>
                <strong>{s.name}</strong> {s.workIntro}
              </p>
            ))}
            {isTeam && work.description && (
              <p className="student-description">{work.description}</p>
            )}

            {isTeam && (
              <ul className="student-members">
                {work.members.map((m, i) => (
                  <li key={i}>{m.name} · {m.role}</li>
                ))}
              </ul>
            )}

            <section className="other-projects">
              <h2>Other Project</h2>
              <div className="other-project-list">
                {(isTeam ? othersByMember.length === 0 : others.length === 0) && (
                  <p className="other-project-empty">등록된 다른 작품이 없습니다.</p>
                )}
                {isTeam
                  ? othersByMember.map((g) => (
                      <div className="other-project-group" key={g.key}>
                        <h3 className="other-project-owner">{g.name}</h3>
                        {g.works.map((w) => (
                          <Link key={w.id} to={`/project/${w.id}`} className="other-project-link">
                            <span>{getWorkTitle(w)}</span>
                            <span className="other-project-arrow" aria-hidden="true">›</span>
                          </Link>
                        ))}
                      </div>
                    ))
                  : others.map((w) => (
                      <Link key={w.id} to={`/project/${w.id}`} className="other-project-link">
                        <span>{getWorkTitle(w)}</span>
                        <span className="other-project-arrow" aria-hidden="true">›</span>
                      </Link>
                    ))}
              </div>
            </section>
          </aside>

          {/* 오른쪽: 작품 콘텐츠 */}
          <article className="detail-work-content">
            <div
              className={`detail-main-media${work.videoUrl ? '' : ' is-empty'}`}
              aria-label="작품 대표 영상"
            >
              {work.videoUrl && (
                <iframe
                  src={toEmbedUrl(work.videoUrl)}
                  title={getWorkTitle(work)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>

            <div
              className={`detail-poster${proposals.length ? ' has-image' : ' is-empty'}`}
              aria-label="작품 상세 이미지"
            >
              {proposals.map((src, i) => (
                <SafeImg key={i} src={src} fallbackSrc={FALLBACK.image} alt={`${getWorkTitle(work)} 상세 이미지 ${i + 1}`} />
              ))}
            </div>
          </article>
        </div>
      </main>

      <button
        type="button"
        className="detail-top-button"
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
};

export default DetailPage;
