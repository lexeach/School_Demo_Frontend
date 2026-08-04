import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { setLicense } from '@/slice/licenseSlice';

const CloseableAlert = ({ data }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isExpired = useSelector((state: RootState) => state.license.isExpired);
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hide-valid-alert', true);
    dispatch(setLicense(false));
  };
  return (
    (isExpired || isVisible) && (
      <div
        className="bg-yellow-100 border-l-4 mt-5 mx-6 border-yellow-500 text-yellow-700 p-4 mb-4 flex justify-between items-center"
        role="alert"
      >
        <p className="font-bold">{data?.status}</p>
        <span className="block sm:inline ml-4">{data?.message} </span>
        <button
          onClick={handleClose}
          className="text-yellow-700 hover:text-yellow-900 ml-4"
        >
          &times;
        </button>
      </div>
    )
  );
};

export default CloseableAlert;
