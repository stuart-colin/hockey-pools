import React, { useMemo, useState } from 'react';
import { Button, Icon, Input, Label } from 'semantic-ui-react';
import { colorForRosterId } from './colorPalette';
import './History.css';

const FILTER_OPTIONS = [
  { id: 'top10now', label: 'Top 10' },
  { id: 'top10movers', label: '7 Day Movers' },
  { id: 'pinned', label: 'My Pins' },
];

const HistoryRosterPicker = ({ series, pinnedSet, onTogglePin, filterMode, onChangeFilterMode, onClearPins }) => {
  const [search, setSearch] = useState('');

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return series
      .filter((s) => s.ownerName.toLowerCase().includes(q))
      .slice(0, 10);
  }, [series, search]);

  const pinned = useMemo(
    () => series.filter((s) => pinnedSet.has(s.rosterId)),
    [series, pinnedSet]
  );

  return (
    <div className='history-picker'>
      <div className='history-picker__filters'>
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            size='small'
            basic={filterMode !== opt.id}
            primary={filterMode === opt.id}
            onClick={() => onChangeFilterMode(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <Input
        error={search.trim().length > 0 && matches.length === 0}
        icon='search'
        iconPosition='left'
        placeholder='Search Rosters'
        value={search}
        onChange={(_, data) => setSearch(data.value)}
        fluid
      />

      {search && matches.length > 0 && (
        <div className='history-picker__results'>
          {matches.map((s) => {
            const isPinned = pinnedSet.has(s.rosterId);
            return (
              <button
                key={s.rosterId}
                type='button'
                className='history-picker__result-row'
                onClick={() => onTogglePin(s.rosterId)}
              >
                <span
                  className='history-picker__swatch'
                  style={{ background: colorForRosterId(s.rosterId) }}
                />
                <span className='history-picker__name'>{s.ownerName}</span>
                <Icon
                  name={isPinned ? 'pin' : 'plus'}
                  color={isPinned ? 'blue' : 'grey'}
                />
              </button>
            );
          })}
        </div>
      )}

      {pinned.length > 0 && (
        <div className='history-picker__pinned'>
          <div className='history-picker__pinned-header'>
            <span>Pinned</span>
            <Button basic size='small' compact onClick={onClearPins}>
              Clear
            </Button>
          </div>
          <div className='history-picker__pinned-list'>
            {pinned.map((s) => (
              <Label
                key={s.rosterId}
                as='a'
                size='small'
                onClick={() => onTogglePin(s.rosterId)}
                title='Click to unpin'
              >
                <span
                  className='history-picker__swatch'
                  style={{ background: colorForRosterId(s.rosterId) }}
                />
                {s.ownerName}
                <Icon name='delete' />
              </Label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryRosterPicker;
