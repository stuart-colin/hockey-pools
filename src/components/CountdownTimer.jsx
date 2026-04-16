import React from 'react';
import { Message } from 'semantic-ui-react';

import usePlayoffLock from '../hooks/usePlayoffLock';

const countdownMessageStyle = {
  textAlign: 'center',
  margin: '10px',
};

// Hide the "rosters locked" message this long after puck drop so it doesn't
// linger forever.
const HIDE_AFTER_MS = 2 * 24 * 60 * 60 * 1000;

const formatSegments = ({ days, hours, minutes, seconds }) => {
  const parts = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return parts.join(', ');
};

const CountdownTimer = () => {
  const { hasStarted, targetDate, timeLeft } = usePlayoffLock();

  if (hasStarted) {
    const elapsed = Date.now() - targetDate.getTime();
    if (elapsed > HIDE_AFTER_MS) {
      return null;
    }
    return (
      <Message color='red' style={countdownMessageStyle}>
        Rosters are locked — the playoffs are underway!
      </Message>
    );
  }

  return (
    <Message color='red' style={countdownMessageStyle}>
      <div className='header'>Puck Drop & Roster Lock 🏒</div>
      <p>{formatSegments(timeLeft)}</p>
    </Message>
  );
};

export default CountdownTimer;
