import React from 'react';

const RunButton = ({ onClick }) => (
  <button
    className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
    onClick={onClick}
  >
    Run Code
  </button>
);

export default RunButton;