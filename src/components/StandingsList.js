import React, { useState, useEffect } from 'react';
import StandingsItem from './StandingsItem';
import Sort from './Sort';
import useUsers from '../hooks/useUsers';

const StandingsList = ({ onRosterSelect }) => {
  const [loading, setLoading] = useState(true);
  const users = useUsers();

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const loadedStyle = () => {
    if (!loading) {
      return { display: "none" }
    } else {
      return { paddingTop: 150 }
    }
  }

  const renderedList = users.userList.map((user) => {
    return (
      // <Sort by="onRosterSelect">
      //   { store.results.data.sort((a, b) => a.onRosterSelect)}
      <StandingsItem
        activeRoster={user}
        onRosterSelect={onRosterSelect}
        key={user.name}
        loading={users.loading}
      />
      // </Sort>
    )
  })

  return (
    <div className="ui vertical segment">
      <div>
        <div className="ui top attached centered blue header">
          <h2>Standings</h2>
        </div>
        <div className="ui attached segment">
          <div className="ui middle aligned selection ordered list" >
            <div className="ui active inverted dimmer" style={loadedStyle()}>
              <div className="ui text loader">
                Loading Standings...
              </div>
            </div>
            {renderedList}
          </div>
        </div>
      </div>
    </div>
  )
};

export default StandingsList;