// 졸업생 40명 프로필.
// tab: projectTabs.js의 탭 id와 일치 ('multimedia' | 'video' | 'team')
// role: 멀티미디어/영상미디어는 roles[].id, 팀은 groups[].id
// studentId는 projects.js / teamProjects.js와의 연결 키

export const graduates = [
  // ── 멀티미디어 · Product Manager (10명) ──
  { id: 'g-01', studentId: '2022001001', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-01.jpg' },
  { id: 'g-02', studentId: '2022001002', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-02.jpg' },
  { id: 'g-03', studentId: '2022001003', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-03.jpg' },
  { id: 'g-04', studentId: '2022001004', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-04.jpg' },
  { id: 'g-05', studentId: '2022001005', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-05.jpg' },
  { id: 'g-06', studentId: '2022001006', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-06.jpg' },
  { id: 'g-07', studentId: '2022001007', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-07.jpg' },
  { id: 'g-08', studentId: '2022001008', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-08.jpg' },
  { id: 'g-09', studentId: '2022001009', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-09.jpg' },
  { id: 'g-10', studentId: '2022001010', name: '이름 입력', tab: 'multimedia', role: 'pm',     profileImage: '/images/graduates/g-10.jpg' },

  // ── 멀티미디어 · Developer (10명) ──
  { id: 'g-11', studentId: '2022001011', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-11.jpg' },
  { id: 'g-12', studentId: '2022001012', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-12.jpg' },
  { id: 'g-13', studentId: '2022001013', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-13.jpg' },
  { id: 'g-14', studentId: '2022001014', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-14.jpg' },
  { id: 'g-15', studentId: '2022001015', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-15.jpg' },
  { id: 'g-16', studentId: '2022001016', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-16.jpg' },
  { id: 'g-17', studentId: '2022001017', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-17.jpg' },
  { id: 'g-18', studentId: '2022001018', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-18.jpg' },
  { id: 'g-19', studentId: '2022001019', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-19.jpg' },
  { id: 'g-20', studentId: '2022001020', name: '이름 입력', tab: 'multimedia', role: 'dev',    profileImage: '/images/graduates/g-20.jpg' },

  // ── 멀티미디어 · Designer (10명) ──
  { id: 'g-21', studentId: '2022001021', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-21.jpg' },
  { id: 'g-22', studentId: '2022001022', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-22.jpg' },
  { id: 'g-23', studentId: '2022001023', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-23.jpg' },
  { id: 'g-24', studentId: '2022001024', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-24.jpg' },
  { id: 'g-25', studentId: '2022001025', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-25.jpg' },
  { id: 'g-26', studentId: '2022001026', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-26.jpg' },
  { id: 'g-27', studentId: '2022001027', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-27.jpg' },
  { id: 'g-28', studentId: '2022001028', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-28.jpg' },
  { id: 'g-29', studentId: '2022001029', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-29.jpg' },
  { id: 'g-30', studentId: '2022001030', name: '이름 입력', tab: 'multimedia', role: 'design', profileImage: '/images/graduates/g-30.jpg' },

  // ── 영상미디어 (10명) ──
  { id: 'g-31', studentId: '2022002001', name: '이름 입력', tab: 'video',      role: '2d',     profileImage: '/images/graduates/g-31.jpg' },
  { id: 'g-32', studentId: '2022002002', name: '이름 입력', tab: 'video',      role: '2d',     profileImage: '/images/graduates/g-32.jpg' },
  { id: 'g-33', studentId: '2022002003', name: '이름 입력', tab: 'video',      role: '3d',     profileImage: '/images/graduates/g-33.jpg' },
  { id: 'g-34', studentId: '2022002004', name: '이름 입력', tab: 'video',      role: '3d',     profileImage: '/images/graduates/g-34.jpg' },
  { id: 'g-35', studentId: '2022002005', name: '이름 입력', tab: 'video',      role: '3d',     profileImage: '/images/graduates/g-35.jpg' },
  { id: 'g-36', studentId: '2022002006', name: '이름 입력', tab: 'video',      role: 'ai',     profileImage: '/images/graduates/g-36.jpg' },
  { id: 'g-37', studentId: '2022002007', name: '이름 입력', tab: 'video',      role: 'ai',     profileImage: '/images/graduates/g-37.jpg' },

  // ── 팀프로젝트 (3명 · 대표 리드만 graduates에 등록) ──
  { id: 'g-38', studentId: '2022003001', name: '이름 입력', tab: 'team',       role: 'u300',   profileImage: '/images/graduates/g-38.jpg' },
  { id: 'g-39', studentId: '2022003002', name: '이름 입력', tab: 'team',       role: 'hanium', profileImage: '/images/graduates/g-39.jpg' },
  { id: 'g-40', studentId: '2022003003', name: '이름 입력', tab: 'team',       role: 'game',   profileImage: '/images/graduates/g-40.jpg' },
];

// studentId 기준 빠른 조회용 맵 (ProjectPage에서 작품-학생 이름 연결에 사용)
export const graduateByStudentId = Object.fromEntries(
  graduates.map((g) => [g.studentId, g])
);
