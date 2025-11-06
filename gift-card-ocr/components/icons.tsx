import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: 'upload' | 'copy' | 'check' | 'trash' | 'card' | 'bolt';
}

export const Icon: React.FC<IconProps> = ({ icon, className, ...props }) => {
  const baseClasses = "w-6 h-6";
  const finalClassName = `${baseClasses} ${className || ''}`;

  switch (icon) {
    case 'upload':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case 'copy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'check':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        );
    case 'trash':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case 'card':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        );
    case 'bolt':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className={finalClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        );
  }
};
