import React, { useState } from 'react';
import { Divider, Icon, Image } from 'semantic-ui-react';
import bp from '../images/bp-crop.jpg'

const Announcement = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className='ui segments'>
      <div className='ui top blue centered attached header' >
        <div className='left aligned column'
          onClick={() => setVisible(!visible)}
          style={{ cursor: 'pointer', position: 'absolute' }}>
          <h3>
            {visible &&
              <Icon
                circular
                color='blue'
                name='chevron up'
              />
            }
            {!visible &&
              <Icon
                circular
                color='blue'
                name='chevron down'
              />
            }
          </h3>
        </div>
        <div className='middle aligned column'>
          <h2>
            Commissioner's Corner
          </h2>
        </div>
      </div>
      <div
        className={
          `ui bottom attached segment
        ${!visible ? 'collapsedStyle' : 'expandedInsightsStyle'}`
        }>
        <Image
          src={bp}
          size='tiny'
          circular
          floated='right'
          verticalAlign='top'
        />
        <h4>
          📢 4/20/23 - WELCOME all new competitors!
        </h4>
        <p>
          Wow.... What a start to the playoffs! On top of that, I'm pleased to announce we had an overwhelming number of entries this year, obliterating the former record number of entries (85 entries 2022) with a total of 122 entries!
          I am pleased to have you join our pool that has been consistently growing for 18 years. All of you joined during a transitional year for the pool as we phased out the robust excel spreadsheet supported by macros and formulas and have migrated to a customized webpage. This webpage provides in depth stats surrounding player selections. A big thank you to <b>Colin Stuart</b> and <b>Alan Shields</b> who are the masterminds & coders for building the website. Along with the new website we have created a Discord channel to be used by all the competitors for smack talk, updates, memes, and general chat.
          Congrats to <b>Gary McIvor</b> Who has taken the early lead with 41 points.
        </p>
        <Divider />
        <h4>
          📢 4/17/23 - Welcome to BP's 18th Annual Playoff Hockey Pool!
        </h4>
        <p>
          This app is currently in beta and we would love any feedback you have. Bugs, suggestions, or cool ideas are all welcome. Please pass your thoughts on to BP or leave a comment on the <a href='https://discord.gg/GZQ4AWnv39'>Discord</a> and we will do our best to make this fun to use.
        </p>
        {/* <div style={{ position: "fixed", right: 5, bottom: 5, zIndex: 100, width: 500, maxWidth: '97%' }}> */}
        <div className={`ui bottom attached small yellow message`}>
          <h4>
            ✨ New Features:
          </h4>
          <ul>
            <li>4/28/23 - Interface changes. Menu navigation and separation of features across pages. Hopefully mobile viewing will be a little more digestible now.</li>
            <li>4/25/23 - Site loading has been speed up ~20x - no more waiting for standings to populate.</li>
            <li>4/24/23 - Quickly find your team's place and point total in the standings with the new search feature in the standings list.</li>
          </ul>
          <h4>
            🐛 Known Issues:
          </h4>
          <ul>
            <li>Some weirdness with older seasons.</li>
          </ul>
          <h4>
            📓 Planned:
          </h4>
          <ul>
            <li>More frequent stat updates. Currently stats are refreshed ~every hr.</li>
          </ul>
        </div>
        {/* </div > */}
      </div>
    </div>

  );
};

export default Announcement;