import React from 'react';

const ErrorDisplay = ({ error }) => (
  <div className="text-red-600 whitespace-pre-wrap">
    <strong>Error:</strong>
    <br />
    {error}
  </div>
);

export default ErrorDisplay;