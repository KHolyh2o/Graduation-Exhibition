// 팀 작품 9팀 (창업캡스톤 = U300 = 한이음). csv_data/teamProjects.csv 에서 생성 (npm run csv:teamProjects).
// 팀프로젝트 탭에는 하위 카테고리가 없다 (ALL 하나). group 값은 출처 표시용.
// 팀 작품은 작품명 없이 teamName 만 쓴다 (title 은 비워 둠). 서비스 소개 문구는 description.
// teamImage: 팀 단체 프로필 사진(배경 제거 webp). 작품 상세 왼쪽에 표시된다.
// members: 팀원 배열. role 은 팀에서 맡은 역할(전공 직군이 아님).
//
// 📌 이미지 파일 위치: public/images/projects/썸네일.jpg
//                       public/images/projects/proposals/제안서.jpg
// 📌 YouTube: https://www.youtube.com/watch?v=영상ID 형식으로 입력

export const teamProjects = [
  {
    id: 't-u300-01', tab: 'team', group: 'u300',
    teamName: '이음', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-01.webp',
    description: '인공지능 발달장애 청소년 지원 메타버스 서비스',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-01.webp'],
    teamImage: '/images/teams/t-u300-01.webp',
    contact: { email: '' },
    members: [
      { name: '한지연', role: '팀장/총괄', studentId: '202311198' },
      { name: '박다인', role: '디자인/개발', studentId: '202311153' },
      { name: '심규현', role: '영상', studentId: '202110786' },
      { name: '최명근', role: '기획', studentId: '202111492' }
    ],
  },
  {
    id: 't-u300-02', tab: 'team', group: 'u300',
    teamName: '프릭', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-02.webp',
    description: '지적 발달친화형 경로 코딩 학습 서비스 RoboLogic',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-02.webp'],
    teamImage: '/images/teams/t-u300-02.webp',
    contact: { email: '' },
    members: [
      { name: '변재영', role: '팀장/기획', studentId: '202311159' },
      { name: '김성수', role: '개발', studentId: '202210246' },
      { name: '이재상', role: '기획', studentId: '202111122' },
      { name: '한태희', role: '영상/제작', studentId: '202311199' },
      { name: 'Asadbek', role: '디자인/제작', studentId: '202211755' }
    ],
  },
  {
    id: 't-u300-03', tab: 'team', group: 'u300',
    teamName: '프리존', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-03.webp',
    description: '새터민의 초기정착 지원을 위한 중고거래 체험 XR 시뮬레이터',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-03.webp'],
    teamImage: '/images/teams/t-u300-03.webp',
    contact: { email: '' },
    members: [
      { name: '유성원', role: '팀장/개발', studentId: '202010966' },
      { name: '강태구', role: '모델링', studentId: '202110030' },
      { name: '김성민', role: '기획', studentId: '202110206' },
      { name: '이종원', role: '모델링', studentId: '202311179' },
      { name: '조찬혁', role: '디자인', studentId: '202111439' }
    ],
  },
  {
    id: 't-u300-04', tab: 'team', group: 'u300',
    teamName: '파동', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-04.webp',
    description: '은둔청년을 위한 XR 리커넥트 서비스',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-04.webp'],
    teamImage: '/images/teams/t-u300-04.webp',
    contact: { email: '' },
    members: [
      { name: '박희원', role: '팀장/기획', studentId: '202311158' },
      { name: '신현아', role: '개발', studentId: '202311164' },
      { name: '김가영', role: '디자인', studentId: '202311138' },
      { name: '박소희', role: '영상', studentId: '202311155' }
    ],
  },
  {
    id: 't-u300-05', tab: 'team', group: 'u300',
    teamName: '미라클', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-05.webp',
    description: '청각장애인을 위한 AI 수어학습 플랫폼 이:음',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-05.webp'],
    teamImage: '/images/teams/t-u300-05.webp',
    contact: { email: '' },
    members: [
      { name: '박주원', role: '팀장/개발', studentId: '202110598' },
      { name: '박재민', role: '개발/디자인', studentId: '202110584' },
      { name: '육근원', role: '기획/개발', studentId: '202311171' },
      { name: '윤예원', role: '기획/제작', studentId: '202311173' },
      { name: '이세현', role: '디자인/제작', studentId: '202111042' }
    ],
  },
  {
    id: 't-u300-06', tab: 'team', group: 'u300',
    teamName: '원피스', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-06.webp',
    description: '새터민을 위한 메타버스 키오스크 AI 비서 서비스',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-06.webp'],
    teamImage: '/images/teams/t-u300-06.webp',
    contact: { email: '' },
    members: [
      { name: '이경현', role: '팀장/기획', studentId: '202110979' },
      { name: '변대섭', role: '개발', studentId: '202110667' },
      { name: '신권철', role: '디자인', studentId: '202110748' },
      { name: '신상호', role: '기획', studentId: '202110753' },
      { name: '연수현', role: '디자인', studentId: '202311168' }
    ],
  },
  {
    id: 't-u300-07', tab: 'team', group: 'u300',
    teamName: '세이프가드', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-07.webp',
    description: '치매 환자 실종 대응 골든타임 훈련 시뮬레이션',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-07.webp'],
    teamImage: '/images/teams/t-u300-07.webp',
    contact: { email: '' },
    members: [
      { name: '이서영', role: '팀장/기획/개발', studentId: '202311177' },
      { name: '우나경', role: '3D 모델링', studentId: '202210950' },
      { name: '이지은', role: '3D 모델링', studentId: '202211227' },
      { name: '안세연', role: '영상&디자인', studentId: '202311165' },
      { name: '최지희', role: '영상&디자인', studentId: '202311196' }
    ],
  },
  {
    id: 't-u300-08', tab: 'team', group: 'u300',
    teamName: '어벤져스', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-08.webp',
    description: '독거노인을 위한 반려 인공지능 메타버스 서비스',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-08.webp'],
    teamImage: '/images/teams/t-u300-08.webp',
    contact: { email: '' },
    members: [
      { name: '최준영', role: '팀장/개발', studentId: '202011639' },
      { name: '정소희', role: '모델링', studentId: '202211414' },
      { name: '유세연', role: '퍼블리싱', studentId: '202311170' },
      { name: '장초빈', role: '디자인', studentId: '202311186' },
      { name: '채미영', role: '영상', studentId: '202311189' }
    ],
  },
  {
    id: 't-u300-09', tab: 'team', group: 'u300',
    teamName: '메모리케어', title: '',
    thumbnail: '/images/projects/thumbnails/t-u300-09.webp',
    description: '치매 환자를 위한 AI 동반자 서비스',
    videoUrl: '',
    proposalImages: ['/images/projects/proposals/t-u300-09.webp'],
    teamImage: '/images/teams/t-u300-09.webp',
    contact: { email: '' },
    members: [
      { name: '김지현', role: '팀장/총괄제작', studentId: '202311148' },
      { name: '김남준', role: '영상', studentId: '202110120' },
      { name: '박주원', role: 'Unity', studentId: '202110598' },
      { name: '김성수', role: '개발', studentId: '202210246' }
    ],
  },
];
