import { useState, useEffect } from 'react';

const useModal = () => {
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    document.body.style.overflow = modalData ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalData]);

  useEffect(() => {
    if (!modalData) return;
    const onKey = (e) => { if (e.key === 'Escape') setModalData(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalData]);

  return { modalData, setModalData };
};

export default useModal;
