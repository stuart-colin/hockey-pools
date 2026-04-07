import React from 'react';

import {
  Flag,
  Grid,
  Header,
  Icon,
  Popup
} from 'semantic-ui-react';

const moverIconsRowStyle = {
  display: 'flex',
  gap: '8px',
};

const clickableIconStyle = {
  cursor: 'pointer',
};

const headerTitleStyle = {
  whiteSpace: 'nowrap',
};

const StandingsListHeader = ({ liveStatsEnabled, moversMode, onMoversToggle, pot, season }) => {
  const getHeaderTitle = () => {
    if (moversMode === 'points') return 'Point Gainers';
    if (moversMode === 'rank') return 'Rank Climbers';
    return `${season} Standings`;
  };

  const moverModes = [
    { mode: 'standings', icon: 'list ol', color: 'blue', tooltip: 'Sort by overall standings' },
    { mode: 'points', icon: 'lightning', color: 'green', tooltip: "Sort by today's point gains" },
    { mode: 'rank', icon: 'chart line', color: 'yellow', tooltip: "Sort by today's rank movement" },
  ];

  return (
    <Grid>
      <Grid.Row columns={3}>
        <Grid.Column
          textAlign='left'
          width={4}
        >
          {liveStatsEnabled && (
            <div style={moverIconsRowStyle}>
              {moverModes.map(({ mode, icon, color, tooltip }) => (
                <Popup
                  content={tooltip}
                  hideOnScroll
                  key={mode}
                  position='bottom left'
                  trigger={
                    <Icon
                      color={moversMode === mode ? color : 'grey'}
                      name={icon}
                      onClick={() => onMoversToggle(mode)}
                      size='large'
                      style={clickableIconStyle}
                    />
                  }
                />
              ))}
            </div>
          )}
        </Grid.Column>
        <Grid.Column
          textAlign='center'
          width={8}
        >
          <Header
            color='blue'
            size='medium'
            style={headerTitleStyle}
          >
            {getHeaderTitle()}
          </Header>
        </Grid.Column>
        <Grid.Column
          textAlign='right'
          width={4}>
          <Popup
            content={
              <div>
                Pot: ${pot} <Flag name='canada' />
              </div>
            }
            hideOnScroll
            position='bottom right'
            trigger={
              <Icon
                color='green'
                name='dollar sign'
                size='large'
              />
            }
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default StandingsListHeader;
