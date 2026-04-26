import React, { useState } from 'react';
import { assetUrl } from '../hooks/useImageFallback';

const SafeImg = ({ src, fallbackSrc, alt, className, loading = 'lazy', ...rest }) => {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? fallbackSrc : assetUrl(src)}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
};

export default SafeImg;
