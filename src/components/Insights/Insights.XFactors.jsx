import React from 'react';
import {
  Card,
  Grid,
  Header,
  Icon,
  Image,
  Popup,
  Table,
} from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import InsightDataTable from './Insights.InsightDataTable';

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const verhaegheNameStrongStyle = {
  fontSize: '14px',
};

const verhaegheClutchValueStyle = (player) => ({
  color: player.clutchRating > 0 ? '#21ba45' : player.clutchRating < 0 ? '#db2828' : '#666',
  fontSize: '13px',
  fontWeight: 'bold',
});

const verhaegheMetaRowStyle = {
  color: '#999',
  display: 'inline-flex',
  fontSize: '12px',
  gap: '12px',
  marginLeft: '12px',
};

const bonusRowLogoBackdropStyle = (isMobileRow) => ({
  height: isMobileRow ? '32px' : '44px',
  marginLeft: -75,
  marginTop: isMobileRow ? -5 : -9,
  position: 'absolute',
});

const bonusRowTeamLogoStyle = (player) => ({
  opacity: 0.1,
  height: '100%',
  objectFit: 'cover',
  filter: player.isEliminated ? 'grayscale(1)' : 'none',
});

const bonusRowHeadshotStyle = (player) => ({
  filter: player.isEliminated ? 'grayscale(1)' : 'none',
  opacity: player.isEliminated ? 0.5 : 1,
});

const XFactors = ({
  clutchFactorData,
  bonusHuntersList,
  loneWolvesList,
  regularSeasonStats,
  usersRostersLength,
  isMobile,
}) => {
  return (
    <section className='insights-section'>
      <Header as='h3' dividing>
        X Factors
      </Header>
      <Grid stackable columns={2} className='pick-analysis-grid three-column'>

        {/* Verhaeghe Effect */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Verhaeghe Effect
                <Popup
                  content='Playoff performance vs. regular season — who elevates their game when it matters most.'
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
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                players={clutchFactorData}
                color='blue'
                visibleRows={4}
                expandedRows={10}
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Clutch (Δ PPG)</Table.HeaderCell>
                  </Table.Row>
                )}
                rowRenderer={(player, isMobileRow) => (
                  <Table.Row key={player.id} negative={player.isEliminated}>
                    <Table.Cell>
                      <div style={bonusRowLogoBackdropStyle(isMobileRow)}>
                        <Image
                          alt={`${player.teamName} Logo`}
                          size='large'
                          src={player.teamLogo}
                          style={bonusRowTeamLogoStyle(player)}
                        />
                      </div>
                      <Image
                        alt={player.name}
                        avatar
                        src={player.headshot}
                        style={bonusRowHeadshotStyle(player)}
                      />
                      <strong style={verhaegheNameStrongStyle}>{player.name}</strong>
                      <span style={verhaegheMetaRowStyle}>
                        <span>Regular: {player.regularSeasonPPG} PPG</span>
                        <span>Playoff: {player.playoffPPG} PPG</span>
                      </span>
                    </Table.Cell>
                    <Table.Cell textAlign='right' verticalAlign='middle'>
                      <span style={verhaegheClutchValueStyle(player)}>
                        {player.clutchRating > 0 ? '+' : ''}{player.clutchRating}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                )}
                emptyMessage={regularSeasonStats?.loading ? 'Loading regular season data...' : 'No data available yet'}
              />
            </Card.Content>
          </Card>
        </Grid.Column>

        {/* Bonus Hunters */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Bonus Hunters
                <Popup
                  content='Players earning extra points from overtime goals and shutouts.'
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
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                players={bonusHuntersList}
                color={INSIGHT_COLORS.BEST_PICKS}
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell />
                    <Table.HeaderCell textAlign='right'>Selections</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Points</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Bonus</Table.HeaderCell>
                  </Table.Row>
                )}
                rowRenderer={(player, isMobileRow) => (
                  <Table.Row key={player.id} negative={player.isEliminated}>
                    <Table.Cell collapsing>
                      <div
                        style={bonusRowLogoBackdropStyle(isMobileRow)}
                      >
                        <Image
                          alt={`${player.teamName} Logo`}
                          size='large'
                          src={player.teamLogo}
                          style={bonusRowTeamLogoStyle(player)}
                        />
                      </div>
                      <Image
                        alt={player.name}
                        avatar
                        src={player.headshot}
                        style={bonusRowHeadshotStyle(player)}
                      />
                      {player.name}
                    </Table.Cell>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell textAlign='right'>{player.pickCount}</Table.Cell>
                    <Table.Cell textAlign='right'><strong>{player.points}</strong></Table.Cell>
                    <Table.Cell textAlign='right'> {player.bonusLabel} (+{player.bonusPoints})</Table.Cell>
                  </Table.Row>
                )}
                emptyMessage='No bonus points scored yet'
              />
            </Card.Content>
          </Card>
        </Grid.Column>

        {/* Lone Wolves */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Lone Wolves
                <Popup
                  content='Players only on one roster — exclusive picks that give their owner a unique edge, if they can produce.'
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
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                players={loneWolvesList}
                color={INSIGHT_COLORS.MOST_ADVANTAGEOUS}
                showPercentage={false}
                emptyMessage='No unique picks with points yet'
              />
            </Card.Content>
          </Card>
        </Grid.Column>

      </Grid>
    </section>
  );
};

export default XFactors;
