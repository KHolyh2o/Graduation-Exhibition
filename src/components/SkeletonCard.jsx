import React from 'react';
import './SkeletonCard.css';

export const SkeletonProjectCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="sk sk-thumb" />
    <div className="sk-body">
      <div className="sk sk-tag" />
      <div className="sk sk-title" />
      <div className="sk sk-line" />
      <div className="sk sk-line sk-line--short" />
    </div>
  </div>
);

export const SkeletonProfileCard = () => (
  <div className="skeleton-profile" aria-hidden="true">
    <div className="sk sk-avatar" />
    <div className="sk sk-name" />
    <div className="sk sk-role" />
  </div>
);

export const EmptyState = ({ message = '표시할 항목이 없습니다.' }) => (
  <div className="empty-state" role="status">
    <p className="empty-state-msg">{message}</p>
  </div>
);
