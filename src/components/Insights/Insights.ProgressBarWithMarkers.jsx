import React from 'react';
import { Popup, Progress } from 'semantic-ui-react';

/**
 * Generic progress bar with tooltipped tick markers.
 *
 * Used by PoolOverview (distribution markers across rosters) and PoolVitality
 * (round-end + at-risk markers on the pool aliveness bars). The component is
 * intentionally thin: callers pass through any Semantic UI <Progress> props
 * via `progressProps` (color, className, percent, value+total, etc.) and a
 * list of marker descriptors to render on top.
 *
 * Markers are absolutely positioned over the bar at `value / total * 100%`.
 * Markers within a `MERGE_TOLERANCE` of each other are grouped into a single
 * tick whose tooltip lists each underlying label so the bar doesn't get
 * visually crowded by near-duplicates.
 */

// Mirrors the visual treatment used by PoolOverview's distribution bars: a
// fixed 24px-high track with markers rendered as 30px tall lines that overhang
// the bar slightly above and below. Both bars across Insights use this same
// pixel rhythm so the marker styling stays consistent.
const PROGRESS_BAR_HEIGHT = 24;
const MARKER_HEIGHT = 30;

const trackContainerStyle = {
  display: 'block',
  height: `${PROGRESS_BAR_HEIGHT}px`,
  position: 'relative',
  width: '100%',
};

const popupColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const markerHitBoxStyle = (leftPercent) => ({
  cursor: 'pointer',
  left: `${leftPercent}%`,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
});

// Exact match for PoolOverview's distribution markers. Variants are
// intentionally removed for now so we can confirm positioning matches the
// existing bars before we layer styles back on.
const markerLineStyle = () => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '2px',
  height: `${MARKER_HEIGHT}px`,
  transition: 'all 0.2s ease',
  width: '6px',
});

// Inline value label rendered to the left of the tick line. Visual styling
// mirrors Semantic UI's on-bar value (bold, small, light) so a tick's value
// reads the same as the leader value would inside the bar. Positioned
// absolutely so it doesn't widen the hit-box (the line stays the only flow
// child, keeping the translateX(-50%) centering accurate).
const tickValueLabelStyle = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.92857em',
  fontWeight: 700,
  paddingRight: '6px',
  position: 'absolute',
  right: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  whiteSpace: 'nowrap',
};

const ProgressBarWithMarkers = ({
  /** Required: a list of { value, label, variant?, leftPercent? } points. */
  dataPoints,
  /** Numeric total used to position markers along the bar. */
  total,
  /** Props forwarded to the underlying Semantic UI <Progress> component. */
  progressProps = {},
  /** Tolerance (% of bar) for merging near-duplicate markers into one tooltip. */
  mergeTolerance = 0.5,
  /** When true, render each tick's value as a small inline label to its left. */
  showTickValues = false,
  /** Format the inline tick value. Defaults to rounded whole numbers. */
  formatTickValue = (value) => Math.round(value),
}) => {
  // Group markers that resolve to the same horizontal position so a stack of
  // near-identical values renders as one tick with a multi-line tooltip. The
  // first marker in each group provides the canonical `value` for the inline
  // tick label, since merged markers all share the same position by definition.
  const grouped = (dataPoints || []).reduce((acc, point) => {
    const positionPercent =
      point.leftPercent !== undefined
        ? point.leftPercent
        : total
          ? (point.value / total) * 100
          : 0;
    const clamped = Math.max(0, Math.min(100, positionPercent));
    const existing = acc.find(
      (g) => Math.abs(g.positionPercent - clamped) <= mergeTolerance
    );
    const variant = point.variant || 'default';
    if (existing) {
      existing.labels.push(point.label);
      // If any merged member is dashed (at-risk), the merged variant should
      // visually escalate so the at-risk signal isn't hidden under a solid.
      if (variant === 'dashed') existing.variant = 'dashed';
    } else {
      acc.push({
        positionPercent: clamped,
        value: point.value,
        labels: [point.label],
        variant,
      });
    }
    return acc;
  }, []);

  // Ensure the underlying Progress always renders at the same fixed pixel
  // height the markers are positioned against, regardless of which Semantic
  // UI variant the caller chose. Without this the bar can render taller than
  // the container (its `progress` label adds vertical space) which throws
  // markers off-center.
  const mergedProgressProps = {
    ...progressProps,
    style: {
      height: `${PROGRESS_BAR_HEIGHT}px`,
      ...(progressProps.style || {}),
    },
  };

  return (
    <div style={trackContainerStyle}>
      <Progress {...mergedProgressProps} />
      <div>
        {grouped.map((point, idx) => (
          <div key={idx} style={markerHitBoxStyle(point.positionPercent)}>
            {showTickValues && point.value !== undefined ? (
              <span style={tickValueLabelStyle}>
                {formatTickValue(point.value)}
              </span>
            ) : null}
            <Popup
              basic
              content={
                <div style={popupColumnStyle}>
                  {point.labels.map((label, labelIdx) => (
                    <div key={labelIdx}>{label}</div>
                  ))}
                </div>
              }
              hideOnScroll
              trigger={
                <div
                  className='marker-line'
                  style={markerLineStyle()}
                />
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBarWithMarkers;
