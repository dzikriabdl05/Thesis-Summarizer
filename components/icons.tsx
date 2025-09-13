import React from 'react';

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.993.142" />
    <path d="M18.63 8.37a3 3 0 1 0-5.26 1.48" />
    <path d="M13.25 14.5a3 3 0 1 0-4.5 2.5" />
    <path d="M12 19.5a3 3 0 1 0 5.993-.142" />
    <path d="M6.007 5.142A3 3 0 1 0 5 8.5" />
    <path d="M18.993 19.358a3 3 0 1 0 .007-5.717" />
    <path d="M12 5a3 3 0 1 0-2.24 5.142" />
    <path d="M17 14.5a3 3 0 1 0-5.993.142" />
    <path d="M12 12v0" />
    <path d="M12 12a3 3 0 1 0-3.75-2.5" />
    <path d="M15.75 14.5a3 3 0 1 0-3.75-2.5" />
    <path d="M12 12a3 3 0 1 0 3.75 2.5" />
    <path d="M8.25 14.5a3 3 0 1 0 3.75 2.5" />
  </svg>
);


export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const LaptopPaperIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l4 4v10a2 2 0 0 1-2 2Z" />
    <path d="M8 3v4h4" />
    <path d="M18 21V9a2 2 0 0 0-2-2h-1" />
  </svg>
);
