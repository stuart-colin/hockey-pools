import React, { useMemo } from 'react';
import { Icon } from 'semantic-ui-react';
import getOrdinal from '../../utils/getOrdinals';
import { TOP_10_COLORS } from '../Standings/Standings.utils';
import { colorForRosterId } from './colorPalette';
import { computeRankMatrix } from './historyAnalytics';
import './History.css';

const rowBackgroundFor = (rank) => {
  if (rank > 0 && rank <= TOP_10_COLORS.length) {
    return TOP_10_COLORS[rank - 1];
  }
  return undefined;
};

const computeStandings = (series, dateIdx) => {
  const rows = series.map((s) => ({
    rosterId: s.rosterId,
    ownerName: s.ownerName,
    points: s.points[dateIdx] ?? 0,
  }));
  rows.sort((a, b) => b.points - a.points);
  let lastPoints = null;
  let lastRank = 0;
  rows.forEach((row, idx) => {
    if (row.points !== lastPoints) {
      lastRank = idx + 1;
      lastPoints = row.points;
    }
    row.rank = lastRank;
  });
  return rows;
};

const formatShortDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * For each roster, compute its best (lowest number) and worst (highest)
 * rank across the whole tracked history, plus the first date each was hit.
 * Returns a Map<rosterId, { bestRank, bestDate, worstRank, worstDate }>.
 */
const computeRankExtremes = (series, dates) => {
  const matrix = computeRankMatrix(series, dates);
  const out = new Map();
  series.forEach((row) => {
    const ranks = matrix.get(row.rosterId) || [];
    if (!ranks.length) {
      out.set(row.rosterId, null);
      return;
    }
    let bestRank = Infinity;
    let bestIdx = 0;
    let worstRank = -Infinity;
    let worstIdx = 0;
    ranks.forEach((r, i) => {
      if (!r) return;
      if (r < bestRank) {
        bestRank = r;
        bestIdx = i;
      }
      if (r > worstRank) {
        worstRank = r;
        worstIdx = i;
      }
    });
    out.set(row.rosterId, {
      bestRank,
      bestDate: dates[bestIdx],
      worstRank,
      worstDate: dates[worstIdx],
    });
  });
  return out;
};

const RankDelta = ({ delta }) => {
  if (!delta || delta === 0) {
    return <span className='history-rank-delta history-rank-delta--flat'>—</span>;
  }
  if (delta > 0) {
    return (
      <span className='history-rank-delta history-rank-delta--up'>
        <Icon name='arrow up' color='green' />
        {delta}
      </span>
    );
  }
  return (
    <span className='history-rank-delta history-rank-delta--down'>
      <Icon name='arrow down' color='red' />
      {Math.abs(delta)}
    </span>
  );
};

const PointsDelta = ({ delta }) => {
  if (!delta || delta <= 0) return null;
  return (
    <span className='history-standings__points-delta'>
      <Icon name='lightning' color='green' />
      {delta}
    </span>
  );
};

const HistoryStandingsPanel = ({
  series,
  dates,
  selectedDateIdx,
  pinnedSet,
  onTogglePin,
}) => {
  const standings = useMemo(
    () => computeStandings(series, selectedDateIdx),
    [series, selectedDateIdx]
  );

  // Day-over-day rank/points delta: compares the scrubbed day to the day
  // before it in tracked history. On the very first day we synthesise a
  // pre-playoff baseline where every roster is tied at rank 1 with 0
  // points, so day 1 still surfaces meaningful "you started here, now
  // you're here" movement.
  const previousStandingsByRoster = useMemo(() => {
    if (selectedDateIdx === 0) {
      const map = new Map();
      series.forEach((s) => map.set(s.rosterId, { rank: 1, points: 0 }));
      return map;
    }
    const prev = computeStandings(series, selectedDateIdx - 1);
    const map = new Map();
    prev.forEach((s) => map.set(s.rosterId, { rank: s.rank, points: s.points }));
    return map;
  }, [series, selectedDateIdx]);

  const rankExtremes = useMemo(
    () => computeRankExtremes(series, dates),
    [series, dates]
  );

  return (
    <div className='history-standings'>
      <div className='history-standings__list'>
        {standings.map((row) => {
          const previous = previousStandingsByRoster
            ? previousStandingsByRoster.get(row.rosterId)
            : null;
          const rankDelta = previous && previous.rank ? previous.rank - row.rank : 0;
          const pointsDelta = previous ? row.points - previous.points : 0;
          const isPinned = pinnedSet.has(row.rosterId);
          const extremes = rankExtremes.get(row.rosterId);
          const rowBackground = rowBackgroundFor(row.rank);
          return (
            <button
              type='button'
              key={row.rosterId}
              className={`history-standings__row ${isPinned ? 'history-standings__row--pinned' : ''}`}
              onClick={() => onTogglePin(row.rosterId)}
              title={isPinned ? 'Click to unpin' : 'Click to pin'}
              style={rowBackground ? { background: rowBackground } : undefined}
            >
              <span className='history-standings__rank'>{row.rank}</span>
              <span
                className='history-picker__swatch'
                style={{ background: colorForRosterId(row.rosterId) }}
              />
              <span className='history-standings__name-block'>
                <span className='history-standings__name'>{row.ownerName}</span>
                {extremes && extremes.bestRank !== Infinity && (
                  <span className='history-standings__extremes'>
                    <span className='history-standings__extreme history-standings__extreme--best'>
                      <Icon name='arrow up' size='small' />
                      {extremes.bestRank}
                      {getOrdinal(extremes.bestRank)}
                      <span className='history-standings__extreme-date'>
                        · {formatShortDate(extremes.bestDate)}
                      </span>
                    </span>
                    <span className='history-standings__extreme history-standings__extreme--worst'>
                      <Icon name='arrow down' size='small' />
                      {extremes.worstRank}
                      {getOrdinal(extremes.worstRank)}
                      <span className='history-standings__extreme-date'>
                        · {formatShortDate(extremes.worstDate)}
                      </span>
                    </span>
                  </span>
                )}
              </span>
              <RankDelta delta={rankDelta} />
              <span className='history-standings__points'>
                {row.points}
                <PointsDelta delta={pointsDelta} />
              </span>
              {isPinned ? (
                <Icon name='pin' color='blue' size='small' className='history-standings__pin' />
              ) : (
                <span className='history-standings__pin history-standings__pin--placeholder' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryStandingsPanel;
