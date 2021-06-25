import React from 'react';

const message = 'Currently, players who were selected but did not appear in any playoff games are breaking the site due to no data being available for them. Until I fix this logic, they will be replaced by a player who appeared but did not accrue any points. For example, Frederik Andersen and Devan Dubnyk (?!) have been temporarily replaced with Vitek Vanecek';

const Announcement = () => {
  return (
    <div style={{position: "fixed", right: 5, top: 5, zIndex: 100, width: 350}}>
      <div className="ui bottom attached small yellow message">
      
        <p>{message}</p>
        <i className="close icon"></i>
      </div>
    </div>
  );
};

export default Announcement;