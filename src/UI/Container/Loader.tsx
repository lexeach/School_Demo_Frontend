import React from 'react';

const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-transparent">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
    </div>
  );
};

export default Loader;
