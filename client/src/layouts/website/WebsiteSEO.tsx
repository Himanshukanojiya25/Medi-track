import React from 'react';

interface WebsiteSEOProps {
  title: string;
  description?: string;
}

export const WebsiteSEO: React.FC<WebsiteSEOProps> = ({
  title,
  description,
}) => {
  document.title = title;

  if (description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', description);
    }
  }

  return null;
};

export default WebsiteSEO;
