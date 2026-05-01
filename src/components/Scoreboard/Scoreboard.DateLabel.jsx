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

const dateLabelRootStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4em',
};

const dateNavIconStyle = {
  cursor: 'pointer',
  margin: 7,
};

const dateNavIconDisabledStyle = {
  ...dateNavIconStyle,
  cursor: 'not-allowed',
  opacity: 0.4,
};

const resetDateIconStyle = {
  cursor: 'pointer',
  margin: '0.5em',
};

const DateLabel = ({
  date,
  isOffDate,
  canGoNext = true,
  canGoPrev = true,
  onNext,
  onPrev,
  onReset,
}) => (
  <Label
    color='blue'
    style={dateLabelRootStyle}
  >
    <Icon
      name='chevron left'
      onClick={(e) => {
        e.stopPropagation();
        if (canGoPrev) onPrev();
      }}
      style={canGoPrev ? dateNavIconStyle : dateNavIconDisabledStyle}
      title='Previous day'
    />
    {date ? prettyDate(date) : 'No games scheduled'}
    <Icon
      name='chevron right'
      onClick={(e) => {
        e.stopPropagation();
        if (canGoNext) onNext();
      }}
      style={canGoNext ? dateNavIconStyle : dateNavIconDisabledStyle}
      title='Next day'
    />
    {isOffDate && (
      <Icon
        name='undo'
        onClick={(e) => {
          e.stopPropagation();
          onReset();
        }}
        style={resetDateIconStyle}
        title='Back to today'
      />
    )}
  </Label>
);

export default DateLabel;
