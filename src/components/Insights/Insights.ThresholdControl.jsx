import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import {
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
  INSIGHT_DESCRIPTIONS,
} from '../../constants/insights';
import './Insights.ThresholdControl.css';

/**
 * ThresholdControl - Interactive threshold adjustment with slider
 * Provides a modern slider-based control for adjusting pick rate thresholds
 */
const ThresholdControl = ({
  threshold,
  setThreshold,
  minThresh,
  maxThresh,
  isHighThreshold = true,
}) => {
  const defaultThresh = isHighThreshold ? DEFAULT_HIGH_THRESHOLD : DEFAULT_LOW_THRESHOLD;
  const description = isHighThreshold
    ? INSIGHT_DESCRIPTIONS.MOST_ADVANTAGEOUS(threshold)
    : INSIGHT_DESCRIPTIONS.LEAST_ADVANTAGEOUS(threshold);
  const isModified = threshold !== defaultThresh;

  return (
    <div className='threshold-control'>

      <input
        type='range'
        min={minThresh}
        max={maxThresh}
        value={threshold}
        onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
        className={`threshold-slider ${isHighThreshold ? 'threshold-slider-high' : 'threshold-slider-low'}`}
      />

      <div className='threshold-bounds'>
        <span className='bound-min'>{minThresh}%</span>
        <span className='bound-max'>{maxThresh}%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
        <p className='threshold-description' style={{ margin: 0 }}>{description}</p>
        <Button
          icon
          size='mini'
          basic
          disabled={!isModified}
          onClick={() => setThreshold(defaultThresh)}
          title='Reset to default'
        >
          <Icon name='undo' />
        </Button>
      </div>

    </div >
  );
};

export default React.memo(ThresholdControl);
