import React, { Fragment } from 'react';
import { Flag, Grid, Icon, Image, List, Transition } from 'semantic-ui-react';
import RosterGrid from '../MyTeam/MyTeam.RosterGrid';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { getPlayersRemainingColor } from '../../constants/playersRemaining';
import { getAvatarSvg, TOP_10_COLORS } from './Standings.utils';

const rankColumnStyle = {
  minWidth: '2.5em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const rankDeltaPositiveStyle = {
  color: '#21ba45',
  fontSize: '0.75em',
  paddingTop: '5px',
};

const rankDeltaIconTightStyle = {
  marginRight: '0em',
};

const rankDeltaNegativeStyle = {
  color: 'red',
  fontSize: '0.75em',
  paddingTop: '5px',
};

const avatarImageStyle = {
  height: '2.5em',
  width: '2.5em',
};

const ownerNameColumnStyle = {
  maxWidth: '40%',
};

const listHeaderRowStyle = {
  paddingBottom: '5px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const flagDimmedStyle = {
  opacity: 0.5,
};

const pointsColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
};

const livePointsBadgeStyle = {
  color: '#21ba45',
  fontSize: '0.75em',
  fontWeight: 'bold',
  marginLeft: '0.4em',
};

const rosterExpandRegionStyle = {
  paddingTop: '10px',
  width: '100%',
  flexBasis: '100%',
};

const listItemBackgroundStyle = (backgroundColor) => ({ backgroundColor });

const StandingsItem = React.forwardRef(
  (
    {
      isRosterVisible,
      onToggleRoster,
      rankDelta,
      user,
    },
    ref
  ) => {
    const backgroundColor = user.rank <= 10 ? TOP_10_COLORS[user.rank - 1] : '';
    const { isMobile, isTablet, isWide } = useBreakpoint();
    const ownerName = user.owner?.name || 'Unclaimed Roster';
    const ownerCountry = user.owner?.country;

    return (
      <Fragment>
        <div ref={ref} />
        <List.Item
          onClick={onToggleRoster}
          style={listItemBackgroundStyle(backgroundColor)}
        >
          <List.Content
            floated="left"
            style={rankColumnStyle}
            verticalAlign="middle"
          >
            {user.rank}
            {rankDelta > 0 && (
              <span
                style={rankDeltaPositiveStyle}
              >
                <Icon
                  color="green"
                  name="arrow up"
                  style={rankDeltaIconTightStyle}
                />
                {rankDelta}
              </span>
            )}
            {rankDelta < 0 && (
              <span
                style={rankDeltaNegativeStyle}
              >
                <Icon
                  color="red"
                  name="arrow down"
                  style={rankDeltaIconTightStyle}
                />
                {Math.abs(rankDelta)}
              </span>
            )}
          </List.Content>
          <Image
            alt="participant avatar"
            avatar
            src={getAvatarSvg(ownerName)}
            style={avatarImageStyle}
            verticalAlign="middle"
          />
          <List.Content
            style={ownerNameColumnStyle}
          >
            <List.Header
              style={listHeaderRowStyle}>
              {ownerCountry &&
                ownerCountry.toLowerCase() !== 'n/a' && (
                  <Flag
                    style={flagDimmedStyle}
                    name={ownerCountry.toLowerCase()}
                  />
                )}
              {ownerName}
            </List.Header>
          </List.Content>
          <List.Content
            floated="right"
            verticalAlign="middle"
          >
            <Icon
              circular
              color="blue"
              name={!isRosterVisible ? 'chevron down' : 'chevron up'}
            />
          </List.Content>
          <List.Content
            floated='right'
            verticalAlign='middle'
            style={pointsColumnStyle}>
            {/* <List.Description style={{ display: 'flex', flexDirection: 'column' }}> */}
            <span>
              {user.points} Points
              {user.livePoints > 0 && (
                <span
                  style={livePointsBadgeStyle}
                >
                  <Icon
                    color="green"
                    name="lightning"
                    style={rankDeltaIconTightStyle}
                  />
                  {user.livePoints}
                </span>
              )}
            </span>
            <span style={{ color: getPlayersRemainingColor(user.playersRemaining) }}>
              {user.playersRemaining}/16
            </span>
            {/* </List.Description> */}
          </List.Content>
          <Transition
            animation="fade"
            duration={250}
            unmountOnHide
            visible={isRosterVisible}
          >
            <div
              style={rosterExpandRegionStyle}
            >
              {isMobile || isWide ? (
                <RosterGrid roster={user} />
              ) : (
                <Grid stackable columns={isMobile || isWide ? 1 : isTablet ? 2 : 3}>
                  <RosterGrid roster={user} />
                </Grid>
              )}
            </div>
          </Transition>
        </List.Item>
      </Fragment >
    );
  }
);

StandingsItem.displayName = 'StandingsItem';

export default StandingsItem;
