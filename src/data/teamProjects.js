// 팀 작품 23개.
// group: projectTabs.js 팀 groups[].id ('u300' | 'hanium' | 'game')
// members: 팀원 배열 (수 제한 없음). phone은 공개 동의한 학생만 입력.
//
// 📌 이미지 파일 위치: public/images/projects/썸네일.jpg
//                       public/images/projects/proposals/제안서.jpg
// 📌 YouTube: https://www.youtube.com/watch?v=영상ID 형식으로 입력

const _make = (id, group, memberCount) => ({
  id,
  tab: 'team',
  group,
  teamName: '팀명 입력',
  title: '작품명 입력',
  thumbnail: '',
  description: '작품 설명을 입력하세요.',
  videoUrl: '',
  proposalImages: [],
  contact: { email: 'team@seowon.ac.kr' },
  members: Array.from({ length: memberCount }, (_, i) => ({
    name: `팀원 ${i + 1}`,
    role: '역할 입력',
    studentId: '',
  })),
});

export const teamProjects = [
  // ── U300 (10팀) ──────────────────────────────────────────────────────────
  {
    id: 't-u300-01',
    tab: 'team',
    group: 'u300',
    teamName: '미래로',
    title: '스마트 주차 공유 플랫폼',
    thumbnail: '/images/projects/썸네일.png',
    description:
      '유휴 주차 공간을 공유하는 스마트 주차 플랫폼입니다. ' +
      'IoT 센서로 실시간 주차 현황을 감지하고, 앱에서 예약·결제까지 ' +
      '원스톱으로 처리할 수 있습니다. U300 창업 경진대회 출품작입니다.',
    videoUrl: 'https://www.youtube.com/watch?v=rFjRsWPGZxY',
    proposalImages: [
      '/images/projects/proposals/제안서_1.png',
      '/images/projects/proposals/제안서_2.png',
    ],
    contact: { email: 'miraero@seowon.ac.kr' },
    members: [
      { name: '김민수', role: 'PM / 기획',    studentId: '2022003001' },
      { name: '이지원', role: 'Developer',     studentId: '2022003002' },
      { name: '박소희', role: 'Designer',      studentId: '2022003003' },
      { name: '최현우', role: 'Backend',       studentId: '2022003004' },
    ],
  },
  _make('t-u300-02', 'u300', 3),
  _make('t-u300-03', 'u300', 3),
  _make('t-u300-04', 'u300', 3),
  _make('t-u300-05', 'u300', 3),
  _make('t-u300-06', 'u300', 4),
  _make('t-u300-07', 'u300', 4),
  _make('t-u300-08', 'u300', 4),
  _make('t-u300-09', 'u300', 4),
  _make('t-u300-10', 'u300', 4),

  // ── 한이음 (10팀) ────────────────────────────────────────────────────────
  {
    id: 't-hanium-01',
    tab: 'team',
    group: 'hanium',
    teamName: '실버케어',
    title: 'AI 기반 노인 낙상 감지 스마트 돌봄 시스템',
    thumbnail: '/images/projects/썸네일.png',
    description:
      '카메라 영상을 실시간으로 분석해 낙상을 자동 감지하고 보호자에게 ' +
      '즉시 알림을 전송하는 AI 돌봄 시스템입니다. ' +
      'YOLOv8 포즈 추정 모델을 활용했으며 한이음 ICT 멘토링 프로젝트입니다.',
    videoUrl: 'https://www.youtube.com/watch?v=rFjRsWPGZxY',
    proposalImages: [
      '/images/projects/proposals/제안서_1.png',
      '/images/projects/proposals/제안서_2.png',
    ],
    contact: { email: 'silvercare@seowon.ac.kr' },
    members: [
      { name: '윤준혁', role: 'AI / ML',       studentId: '2022003010' },
      { name: '강다인', role: 'Frontend',       studentId: '2022003011' },
      { name: '임도현', role: 'Backend',        studentId: '2022003012' },
      { name: '한지민', role: 'UX 디자인',      studentId: '2022003013' },
      { name: '오승우', role: 'Hardware / IoT', studentId: '2022003014' },
    ],
  },
  _make('t-hanium-02', 'hanium', 4),
  _make('t-hanium-03', 'hanium', 4),
  _make('t-hanium-04', 'hanium', 4),
  _make('t-hanium-05', 'hanium', 4),
  _make('t-hanium-06', 'hanium', 5),
  _make('t-hanium-07', 'hanium', 5),
  _make('t-hanium-08', 'hanium', 5),
  _make('t-hanium-09', 'hanium', 5),
  _make('t-hanium-10', 'hanium', 5),

  // ── Game 프로젝트 (3팀) ──────────────────────────────────────────────────
  {
    id: 't-game-01',
    tab: 'team',
    group: 'game',
    teamName: '픽셀크루',
    title: '기억의 파편 - 2D 퍼즐 플랫포머 게임',
    thumbnail: '/images/projects/썸네일.png',
    description:
      '기억을 잃은 주인공이 퍼즐을 풀며 과거를 복원하는 2D 플랫포머 게임입니다. ' +
      'Unity로 개발했으며 픽셀아트 스타일의 직접 제작 원화와 ' +
      '오리지널 OST를 포함한 완성형 게임입니다. 스팀 출시를 목표로 제작했습니다.',
    videoUrl: 'https://www.youtube.com/watch?v=rFjRsWPGZxY',
    proposalImages: [
      '/images/projects/proposals/제안서_1.png',
      '/images/projects/proposals/제안서_2.png',
    ],
    contact: { email: 'pixelcrew@seowon.ac.kr' },
    members: [
      { name: '송태양', role: 'Game Developer', studentId: '2022003020' },
      { name: '노아름', role: '아트 / 원화',    studentId: '2022003021' },
      { name: '권민찬', role: '레벨 디자인',    studentId: '2022003022' },
      { name: '류지수', role: 'Sound / OST',    studentId: '2022003023' },
      { name: '배현서', role: 'QA / 기획',      studentId: '2022003024' },
    ],
  },
  _make('t-game-02', 'game', 5),
  _make('t-game-03', 'game', 6),
];
