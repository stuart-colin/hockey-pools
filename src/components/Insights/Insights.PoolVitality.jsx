import React from 'react';
import {
  Card,
  Grid,
  Icon,
  Popup,
} from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import getOrdinal from '../../utils/getOrdinals';
import ProgressBarWithMarkers from './Insights.ProgressBarWithMarkers';

/**
 * PoolVitality - "Pool Pulse"
 *
 * Headline cards for the Elimination Impact section. Surfaces what fraction
 * of the pool is still alive, both by raw picks and by points actually
 * delivered. Each metric gets its own card so the bars stay isolated and
 * lined up consistently with the distribution bars used by PoolOverview.
 */

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const cardSubtitleStyle = {
  color: '#888',
  fontSize: '12px',
  fontWeight: '500',
  marginTop: '8px',
};

const formatTeamList = (teams) =>
  teams.length > 3
    ? `${teams.slice(0, 3).join(', ')} +${teams.length - 3} more`
    : teams.join(', ');

const buildMarkers = (vitality, metric) => {
  const { roundMarkers = [], atRiskMarkers = [] } = vitality;
  const valueKey = metric === 'picks' ? 'picksAlivePct' : 'pointsAlivePct';
  const projectedKey =
    metric === 'picks' ? 'projectedPicksAlivePct' : 'projectedPointsAlivePct';

  const markers = [];

  roundMarkers.forEach((m) => {
    const value = m[valueKey];
    markers.push({
      value,
      variant: 'solid',
      label: `End of ${m.round}${getOrdinal(m.round)} Round: dropped to ${value}% (${formatTeamList(m.teams)})`,
    });
  });

  atRiskMarkers.forEach((m) => {
    const value = m[projectedKey];
    const ident = m.commonName || m.name || m.abbrev;
    markers.push({
      value,
      variant: 'dashed',
      label: `At Risk: ${ident} on the brink! Could drop to ${value}%`,
    });
  });

  return markers;
};

const VitalityCard = ({
  title,
  tooltip,
  alivePct,
  aliveCount,
  totalCount,
  countLabel,
  color,
  markers,
}) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        {title}
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
      </Card.Header>
    </Card.Content>
    <Card.Content>
      <ProgressBarWithMarkers
        dataPoints={markers}
        total={100}
        progressProps={{
          color,
          percent: alivePct,
          progress: 'percent',
        }}
      />
      <div style={cardSubtitleStyle}>
        {aliveCount} of {totalCount} {countLabel} alive
      </div>
    </Card.Content>
  </Card>
);

const PoolVitality = ({ vitality }) => {
  if (!vitality || !vitality.overall) return null;

  const { overall, eliminatedTeamCount } = vitality;

  const alivePicks = overall.totalPicks - overall.eliminatedPicks;
  const alivePoints = overall.totalPoints - overall.eliminatedPoints;

  const picksMarkers = buildMarkers(vitality, 'picks');
  const pointsMarkers = buildMarkers(vitality, 'points');

  return (
    <>
      <Grid stackable columns={2}>
        <Grid.Column>
          <VitalityCard
            alivePct={overall.picksAlivePct}
            aliveCount={alivePicks}
            color={INSIGHT_COLORS.PERFECT_TEAM /* green */}
            countLabel='picks'
            markers={picksMarkers}
            title='Picks Alive'
            tooltip='Share of the pool that is still alive.'
            totalCount={overall.totalPicks}
          />
        </Grid.Column>
        <Grid.Column>
          <VitalityCard
            alivePct={overall.pointsAlivePct}
            aliveCount={alivePoints}
            color={INSIGHT_COLORS.MOST_COMMON_TEAM /* blue */}
            countLabel='points'
            markers={pointsMarkers}
            title='Points Alive'
            tooltip="Share of points scored to date that are coming from active teams."
            totalCount={overall.totalPoints}
          />
        </Grid.Column>
      </Grid>
    </>
  );
};

export default React.memo(PoolVitality);
