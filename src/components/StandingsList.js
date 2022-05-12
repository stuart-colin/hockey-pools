import React, { useState, useEffect } from 'react';
import StandingsItem from './StandingsItem';
import Sort from './Sort';
import useUsers from '../hooks/useUsers';

const StandingsList = ({ selectedUser, onRosterSelect }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState('false');
  const users = useUsers();

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const loadedStyle = () => {
    if (!loading) {
      return { display: "none" }
    }
  }

  const renderedList = users.userList.map((user, index) => {
    return (
      // <Sort by="onRosterSelect">
      //   { store.results.data.sort((a, b) => a.onRosterSelect)}
      <StandingsItem
        index={index}
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
        <div className="ui top blue centered attached header" onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>

          <div className='left aligned column' style={{ position: 'absolute' }}>
            <h3>
              {visible &&
                <i className="ui small angle double up icon"></i>
              }
              {!visible &&
                <i className="ui small angle double down icon"></i>
              }
            </h3>
          </div>
          <div className='middle aligned column'>
            <h2>Standings</h2>
          </div>
        </div>
        <div className="ui attached segment" style={{ display: !visible ? 'none' : 'block', maxHeight: '85em', minHeight: '15em', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="ui active inverted dimmer" style={loadedStyle()}>
            <div className="ui text loader">
              Loading Standings...
            </div>
          </div>
          <div className="ui middle aligned selection ordered list" >
            {renderedList}
          </div>
        </div>
      </div>
    </div >
  )
};

export default StandingsList;