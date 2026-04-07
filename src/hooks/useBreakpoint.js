import { useMediaQuery } from 'react-responsive';

/**
 * useBreakpoint - Generalized hook for responsive breakpoints
 * Returns device type and individual boolean flags for mobile, tablet, desktop
 *
 * Breakpoints:
 *   Mobile: < 768px
 *   Tablet: 768px - 1024px
 *   Desktop: 1024px - 1440px
 *   Wide: > 1440px
 *
 * Usage:
 *   const { isMobile, isTablet, isDesktop, isWide, deviceType } = useBreakpoint();
 *   return isTablet ? <TabletLayout /> : isMobile ? <Mobile /> : <Desktop />;
 */
const useBreakpoint = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025, maxWidth: 1440 });
  const isWide = useMediaQuery({ minWidth: 1441 });

  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';
  else if (isWide) deviceType = 'wide';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    deviceType,
  };
};

export { useBreakpoint };
