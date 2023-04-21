import React, { useState } from 'react';

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

        <p>Welcome to BP's 18th Annual Playoff Hockey Pool! This app is currently in beta and we would love any feedback you have. Bugs, suggestions, or cool ideas are all welcome. Please pass your thoughts on to BP or leave a comment on the <a href='https://discord.gg/GZQ4AWnv39'>Discord</a> and we will do our best to make this fun to use.</p>
        <p>
          Known Issues:
          <ul>
            <li>Slow loading - working to improve this as soon as possible!</li>
          </ul >
          Planned:
          <ul>
            <li>Realitime stats. Currently stats are refreshed every ~1hr.</li>
            <li>User search so you can find your team quicker.</li>
          </ul>
        </p>

        <i className="close icon" onClick={() => setCloseAnnouncement(true)}></i>
      </div>
    </div >
  );
};

export default Announcement;