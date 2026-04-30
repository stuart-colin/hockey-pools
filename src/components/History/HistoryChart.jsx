import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { colorForRosterId, GHOST_COLOR, GHOST_HOVER_COLOR } from './colorPalette';

const tooltipContainerStyle = {
  background: 'white',
  border: '1px solid #e1e8ed',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 12,
  color: '#1b1c1d',
  maxWidth: 260,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

const tooltipRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 2,
};

const swatchStyle = (color) => ({
  width: 8,
  height: 8,
  borderRadius: 2,
  background: color,
  flex: '0 0 8px',
});

const tooltipRankStyle = {
  flex: '0 0 22px',
  textAlign: 'right',
  color: '#5a5a5a',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
};

// Tooltip behaviour:
//   - Default mode: show every roster currently drawn in colour (the
//     `highlightSet`) plus all pinned rosters plus the hovered line.
//   - Fallback (e.g. "All ghost" filter with nothing pinned): show the
//     top N scorers so the tooltip is never empty.
//   - Hard cap so dense days don't produce a wall of text.
const TOOLTIP_FALLBACK_TOP_N = 5;
const TOOLTIP_HARD_CAP = 25;

/**
 * The day before the first tracked date, used as the synthetic 0-point
 * baseline so every line visually rises from 0 on day 1.
 */
const inferBaselineDate = (firstDate) => {
  if (!firstDate) return null;
  const [y, m, d] = firstDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
};

/**
 * Reshape time-series into Recharts' row-per-x layout, prepending a
 * "day 0" baseline where every roster sits at 0.
 *   data[0] = { date: <day before dates[0]>, [rosterId]: 0, ... }
 *   data[i] = { date, [rosterId]: points, ... }
 */
const useChartData = (dates, series) => useMemo(() => {
  if (!dates.length) return [];
  const rows = dates.map((date, dateIdx) => {
    const row = { date };
    series.forEach((s) => {
      row[s.rosterId] = s.points[dateIdx] ?? 0;
    });
    return row;
  });
  const baselineDate = inferBaselineDate(dates[0]);
  if (!baselineDate) return rows;
  const baselineRow = { date: baselineDate, __baseline: true };
  series.forEach((s) => {
    baselineRow[s.rosterId] = 0;
  });
  return [baselineRow, ...rows];
}, [dates, series]);

const HistoryChart = ({
  dates,
  series,
  selectedDateIdx,
  highlightSet,
  pinnedSet,
  onHoverRoster,
  onClickRoster,
  height = 380,
}) => {
  const data = useChartData(dates, series);
  const [hoverRosterId, setHoverRosterId] = useState(null);

  // Sort so highlighted/hovered lines render on top of the ghost layer.
  const renderOrder = useMemo(() => {
    const ghosts = [];
    const highlights = [];
    series.forEach((s) => {
      if (highlightSet.has(s.rosterId) || pinnedSet.has(s.rosterId)) {
        highlights.push(s);
      } else {
        ghosts.push(s);
      }
    });
    return [...ghosts, ...highlights];
  }, [series, highlightSet, pinnedSet]);

  const tooltipContent = ({ active, label, payload }) => {
    if (!active || !payload?.length) return null;
    const dateIdx = dates.indexOf(label);
    if (dateIdx < 0) {
      return (
        <div style={tooltipContainerStyle}>
          <div style={{ fontWeight: 600, color: '#1b1c1d' }}>Start ({label})</div>
          <div style={{ marginTop: 4, color: '#888' }}>Every roster at 0.</div>
        </div>
      );
    }

    const sortedByPoints = [...series].sort(
      (a, b) => (b.points[dateIdx] ?? 0) - (a.points[dateIdx] ?? 0)
    );

    // Compute dense rank (ties share a rank) for the selected day so the
    // tooltip can show each line's standing on that exact date.
    const rankByRoster = new Map();
    let lastPoints = null;
    let lastRank = 0;
    sortedByPoints.forEach((s, i) => {
      const pts = s.points[dateIdx] ?? 0;
      if (pts !== lastPoints) {
        lastRank = i + 1;
        lastPoints = pts;
      }
      rankByRoster.set(s.rosterId, lastRank);
    });

    const visibleSet = new Set();
    highlightSet.forEach((id) => visibleSet.add(id));
    pinnedSet.forEach((id) => visibleSet.add(id));
    if (hoverRosterId) visibleSet.add(hoverRosterId);

    // Fallback so the tooltip is never empty (e.g. "All ghost" mode with
    // nothing pinned and nothing hovered).
    if (visibleSet.size === 0) {
      sortedByPoints
        .slice(0, TOOLTIP_FALLBACK_TOP_N)
        .forEach((s) => visibleSet.add(s.rosterId));
    }

    const rows = sortedByPoints
      .filter((s) => visibleSet.has(s.rosterId))
      .slice(0, TOOLTIP_HARD_CAP);
    const remaining = visibleSet.size - rows.length;

    return (
      <div style={tooltipContainerStyle}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#1b1c1d' }}>{label}</div>
        {rows.map((s) => (
          <div key={s.rosterId} style={tooltipRowStyle}>
            <span style={swatchStyle(colorForRosterId(s.rosterId))} />
            <span style={tooltipRankStyle}>{rankByRoster.get(s.rosterId)}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.ownerName}
            </span>
            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{s.points[dateIdx] ?? 0}</strong>
          </div>
        ))}
        {remaining > 0 && (
          <div style={{ marginTop: 6, color: '#999', fontStyle: 'italic' }}>
            +{remaining} others
          </div>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width='100%' height={height}>
      <LineChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
        <XAxis
          dataKey='date'
          tick={{ fontSize: 11, fill: '#657786' }}
          stroke='#e1e8ed'
          interval='preserveStartEnd'
          minTickGap={32}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#657786' }}
          stroke='#e1e8ed'
          width={36}
          domain={[0, 'auto']}
        />
        <Tooltip content={tooltipContent} />
        {dates[selectedDateIdx] != null && (
          <ReferenceLine
            x={dates[selectedDateIdx]}
            stroke='#2185d0'
            strokeOpacity={0.7}
            strokeWidth={1.5}
          />
        )}
        {renderOrder.map((s) => {
          const isHighlighted = highlightSet.has(s.rosterId) || pinnedSet.has(s.rosterId);
          const isHovered = hoverRosterId === s.rosterId;
          let stroke;
          let strokeWidth;
          let opacity;
          if (isHovered) {
            stroke = colorForRosterId(s.rosterId);
            strokeWidth = 2.5;
            opacity = 1;
          } else if (isHighlighted) {
            stroke = colorForRosterId(s.rosterId);
            strokeWidth = 2;
            opacity = 0.95;
          } else {
            stroke = GHOST_COLOR;
            strokeWidth = 0.75;
            opacity = 1;
          }
          return (
            <Line
              key={s.rosterId}
              type='monotone'
              dataKey={s.rosterId}
              name={s.ownerName}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              dot={false}
              activeDot={isHighlighted || isHovered ? { r: 4 } : false}
              isAnimationActive={false}
              onMouseEnter={() => {
                setHoverRosterId(s.rosterId);
                if (onHoverRoster) onHoverRoster(s.rosterId);
              }}
              onMouseLeave={() => {
                setHoverRosterId(null);
                if (onHoverRoster) onHoverRoster(null);
              }}
              onClick={() => onClickRoster && onClickRoster(s.rosterId)}
              style={{ cursor: onClickRoster ? 'pointer' : 'default' }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Hover-color export referenced for parity with palette consumers.
export { GHOST_HOVER_COLOR };
export default HistoryChart;
