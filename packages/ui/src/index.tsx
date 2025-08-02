// packages/ui/src/index.tsx
import React from 'react';

export const CodePalButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" {...props}>
    {children}
  </button>
); 