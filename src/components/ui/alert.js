// src/components/ui/alert.js
import React from 'react';

export const Alert = ({ variant, className, children }) => (
  <div className={`alert ${variant} ${className}`}>
    {children}
  </div>
);

export const AlertTitle = ({ children }) => <strong>{children}</strong>;

export const AlertDescription = ({ children }) => <p>{children}</p>;
