import React from 'react';

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {children}
    </div>
  );
};

export default WebsiteLayout;
