import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
    </div>
  );
};

export default Loader;
