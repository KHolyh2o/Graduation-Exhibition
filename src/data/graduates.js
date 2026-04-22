export const TOTAL = 40;

export const graduates = Array.from({ length: TOTAL }, (_, i) => ({
  num:     String(i + 1).padStart(2, '0'),
  name:    `졸업생 ${i + 1}`,
  major:   '미디어콘텐츠학부 · 2026년 졸업',
  info:    `학번: 2022XXXXX  |  지도 교수: ○○○ 교수님  |  연락처: 010-XXXX-XXXX`,
  work:    `작품 제목: [작품명 입력]  |  장르: 영상 / 그래픽 / 웹 등\n작품에 대한 간략한 설명이 이곳에 표시됩니다. 졸업생의 작품 의도, 사용 기술, 완성도 등을 소개합니다.`,
  comment: `4년간의 학교생활을 마치며 느낀 소감과 감사 인사를 전합니다.\n함께해 준 동기들, 지도해 주신 교수님들, 항상 응원해 주신 가족에게 감사드립니다.`,
}));
