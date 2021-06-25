import React, { useState, useEffect } from 'react';
import StandingsItem from './StandingsItem';
import Sort from './Sort';

const StandingsList = ({ rosters, onRosterSelect }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      setLoading(false)
    }, 10000);
    
    return () => window.clearTimeout(timeoutID);
    }, []);

  const loadedStyle = () => {
    if (!loading) {
      return  {display: "none"}
    }
  }

  const renderedList = rosters.map((roster) => {
    return (
      // <Sort by="onRosterSelect">
      //   { store.results.data.sort((a, b) => a.onRosterSelect)}
      <StandingsItem 
        activeRoster={roster}
        onRosterSelect={onRosterSelect}
        key={roster.name}
      />
      // </Sort>
    )
  })

  return (
    <div className="ui vertical segment">
      <div>
        <div className="ui top attached header">
          <h3>Standings</h3>
        </div>
        <div className="ui attached segment">
          <div className="ui middle aligned selection ordered list" >
            {renderedList}
            <div className="ui active inverted dimmer" style={loadedStyle()}>
              <div className="ui text loader">Fetching Scores...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default StandingsList;