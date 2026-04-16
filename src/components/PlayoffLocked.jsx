import React from 'react';
import { Icon, Message, Segment } from 'semantic-ui-react';

import usePlayoffLock from '../hooks/usePlayoffLock';

const wrapperStyle = {
  margin: '20px',
  padding: '20px',
  textAlign: 'center',
};

const lockedPageLabels = {
  standings: 'Standings',
  insights: 'Insights',
  'player-details': 'Player Details',
  'team-details': 'Team Details',
};

const formatTargetDate = (date) =>
  date.toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

const PlayoffLocked = ({ page }) => {
  const { targetDate } = usePlayoffLock();
  const label = lockedPageLabels[page] || 'This page';

  return (
    <Segment style={wrapperStyle}>
      <Message icon info>
        <Icon name='lock' />
        <Message.Content>
          <Message.Header>{label} unlocks at puck drop</Message.Header>
          <p>
            To keep things fair, rosters and pool-wide stats are hidden until the
            first playoff game starts. Check back on{' '}
            <strong>{formatTargetDate(targetDate)}</strong>.
          </p>
          <p>
            In the meantime, head to <strong>Team Builder</strong> to pick your
            squad.
          </p>
        </Message.Content>
      </Message>
    </Segment>
  );
};

export default PlayoffLocked;
