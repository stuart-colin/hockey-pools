import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './History.css';

const PLAY_INTERVAL_MS = 600;

const HistoryScrubber = ({ dates, value, onChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return undefined;
    intervalRef.current = setInterval(() => {
      onChange((prev) => {
        const next = prev + 1;
        if (next >= dates.length) {
          setIsPlaying(false);
          return dates.length - 1;
        }
        return next;
      });
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, dates.length, onChange]);

  // If we hit the end while playing, automatically stop.
  useEffect(() => {
    if (isPlaying && value >= dates.length - 1) {
      setIsPlaying(false);
    }
  }, [value, dates.length, isPlaying]);

  if (!dates.length) {
    return (
      <div className='history-scrubber history-scrubber--empty'>
        No history yet
      </div>
    );
  }

  const startLabel = dates[0];
  const endLabel = dates[dates.length - 1];
  const currentLabel = dates[value] || endLabel;

  const isAtStart = value === 0;
  const isAtEnd = value === dates.length - 1;

  const goToStart = () => {
    setIsPlaying(false);
    onChange(0);
  };
  const stepBackOne = () => {
    setIsPlaying(false);
    onChange(Math.max(0, value - 1));
  };
  const togglePlay = () => {
    if (value >= dates.length - 1) onChange(0);
    setIsPlaying((p) => !p);
  };
  const stepForwardOne = () => {
    setIsPlaying(false);
    onChange(Math.min(dates.length - 1, value + 1));
  };
  const goToEnd = () => {
    setIsPlaying(false);
    onChange(dates.length - 1);
  };

  return (
    <div className='history-scrubber'>
      <div className='history-scrubber__controls'>
        <Button.Group basic size='small'>
          <Button
            icon
            aria-label='Jump to first day'
            onClick={goToStart}
            disabled={isAtStart}
          >
            <Icon name='fast backward' />
          </Button>
          <Button
            icon
            aria-label='Step back one day'
            onClick={stepBackOne}
            disabled={isAtStart}
          >
            <Icon name='step backward' />
          </Button>
          <Button
            icon
            aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
            onClick={togglePlay}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} />
          </Button>
          <Button
            icon
            aria-label='Step forward one day'
            onClick={stepForwardOne}
            disabled={isAtEnd}
          >
            <Icon name='step forward' />
          </Button>
          <Button
            icon
            aria-label='Jump to latest day'
            onClick={goToEnd}
            disabled={isAtEnd}
          >
            <Icon name='fast forward' />
          </Button>
        </Button.Group>
        <span className='history-scrubber__current'>{currentLabel}</span>
      </div>
      <input
        type='range'
        className='history-scrubber__range'
        min={0}
        max={dates.length - 1}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label='Scrub through pool history'
      />
      <div className='history-scrubber__bounds'>
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
};

export default HistoryScrubber;
