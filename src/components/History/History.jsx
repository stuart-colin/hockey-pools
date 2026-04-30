import React, { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  Grid,
  Icon,
  Loader,
  Message,
  Popup,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import useStandingsHistory from '../../hooks/useStandingsHistory';
import CollapsibleSection from '../Insights/Insights.CollapsibleSection';
import HistoryChart from './HistoryChart';
import HistoryScrubber from './HistoryScrubber';
import HistoryRosterPicker from './HistoryRosterPicker';
import HistoryStandingsPanel from './HistoryStandingsPanel';
import {
  biggestClimbers,
  biggestFaders,
  biggestSingleDay,
  topMovers,
  topNAtDate,
} from './historyAnalytics';
import '../Insights/Insights.Sections.css';
import './History.css';

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const computeHighlightSet = ({ series, dates, selectedDateIdx, filterMode, pinnedSet }) => {
  if (!series.length || !dates.length) return new Set();
  if (filterMode === 'pinned') return new Set(pinnedSet);
  if (filterMode === 'top10movers') {
    return new Set(topMovers(series, dates, { referenceIdx: selectedDateIdx }));
  }
  return new Set(topNAtDate(series, selectedDateIdx, 10));
};

const HelpIcon = ({ tooltip }) => (
  <Popup
    content={tooltip}
    hideOnScroll
    position='right center'
    trigger={(
      <Icon
        name='question circle outline'
        size='small'
        style={popupQuestionIconStyle}
      />
    )}
  />
);

const StorylineCard = ({ title, tooltip, items, formatItem, color, emptyMessage }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        {title}
        {tooltip && <HelpIcon tooltip={tooltip} />}
      </Card.Header>
    </Card.Content>
    <Card.Content>
      {items.length === 0 ? (
        <div className='history-storylines__empty'>{emptyMessage}</div>
      ) : (
        <Statistic.Group horizontal size='mini' className='history-storylines__group'>
          {items.map((item, idx) => (
            <Statistic
              color={color}
              key={`${item.rosterId}-${idx}`}
              label={formatItem.label(item)}
              value={formatItem.value(item)}
            />
          ))}
        </Statistic.Group>
      )}
    </Card.Content>
  </Card>
);

const STORYLINE_WINDOW_OPTIONS = [
  { id: 3, label: '3d' },
  { id: 7, label: '7d' },
  { id: 14, label: '14d' },
  { id: null, label: 'All' },
];

const STORYLINE_WINDOW_LABEL = {
  3: 'last 3 days',
  7: 'last 7 days',
  14: 'last 14 days',
  null: 'tracked history',
};

const StorylineWindowControl = ({ value, onChange }) => (
  <div className='history-storylines__window'>
    <Button.Group basic size='small'>
      {STORYLINE_WINDOW_OPTIONS.map((opt) => (
        <Button
          key={opt.id ?? 'all'}
          active={value === opt.id}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </Button>
      ))}
    </Button.Group>
  </div>
);

const Storylines = ({ series, dates, windowDays, onChangeWindow }) => {
  const climbers = useMemo(
    () => biggestClimbers(series, dates, { windowDays }),
    [series, dates, windowDays]
  );
  const faders = useMemo(
    () => biggestFaders(series, dates, { windowDays }),
    [series, dates, windowDays]
  );
  const bigDays = useMemo(
    () => biggestSingleDay(series, dates, { windowDays }),
    [series, dates, windowDays]
  );

  if (!series.length || !dates.length) return null;

  const windowLabel = STORYLINE_WINDOW_LABEL[windowDays] || 'tracked history';

  return (
    <>
      <StorylineWindowControl value={windowDays} onChange={onChangeWindow} />
      <Grid stackable columns={3} className='pick-analysis-grid three-column'>
        <Grid.Column>
          <StorylineCard
            color='green'
            emptyMessage='Nobody has gained ground in this window.'
            formatItem={{
              value: (c) => `+${c.delta}`,
              label: (c) => `${c.ownerName} (${c.startRank} → ${c.endRank})`,
            }}
            items={climbers}
            title='Rising'
            tooltip={`Rosters that climbed the most rank positions over the ${windowLabel}.`}
          />
        </Grid.Column>
        <Grid.Column>
          <StorylineCard
            color='red'
            emptyMessage='Nobody has slipped in this window.'
            formatItem={{
              value: (c) => `-${c.delta}`,
              label: (c) => `${c.ownerName} (${c.startRank} → ${c.endRank})`,
            }}
            items={faders}
            title='Falling'
            tooltip={`Rosters that fell the most rank positions over the ${windowLabel}.`}
          />
        </Grid.Column>
        <Grid.Column>
          <StorylineCard
            color='blue'
            emptyMessage='No big single-day jumps in this window.'
            formatItem={{
              value: (c) => `+${c.gain}`,
              label: (c) => `${c.ownerName} on ${c.date}`,
            }}
            items={bigDays}
            title='Most Single-Day Points'
            tooltip={`Largest one-day point gains over the ${windowLabel}.`}
          />
        </Grid.Column>
      </Grid>
    </>
  );
};

const History = ({ season, embedded = false }) => {
  const { dates, series, loading, error } = useStandingsHistory(season);
  const { user } = useAuth0();

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [filterMode, setFilterMode] = useState('top10now');
  const [pinnedSet, setPinnedSet] = useState(() => new Set());
  const [autoPinnedRosterId, setAutoPinnedRosterId] = useState(null);
  const [storylineWindow, setStorylineWindow] = useState(7);

  // When a fresh dataset arrives, jump the scrubber to the most recent day.
  useEffect(() => {
    if (dates.length > 0) {
      setSelectedDateIdx(dates.length - 1);
    }
  }, [dates]);

  // Auto-pin the logged-in user's own roster (best-effort by display name).
  useEffect(() => {
    if (!user || !series.length) return;
    const myName = (user.name || user.nickname || '').trim().toLowerCase();
    if (!myName) return;
    const mine = series.find((s) => s.ownerName.toLowerCase() === myName);
    if (!mine || mine.rosterId === autoPinnedRosterId) return;
    setAutoPinnedRosterId(mine.rosterId);
    setPinnedSet((prev) => {
      const next = new Set(prev);
      next.add(mine.rosterId);
      return next;
    });
  }, [user, series, autoPinnedRosterId]);

  const togglePin = (rosterId) => {
    setPinnedSet((prev) => {
      const next = new Set(prev);
      if (next.has(rosterId)) next.delete(rosterId);
      else next.add(rosterId);
      return next;
    });
  };

  const clearPins = () => setPinnedSet(new Set());

  const highlightSet = useMemo(
    () => computeHighlightSet({ series, dates, selectedDateIdx, filterMode, pinnedSet }),
    [series, dates, selectedDateIdx, filterMode, pinnedSet]
  );

  if (error) {
    const errorBody = (
      <Message negative>
        <Message.Header>Couldn't load history</Message.Header>
        <p>{error.message || String(error)}</p>
      </Message>
    );
    if (embedded) return errorBody;
    return (
      <Segment.Group>
        <Segment attached='bottom' className='insights-container'>
          {errorBody}
        </Segment>
      </Segment.Group>
    );
  }

  if (loading) {
    const loadingBody = (
      <Loader active inline='centered' size='large'>
        Loading history...
      </Loader>
    );
    if (embedded) return loadingBody;
    return (
      <Segment.Group>
        <Segment attached='bottom' className='insights-container'>
          {loadingBody}
        </Segment>
      </Segment.Group>
    );
  }

  if (!dates.length) {
    const emptyBody = (
      <Message info>
        <Message.Header>No history captured yet</Message.Header>
        <p>
          Daily snapshots start the next time the noon-ET cron runs, or run the
          backfill script (<code>scripts/backfill-history</code> in the API repo)
          to seed prior days.
        </p>
      </Message>
    );
    if (embedded) return emptyBody;
    return (
      <Segment.Group>
        <Segment attached='bottom' className='insights-container'>
          {emptyBody}
        </Segment>
      </Segment.Group>
    );
  }

  const Body = (
    <div className='history-page'>
      <CollapsibleSection title='Pool Trajectory'>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              Standings Timeline
              <HelpIcon tooltip='Drag the slider or hit play to walk through every day. Pin rosters to keep them coloured; everyone else stays visible as a faint reference line.' />
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <div className='history-page__filters'>
              <HistoryRosterPicker
                series={series}
                pinnedSet={pinnedSet}
                onTogglePin={togglePin}
                filterMode={filterMode}
                onChangeFilterMode={setFilterMode}
                onClearPins={clearPins}
              />
            </div>
            <HistoryChart
              dates={dates}
              series={series}
              selectedDateIdx={selectedDateIdx}
              highlightSet={highlightSet}
              pinnedSet={pinnedSet}
              onClickRoster={togglePin}
            />
            <div className='history-page__scrubber'>
              <HistoryScrubber
                dates={dates}
                value={selectedDateIdx}
                onChange={setSelectedDateIdx}
              />
            </div>
          </Card.Content>
        </Card>
      </CollapsibleSection>

      <CollapsibleSection title='Storylines'>
        <Storylines
          series={series}
          dates={dates}
          windowDays={storylineWindow}
          onChangeWindow={setStorylineWindow}
        />
      </CollapsibleSection>

      <CollapsibleSection title='Daily Standings'>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              Standings on {dates[selectedDateIdx]}
              <HelpIcon tooltip='Tap a row to pin the roster on the chart. The arrow and lightning bolt show day-over-day rank/point movement vs. the previous tracked day (the first day compares against everyone tied at 1st with 0 points).' />
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <HistoryStandingsPanel
              series={series}
              dates={dates}
              selectedDateIdx={selectedDateIdx}
              pinnedSet={pinnedSet}
              onTogglePin={togglePin}
            />
          </Card.Content>
        </Card>
      </CollapsibleSection>
    </div>
  );

  if (embedded) return Body;

  return (
    <Segment.Group>
      <Segment attached='bottom' className='insights-container'>
        {Body}
      </Segment>
    </Segment.Group>
  );
};

export default History;
