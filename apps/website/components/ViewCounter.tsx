'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    // Increment view count in the background
    fetch(`/api/increment-view/${slug}`, {
      method: 'POST',
    }).catch((error) => {
      console.error('Failed to increment view count:', error);
    });
  }, [slug]);

  return null; // This component doesn't render anything
}
