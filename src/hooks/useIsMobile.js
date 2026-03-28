import { useMediaQuery } from 'react-responsive';

/**
 * useIsMobile - Custom hook to detect mobile viewport
 * Returns true if viewport width is 767px or less
 * 
 * Usage:
 *   const isMobile = useIsMobile();
 *   return isMobile ? <MobileLayout /> : <DesktopLayout />;
 */
const useIsMobile = () => {
  return useMediaQuery({ maxWidth: 767 });
};

export default useIsMobile;
