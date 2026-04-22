import React from 'react';

const PageHero = ({ breadcrumb, title, desc, badge }) => (
  <div className="page-hero">
    <div className="container">
      {badge ? (
        <div className="page-hero-inner">
          <div>
            <p className="page-breadcrumb">{breadcrumb}</p>
            <h1 className="page-title">{title}</h1>
            <p className="page-desc">{desc}</p>
          </div>
          {badge}
        </div>
      ) : (
        <>
          <p className="page-breadcrumb">{breadcrumb}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-desc">{desc}</p>
        </>
      )}
    </div>
  </div>
);

export default PageHero;
