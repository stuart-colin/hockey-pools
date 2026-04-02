import React from 'react';
import { Flag, Grid, Header, Icon, Popup } from 'semantic-ui-react';

const StandingsListHeader = ({ hasLiveGames, moversMode, onMoversToggle, pot, season }) => {
  const getHeaderTitle = () => {
    if (moversMode === 'points') return "Today's Movers";
    if (moversMode === 'rank') return 'Biggest Climbers';
    return `${season} Standings`;
  };

  const getMoversTooltip = () => {
    if (moversMode === 'standings') return "Sort by today's point gains";
    if (moversMode === 'points') return 'Sort by rank movement';
    return 'Switch to regular standings';
  };

  return (
    <Grid textAlign="center">
      <Grid.Row columns={3}>
        <Grid.Column
          textAlign="left"
          verticalAlign="middle"
          width={2}
        >
          <Popup
            content={getMoversTooltip()}
            position='right center'
            trigger={
              <Icon
                color={moversMode === 'standings' ? 'grey' : moversMode === 'points' ? 'green' : 'yellow'}
                name="lightning"
                onClick={onMoversToggle}
                style={{ cursor: 'pointer' }}
              />
            }
          />
        </Grid.Column>
        <Grid.Column
          textAlign="center"
          width={12}
        >
          <Header
            color="blue"
            size="medium"
            style={{ whiteSpace: 'nowrap' }}
          >
            {getHeaderTitle()}
          </Header>
        </Grid.Column>
        <Grid.Column width={2}>
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
