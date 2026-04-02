import React from 'react';
import { Flag, Grid, Header, Icon, Popup } from 'semantic-ui-react';

const StandingsListHeader = ({ liveStatsEnabled, moversMode, onMoversToggle, pot, season }) => {
  const getHeaderTitle = () => {
    if (moversMode === 'points') return "Point Gainers";
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
          width={3}
        >
          {liveStatsEnabled && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {moverModes.map(({ mode, icon, color, tooltip }) => (
                <Popup
                  content={tooltip}
                  key={mode}
                  position="right center"
                  trigger={
                    <Icon
                      color={moversMode === mode ? color : 'grey'}
                      name={icon}
                      onClick={() => onMoversToggle(mode)}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                />
              ))}
            </div>
          )}
        </Grid.Column>
        <Grid.Column
          textAlign='center'
          width={10}
        >
          <Header
            color="blue"
            size="medium"
            style={{ whiteSpace: 'nowrap' }}
          >
            {getHeaderTitle()}
          </Header>
        </Grid.Column>
        <Grid.Column
          textAlign='right'
          width={3}>
          <Popup
            content={
              <div>
                Pot: ${pot} <Flag name="canada" />
              </div>
            }
            position='left center'
            trigger={
              <Icon
                color="green"
                name="dollar sign"
              />
            }
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default StandingsListHeader;
