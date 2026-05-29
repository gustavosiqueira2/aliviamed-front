import { useEffect, useState } from 'react';

export const useWidthBreakpoint = (width: number): boolean => {
  const [isGreater, setIsGreater] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsGreater(window.innerWidth < width);

    checkWidth();

    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [width]);

  return isGreater;
};
