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
          📢 5/2/23 - End of Quarterfinals
        </h4>
        <p>
          2 Weeks in and we have witnessed some incredible hockey... Charles Barkley was one to admit the NHL is putting on more entertaining games than the NBA, and he sure as right... With 3, 7 game series' and a few 6 game series' most of the action was close.... But best of all is the upsets! This is what makes NHL playoffs exciting. This is what separates the NHL playoffs from other major pro sports... At this period of hockey any team can win. We witnessed this over the last two days where two of the heavy underdogs took out the 65 win Boston Bruins and defending Stanley Cup champions.
        </p>
        <p>
          No one expected this... Ok maybe according to a couple people in our pool they may have expected Florida to get by, but no one expected Seattle (0 Seattle players selected amongst the 123 entries from the pool). Along with these upsets we witnessed the "Over-Underdog," New Jersey Devils and Toronto Maple Leafs take out Stanley Cup favorites NYR and TBL. Much of this came to surprise the group and we now enter into the semi finals with only 2/123 entries having all 16 of their players! This is the least number of full rosters entering into the semis in 18 years. Gotta love playoff hockey. Average number of players remaining per an entry is now at 6/16... Wow...
        </p>
        <p>
          Congratulations to Mike Johnson who closed out the quarterfinals as the leader (128 pts), followed right behind Jim Veysey (127 pts) and Alan Shields (125 pts). Watch for Justin Denis and Tristan Burnette who are the two remaining competitors who have all 16 of their players still competing.
        </p>
        <p>
          Who would have thought Akira Schmid would be the MVP of the Devils and arguably the entire first round? No one in our pool. This is where the in-depth stats on the webpage will begin to get interesting.
        </p>
        <Divider />
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