import React from 'react';
import NotFoundPage from './NotFoundPage';

// ARCHIVE(과거전시)는 아직 기획 전이다.
// sha_copy 는 존재하지 않는 archive.html 로 연결돼 404 디자인이 나오므로, 같은 화면을 보여 준다.
// 아카이브 페이지가 확정되면 이 파일에 내용을 채운다.
const OthersPage = () => <NotFoundPage />;

export default OthersPage;
