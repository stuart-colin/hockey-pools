import React, { useState } from 'react';

// const message = 'Currently, players who were selected but did not appear in any playoff games are breaking the site due to no data being available for them. Until I fix this logic, they will be replaced by a player who appeared but did not accrue any points. For example, Frederik Andersen and Devan Dubnyk (?!) have been temporarily replaced with Vitek Vanecek';
const message = 'Welcome to BP\'s 17th Annual Playoff Hockey Pool! This app is currently in beta and we would love any feedback you have. Bugs, suggestions, or cool ideas are all welcome. Please pass your thoughts on to BP and we will do our best to make this fun to use.';

const Announcement = () => {
  const [closeAnnouncement, setCloseAnnouncement] = useState(false);

  const close = () => {
    if (closeAnnouncement) {
      return "hidden";
    }
  }

  return (
    <div style={{ position: "fixed", right: 5, bottom: 5, zIndex: 100, width: 500, maxWidth: '97%' }}>
      <div className={`ui bottom attached small yellow message ${close()}`}>

        <p>{message}</p>
        <i className="close icon" onClick={() => setCloseAnnouncement(true)}></i>
      </div>
    </div >
  );
};

export default Announcement;