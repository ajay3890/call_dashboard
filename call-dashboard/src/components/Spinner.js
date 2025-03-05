// src/components/Spinner.js

import React from "react";

const Spinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
