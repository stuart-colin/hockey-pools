import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

function prettyDate(date) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const DateLabel = ({ date, dateOffset, onNext, onPrev, onReset }) => (
  <Label
    color='blue'
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4em',
    }}
  >
    {/* Disabled until we add a date picker
    <Icon
      name='calendar outline'
      style={{
        margin: '0.5em',
      }}
    /> */}
    <Icon
      name='chevron left'
      onClick={(e) => {
        e.stopPropagation();
        onPrev();
      }}
      style={{
        cursor: 'pointer',
        margin: 7,
      }}
      title='Previous day'
    />
    {date ? prettyDate(date) : 'No games scheduled'}
    <Icon
      name='chevron right'
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
      style={{
        cursor: 'pointer',
        margin: 7,
      }}
      title='Next day'
    />
    {dateOffset !== 0 && (
      <Icon
        name='undo'
        onClick={(e) => {
          e.stopPropagation();
          onReset();
        }}
        style={{
          cursor: 'pointer',
          margin: '0.5em',
        }}
        title='Back to today'
      />
    )}
  </Label>
);

export default DateLabel;
