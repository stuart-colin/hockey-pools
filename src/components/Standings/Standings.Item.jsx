import React, { Fragment } from 'react';
import { Flag, Icon, Image, List, Transition } from 'semantic-ui-react';
import StandingsRosterView from './Standings.RosterView';
import { getAvatarSvg, TOP_10_COLORS } from './Standings.utils';
import '../../css/customStyle.css';


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

    return (
      <Fragment>
        <div ref={ref} />
        <List.Item
          onClick={onToggleRoster}
          style={{ backgroundColor }}
        >
          <List.Content
            floated="left"
            style={{
              minWidth: '2.5em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
            verticalAlign="middle"
          >
            {user.rank}
            {rankDelta > 0 && (
              <span
                style={{
                  color: '#21ba45',
                  fontSize: '0.75em',
                  paddingTop: '5px',
                }}
              >
                <Icon
                  color="green"
                  name="arrow up"
                  style={{
                    marginRight: '0em',
                  }}
                />
                {rankDelta}
              </span>
            )}
            {rankDelta < 0 && (
              <span
                style={{
                  color: 'red',
                  fontSize: '0.75em',
                  paddingTop: '5px',
                }}
              >
                <Icon
                  color="red"
                  name="arrow down"
                  style={{
                    marginRight: '0em',
                  }}
                />
                {Math.abs(rankDelta)}
              </span>
            )}
          </List.Content>
          <Image
            alt="participant avatar"
            avatar
            src={getAvatarSvg(user.owner.name)}
            style={{
              height: '2.5em',
              width: '2.5em',
            }}
            verticalAlign="middle"
          />
          <List.Content
            style={{ maxWidth: '40%' }}
          >
            <List.Header
              style={{
                paddingBottom: '5px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              {user.owner &&
                user.owner.country &&
                user.owner.country.toLowerCase() !== 'n/a' && (
                  <Flag
                    style={{ opacity: 0.5 }}
                    name={user.owner.country.toLowerCase()}
                  />
                )}
              {user.owner.name}
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-end'
            }}>
            {/* <List.Description style={{ display: 'flex', flexDirection: 'column' }}> */}
            <span>
              {user.points} Points
              {user.livePoints > 0 && (
                <span
                  style={{
                    color: '#21ba45',
                    fontSize: '0.75em',
                    fontWeight: 'bold',
                    marginLeft: '0.4em',
                  }}
                >
                  <Icon
                    color="green"
                    name="lightning"
                    style={{
                      marginRight: '0em',
                    }}
                  />
                  {user.livePoints}
                </span>
              )}
            </span>
            <span
              className={`playersRemaining${user.playersRemaining}`}
            >
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
              style={{
                paddingTop: '10px',
                width: '100%',
                flexBasis: '100%',
              }}
            >
              <StandingsRosterView user={user} />
            </div>
          </Transition>
        </List.Item>
      </Fragment >
    );
  }
);

StandingsItem.displayName = 'StandingsItem';

export default StandingsItem;
