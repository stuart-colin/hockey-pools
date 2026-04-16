import { useEffect, useMemo, useState } from 'react';

import { APP_CONFIG } from '../config/appConfig';

const calculateTimeLeft = (targetMs) => {
  const difference = targetMs - Date.now();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

// Shared hook for gating pre-playoff features and driving the countdown UI.
// `hasStarted` is the single source of truth for "puck has dropped" — use it
// to hide Standings/Insights/etc. pre-puck-drop, and to disable roster
// submission post-puck-drop.
const usePlayoffLock = () => {
  const targetDate = useMemo(
    () => new Date(APP_CONFIG.playoffStartUTC),
    []
  );
  const targetMs = targetDate.getTime();

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetMs));

  useEffect(() => {
    if (timeLeft == null) {
      return undefined;
    }
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetMs));
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs, timeLeft]);

  const hasStarted = timeLeft == null;

  return { hasStarted, targetDate, timeLeft };
};

export default usePlayoffLock;
