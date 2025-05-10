import React from 'react';
import {
  Divider,
  Grid,
  Header,
  Image,
  Segment,
  Item, // Added Item for structuring posts
} from 'semantic-ui-react';
import bp from '../images/bp-crop.jpg';
import colin from '../images/colin.jpg';

// Define announcements as an array of objects
// We can add a 'season' property to each announcement later if needed for filtering
const allAnnouncements = [
  {
    id: '20250418',
    season: '2025',
    date: '4/18/2025',
    title: 'Signup and TeamBuilder is live!',
    author: 'The pool team',
    authorImage: bp,
    content: [
      "You can now register for an account and create your team! You will be able to update your team until puck drop on Saturday.",
      "If anyone has any trouble submitting their team, please reach out to us as soon as possible. Any other feedback is very welcome."
    ]
  },
  {
    id: '20250417',
    season: '2025',
    date: '4/17/2025',
    title: 'Finishing Touches Being Applied to the App!',
    author: 'Colin',
    authorImage: colin, // Assuming Colin uses the same image for now, or this can be dynamic
    content: [
      "Hi all,",
      "Thanks for your patience while the TeamBuilder module and sign-up service is finalized. Expect to see this live later today, and you can begin creating your roster!",
      <>Also be sure to carry your trash talk over to the Discord group: <a href='https://discord.gg/GZQ4AWnv39'>https://discord.gg/GZQ4AWnv39</a><br />Discord works on iPhone and Android through their respective App Stores as well as PC and Mac via website (<a href='https://discord.com/'>https://discord.com/</a>)</>
    ]
  },
  {
    id: '20240608',
    season: '2024',
    date: '6/8/2024',
    title: "Week 6 Update - End of Conference Finals/Start of Stanley Cup Finals",
    author: 'BP',
    authorImage: bp,
    content: [
      "Hi all,",
      "Another round of hockey with 2 series of action-packed, nail biting hockey! Now we are onto the true battle of Lord Stanley McDavid's Oilers vs Tkachuk's Cats. Many teams remain strong in the pool this year given most entries included Oilers selections. Unsurprisingly, McDavid was the most commonly selected player at 112. Matthew Como, Mark Jones, Brady Ferguson, Caleb Ijzerman, Patrick Sokolowski, and Austin Ward all continue to battle it out for the top spot as they all currently are within 4 pts of the lead. Como holds the lead at 288 pts.",
      "Mike Johnson, Jason Chen, and yours truly lead the league amongst most players remaining with 11/16, followed by Caleb Ijerzman & Shon Noda at 10/16 players remaining. I will be giving a few more updates this series, as we have a nail biter of a finish this year!",
      <>Also be sure to carry your trash talk over to the Discord group: <a href='https://discord.gg/GZQ4AWnv39'>https://discord.gg/GZQ4AWnv39</a><br />Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website (<a href='https://discord.com/'>https://discord.com/</a>)</>,
      "Enjoy tonight!"
    ]
  },
  {
    id: '20240522',
    season: '2024',
    date: '5/22/2024',
    title: "Week 4 Update - End of Semi Finals",
    author: 'BP',
    authorImage: bp,
    content: [
      "Hi all,",
      "Another exhilarating round of hockey, ending with the most exciting series being Vancouver and Edmonton. Like many years, for now, we enter the conference finals with not a single entry still having all 16 players still competing in the playoffs. Paul Rothfischer is the sole competitor who has 15/16 of their players still competing, with a handful of competitors with 13 and 14/16. Average remaining players per an entry stands at 9/16 which is slightly below previous years when entering into the conference finals.",
      "Brady Ferguson remains in the lead with 229 points followed by Mark Jones with 226 points. The top 11 competitors all have 10-12 remaining players in the pool which will mean we will have a tight fight for the pot! For more in-depth stats on the pool and standings check out the website listed below:",
      "Looking forward to more high-scoring, competitive hockey ahead of us!",
      "Cheers!"
    ]
  },
  {
    id: '20240511',
    season: '2024',
    date: '5/11/2024',
    title: "Week 3 Update - End of Quarter Finals",
    author: 'BP',
    authorImage: bp,
    content: [
      "Hi all,",
      "And here we are onto round 2 of the playoffs... Based on the entirety of entries all eliminated teams had the lowest number of players selected. A total of 40 of the entries had all 16 of their players advance to the semi finals. This is a much higher than the last 5+ years. It's safe to say so far we have had somewhat of a predictable playoffs. Nevertheless, plenty of exhilarating hockey! As we continue to progress through the playoffs we will see a widening of the standings... Mark Jones leads the way with 177 pts only 11 pts away from what would be the current 'Perfectly Composed Entry.' Kris Negus holds sole position of 2nd, while Dave Shepherd and Brady Ferguson are tied for 3rd playce with 174 pts.",
      "It's still anyone's pot! Looking forward to an action packed weekend of hockey and with what's on the docket we are certain to see some high scoring matches!",
      <><b>Discord Channel:</b> If you have yet to join our Discord channel, please take the time to do so to connect with other competitors of the pool! This is a chat group channel fully committed towards this pool and playoff hockey!<br /><b>Discord Channel Link:</b> <a href='https://discord.gg/GZQ4AWnv39'>https://discord.gg/GZQ4AWnv39</a><br />Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website (<a href='https://discord.com/'>https://discord.com/</a>)</>,
      <><b>Payment:</b> Tardy competitors please EMT ASAP to: brianpark08@hotmail.com</>,
      "Cheers!"
    ]
  },
  {
    id: '20240501',
    season: '2024',
    date: '5/1/2024',
    title: "Week 1.5 Update",
    author: 'BP',
    authorImage: bp,
    content: [
      "Hi all,",
      "Another dramatic week of playoff hockey has unraveled and some eliminations have transpired!.... This is where the pool begins to get interesting. As the number of teams remaining in the playoffs reduces, we begin to have a more clear vision of the standings in our pool. Historically speaking entries which had the majority (85% or more) of their players reach atleast the Conference Finals, were a contender for a cut of the winnings. In the meantime.... A shoutout to new-to-the-pool, Nick DeMeyer who holds sole possession of 1st place by 1 point. Followed by Poolie veterans Brad Gutsche and David Shepherd, and three way tie for 4th place amongst Bryan Hoy, Dave Murphy, and Ryan Wilton. Well done fellas!",
      "Website: Please Note, my previous email mentioned that Website developer and 19-year long poolie, Colin Stuart was working out one remaining item which was integrating OT Losses into everyone's totals. As of three days ago that has been updated and reflected in the standings. Website is in full functioning speed! Please refer to it for ongoing standings updates, statistical insights and further analysis on pool entry analysis: BP's 18th Annual Hockey Pool (bps-annual-hockey-pool.netlify.app)",
      <><b>Discord Channel:</b> If you have yet to join our Discord channel, please take the time to do so to connect with other competitors of the pool! This is a chat group channel fully committed towards this pool and playoff hockey!<br /><b>Discord Channel Link:</b> <a href='https://discord.gg/GZQ4AWnv39'>https://discord.gg/GZQ4AWnv39</a><br />Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website (<a href='https://discord.com/'>https://discord.com/</a>)</>,
      <><b>Payment:</b> Thank you to everyone who promptly sent their pool entry fee. If you are one of the remaining who hasn't done so, please send as soon as possible to: brianpark08@hotmail.com</>,
      <><b>Comments & Suggestions:</b> I'll repeat this throughout the playoffs, but please provide comments, suggestions, insights and anything else you'd like to see for the pool!</>,
      "Looking forward to some more quality playoff hockey!",
      "Cheers,"
    ]
  },
  {
    id: '20240425',
    season: '2024',
    date: '4/25/2024',
    title: "Week 0.5 Update",
    author: 'BP',
    authorImage: bp,
    content: [
      "Hello everyone!",
      "Another year and another overwhelming amount of entries into the pool! I am thrilled to announce we have crushed last year's all time record for entries (122 entries) with a whopping 143 entries! Thank you all for being a part of this fast growing playoff pool! Welcoming all new members and returnees! We are in for another year of unpredictable hockey results. There has been an ongoing trend of underdog wins and surprises since the 2019 St. Louis Blues cup run! With player selections coming from 15/16 teams there is quite the spread of predictions as to which teams will meet in the finals! 2024 is bound to be action packed with a surge of high scoring affairs!",
      <h5>Update & Issues and Resolutions for the Future</h5>,
      "I am sending this note out as precursor message for tomorrow's first official update and release of the website. I know there is alot of excitement to see how the standings are and where the selections all ended up amongst the group as a whole. Colin Stuart, Alan Shields and myself have been working hard to ensure we can provide the official website with all the standings as soon as possible. Unfortunately, Colin and Alan discovered that the coding that was linked up to NHL.com's player stats had all been altered resulting in a full rebuild. This has led to a few lengthy nights and early mornings (including this evening). Fortunately, the issues have been resolved and we are now just having the entries coded into the website throughout today. We expect all teams to be populated into the website before puck drop today. At that time I will follow up with another email providing the website link.",
      "With these initial webpage issues, we have mapped them out to be ready for future years. In addition to this, we will be installing a spot on the page where everyone can submit their entries which will be more efficient for both people submitting the entries and the organizers. We will be working on this installation immediately following the completion of this year's pool.",
      <h5>Team Lists and Prior Year Standings</h5>,
      "In the meantime, I am pleased to circulate out the team entries and competitor names for this year's playoff pool as well as the Excel stats & standings workbook from previous years (NOTE this 2022's as last year was our first year we migrated to a website)... Just to show you how far we have come!",
      "Please let me know if you have any questions or comments. Looking forward to circulating the website out as soon as possible tomorrow (Thursday)!",
      "Cheers!"
    ]
  },
  {
    id: '20230502',
    season: '2023',
    date: '5/2/23',
    title: "End of Quarterfinals",
    author: 'BP', // Assuming BP, adjust if needed
    authorImage: bp,
    content: [
      "2 Weeks in and we have witnessed some incredible hockey... Charles Barkley was one to admit the NHL is putting on more entertaining games than the NBA, and he sure as right... With 3, 7 game series' and a few 6 game series' most of the action was close.... But best of all is the upsets! This is what makes NHL playoffs exciting. This is what separates the NHL playoffs from other major pro sports... At this period of hockey any team can win. We witnessed this over the last two days where two of the heavy underdogs took out the 65 win Boston Bruins and defending Stanley Cup champions.",
      "No one expected this... Ok maybe according to a couple people in our pool they may have expected Florida to get by, but no one expected Seattle (0 Seattle players selected amongst the 123 entries from the pool). Along with these upsets we witnessed the 'Over-Underdog,' New Jersey Devils and Toronto Maple Leafs take out Stanley Cup favorites NYR and TBL. Much of this came to surprise the group and we now enter into the semi finals with only 2/123 entries having all 16 of their players! This is the least number of full rosters entering into the semis in 18 years. Gotta love playoff hockey. Average number of players remaining per an entry is now at 6/16... Wow...",
      "Congratulations to Mike Johnson who closed out the quarterfinals as the leader (128 pts), followed right behind Jim Veysey (127 pts) and Alan Shields (125 pts). Watch for Justin Denis and Tristan Burnette who are the two remaining competitors who have all 16 of their players still competing.",
      "Who would have thought Akira Schmid would be the MVP of the Devils and arguably the entire first round? No one in our pool. This is where the in-depth stats on the webpage will begin to get interesting."
    ]
  },
  {
    id: '20230420',
    season: '2023',
    date: '4/20/23',
    title: "WELCOME all new competitors!",
    author: 'BP', // Assuming BP
    authorImage: bp,
    content: [
      "Wow.... What a start to the playoffs! On top of that, I'm pleased to announce we had an overwhelming number of entries this year, obliterating the former record number of entries (85 entries 2022) with a total of 122 entries!",
      "I am pleased to have you join our pool that has been consistently growing for 18 years. All of you joined during a transitional year for the pool as we phased out the robust excel spreadsheet supported by macros and formulas and have migrated to a customized webpage. This webpage provides in depth stats surrounding player selections. A big thank you to <b>Colin Stuart</b> and <b>Alan Shields</b> who are the masterminds & coders for building the website. Along with the new website we have created a Discord channel to be used by all the competitors for smack talk, updates, memes, and general chat.",
      <>Congrats to <b>Gary McIvor</b> Who has taken the early lead with 41 points.</>
    ]
  },
  {
    id: '20230417',
    season: '2023',
    date: '4/17/23',
    title: "Welcome to BP's 18th Annual Playoff Hockey Pool!",
    author: 'BP', // Assuming BP
    authorImage: bp,
    content: [
      <>This app is currently in beta and we would love any feedback you have. Bugs, suggestions, or cool ideas are all welcome. Please pass your thoughts on to BP or leave a comment on the <a href='https://discord.gg/GZQ4AWnv39'>Discord</a> and we will do our best to make this fun to use.</>
    ]
  }
];

const CommissionersCorner = ({ season }) => {
  // Filter announcements to display only those matching the current season prop
  // If no season prop is passed, or for future toggle, we might show all or a default.
  // For now, strictly filter by the passed 'season'.
  const announcementsToDisplay = season
    ? allAnnouncements.filter(announcement => announcement.season === season)
    : allAnnouncements; // Fallback to show all if season prop is not provided (e.g. during initial load or error)
  // Or you could default to an empty array: : [];

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column width={2} />
            <Grid.Column width={12} textAlign='center'>
              <Header size='medium' color='blue' style={{ whiteSpace: 'nowrap' }}>
                Commissioner's Corner
              </Header>
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment attached='bottom' className={'expandedStyle'}>
        <Item.Group divided>
          {announcementsToDisplay.map((announcement) => (
            <Item key={announcement.id}>
              <Item.Image avatar size='mini' src={announcement.authorImage} />
              <Item.Content>
                <Item.Header as='h4'>
                  <span role='img' aria-label='loudspeaker'>📢</span>{' '}
                  {/* Format date to user's locale */}
                  {new Date(announcement.date).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'numeric', day: 'numeric'
                  })}{' '}
                  - {announcement.title}
                </Item.Header>
                <Item.Meta>By: {announcement.author}</Item.Meta>
                <Item.Description>
                  {announcement.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </Item.Description>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
        {announcementsToDisplay.length === 0 && (
          <p>No announcements at this time. Check back later!</p>
        )}
      </Segment>
    </Segment.Group>
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 6/8/2024 - Week 6 Update - End of Conference Finals/Start of Stanley Cup Finals
    //     </h4>
    //     <h5>
    //       Hi all,
    //     </h5>
    //     <p>
    //       Another round of hockey with 2 series of action-packed, nail biting hockey! Now we are onto the true battle of Lord Stanley McDavid's Oilers vs Tkachuk's Cats. Many teams remain strong in the pool this year given most entries included Oilers selections. Unsurprisingly, McDavid was the most commonly selected player at 112. Matthew Como, Mark Jones, Brady Ferguson, Caleb Ijzerman, Patrick Sokolowski, and Austin Ward all continue to battle it out for the top spot as they all currently are within 4 pts of the lead. Como holds the lead at 288 pts.        </p>
    //     <p>
    //       Mike Johnson, Jason Chen, and yours truly lead the league amongst most players remaining with 11/16, followed by Caleb Ijerzman & Shon Noda at 10/16 players remaining. I will be giving a few more updates this series, as we have a nail biter of a finish this year!         </p>
    //     <p>
    //       Also be sure to carry your trash talk over to the Discord group:https://discord.gg/GZQ4AWnv39
    //       <br></br>
    //       Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website ( https://discord.com/ )        </p>
    //     <p>
    //       Enjoy tonight! - BP
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 5/22/2024 - Week 4 Update - End of Semi Finals
    //     </h4>
    //     <h5>
    //       Hi all,
    //     </h5>
    //     <p>
    //       Another exhilarating round of hockey, ending with the most exciting series being Vancouver and Edmonton. Like many years, for now, we enter the conference finals with not a single entry still having all 16 players still competing in the playoffs. Paul Rothfischer is the sole competitor who has 15/16 of their players still competing, with a handful of competitors with 13 and 14/16. Average remaining players per an entry stands at 9/16 which is slightly below previous years when entering into the conference finals.
    //     </p>
    //     <p>
    //       Brady Ferguson remains in the lead with 229 points followed by Mark Jones with 226 points. The top 11 competitors all have 10-12 remaining players in the pool which will mean we will have a tight fight for the pot! For more in-depth stats on the pool and standings check out the website listed below:
    //     </p>
    //     <p>
    //       Looking forward to more high-scoring, competitive hockey ahead of us!
    //     </p>
    //     <p>
    //       Cheers! - BP
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 5/11/2024 - Week 3 Update - End of Quarter Finals
    //     </h4>
    //     <h5>
    //       Hi all,
    //     </h5>
    //     <p>
    //       And here we are onto round 2 of the playoffs... Based on the entirety of entries all eliminated teams had the lowest number of players selected. A total of 40 of the entries had all 16 of their players advance to the semi finals. This is a much higher than the last 5+ years. It's safe to say so far we have had somewhat of a predictable playoffs. Nevertheless, plenty of exhilarating hockey! As we continue to progress through the playoffs we will see a widening of the standings... Mark Jones leads the way with 177 pts only 11 pts away from what would be the current 'Perfectly Composed Entry.' Kris Negus holds sole position of 2nd, while Dave Shepherd and Brady Ferguson are tied for 3rd playce with 174 pts.
    //     </p>
    //     <p>
    //       It's still anyone's pot! Looking forward to an action packed weekend of hockey and with what's on the docket we are certain to see some high scoring matches!
    //     </p>
    //     <p>
    //       <b>Discord Channel:</b> If you have yet to join our Discord channel, please take the time to do so to connect with other competitors of the pool! This is a chat group channel fully committed towards this pool and playoff hockey!
    //       <br></br>
    //       <b>Discord Channel Link:</b> https://discord.gg/GZQ4AWnv39
    //       <br></br>
    //       Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website ( https://discord.com/ )
    //     </p>
    //     <b>Payment:</b> Tardy competitors please EMT ASAP to: brianpark08@hotmail.com
    //     <p>
    //       Cheers! - BP
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 5/1/2024 - Week 1.5 Update
    //     </h4>
    //     <h5>
    //       Hi all,
    //     </h5>
    //     <p>
    //       Another dramatic week of playoff hockey has unraveled and some eliminations have transpired!.... This is where the pool begins to get interesting. As the number of teams remaining in the playoffs reduces, we begin to have a more clear vision of the standings in our pool. Historically speaking entries which had the majority (85% or more) of their players reach atleast the Conference Finals, were a contender for a cut of the winnings. In the meantime.... A shoutout to new-to-the-pool, Nick DeMeyer who holds sole possession of 1st place by 1 point. Followed by Poolie veterans Brad Gutsche and David Shepherd, and three way tie for 4th place amongst Bryan Hoy, Dave Murphy, and Ryan Wilton. Well done fellas!
    //     </p>
    //     <p>

    //       Website: Please Note, my previous email mentioned that Website developer and 19-year long poolie, Colin Stuart was working out one remaining item which was integrating OT Losses into everyone's totals. As of three days ago that has been updated and reflected in the standings. Website is in full functioning speed! Please refer to it for ongoing standings updates, statistical insights and further analysis on pool entry analysis:  BP's 18th Annual Hockey Pool (bps-annual-hockey-pool.netlify.app)
    //     </p>
    //     <p>
    //       <b>Discord Channel:</b> If you have yet to join our Discord channel, please take the time to do so to connect with other competitors of the pool! This is chat group channel fully committed towards this pool and playoff hockey!
    //       <br></br>
    //       <b>Discord Channel Link:</b> https://discord.gg/GZQ4AWnv39
    //       <br></br>
    //       Discord works on Iphone and Android through their respective App Stores as well as PC and Mac via website ( https://discord.com/ )
    //     </p>
    //     <p>
    //       <b>Payment:</b> Thank you to everyone who promptly sent their pool entry fee. If you are one of the remaining who hasn't done so, please send as soon as possible to: brianpark08@hotmail.com
    //     </p>
    //     <p>
    //       <b>Comments & Suggestions:</b> I'll repeat this throughout the playoffs, but please provide comments, suggestions, insights and anything else you'd like to see for the pool!
    //     </p>
    //     <p>
    //       Looking forward to some more quality playoff hockey!
    //     </p>
    //     <p>
    //       Cheers,
    //       BP
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 4/25/2024 - Week 0.5 Update
    //     </h4>
    //     <h5>
    //       Hello everyone!
    //     </h5>
    //     <p>
    //       Another year and another overwhelming amount of entries into the pool! I am thrilled to announce we have crushed last year's all time record for entries (122 entries) with a whopping 143 entries! Thank you all for being a part of this fast growing playoff pool! Welcoming all new members and returnees! We are in for another year of unpredictable hockey results. There has been an ongoing trend of underdog wins and surprises since the 2019 St. Louis Blues cup run! With player selections coming from 15/16 teams there is quite the spread of predictions as to which teams will meet in the finals! 2024 is bound to be action packed with a surge of high scoring affairs!
    //     </p>
    //     <h5>
    //       Update & Issues and Resolutions for the Future
    //     </h5>
    //     <p>
    //       I am sending this note out as precursor message for tomorrow's first official update and release of the website. I know there is alot of excitement to see how the standings are and where the selections all ended up amongst the group as a whole. Colin Stuart, Alan Shields and myself have been working hard to ensure we can provide the official website with all the standings as soon as possible. Unfortunately, Colin and Alan discovered that the coding that was linked up to NHL.com's player stats had all been altered resulting in a full rebuild. This has led to a few lengthy nights and early mornings (including this evening). Fortunately, the issues have been resolved and we are now just having the entries coded into the website throughout today. We expect all teams to be populated into the website before puck drop today. At that time I will follow up with another email providing the website link.
    //     </p>
    //     <p>
    //       With these initial webpage issues, we have mapped them out to be ready for future years. In addition to this, we will be installing a spot on the page where everyone can submit their entries which will be more efficient for both people submitting the entries and the organizers. We will be working on this installation immediately following the completion of this year's pool.
    //     </p>
    //     <h5>
    //       Team Lists and Prior Year Standings
    //     </h5>
    //     <p>
    //       In the meantime, I am pleased to circulate out the team entries and competitor names for this year's playoff pool as well as the Excel stats & standings workbook from previous years (NOTE this 2022's as last year was our first year we migrated to a website)... Just to show you how far we have come!
    //     </p>
    //     <p>
    //       Please let me know if you have any questions or comments. Looking forward to circulating the website out as soon as possible tomorrow (Thursday)!
    //     </p>
    //     <p>
    //       Cheers! -BP
    //     </p>
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 5/2/23 - End of Quarterfinals
    //     </h4>
    //     <p>
    //       2 Weeks in and we have witnessed some incredible hockey... Charles Barkley was one to admit the NHL is putting on more entertaining games than the NBA, and he sure as right... With 3, 7 game series' and a few 6 game series' most of the action was close.... But best of all is the upsets! This is what makes NHL playoffs exciting. This is what separates the NHL playoffs from other major pro sports... At this period of hockey any team can win. We witnessed this over the last two days where two of the heavy underdogs took out the 65 win Boston Bruins and defending Stanley Cup champions.
    //     </p>
    //     <p>
    //       No one expected this... Ok maybe according to a couple people in our pool they may have expected Florida to get by, but no one expected Seattle (0 Seattle players selected amongst the 123 entries from the pool). Along with these upsets we witnessed the 'Over-Underdog,' New Jersey Devils and Toronto Maple Leafs take out Stanley Cup favorites NYR and TBL. Much of this came to surprise the group and we now enter into the semi finals with only 2/123 entries having all 16 of their players! This is the least number of full rosters entering into the semis in 18 years. Gotta love playoff hockey. Average number of players remaining per an entry is now at 6/16... Wow...
    //     </p>
    //     <p>
    //       Congratulations to Mike Johnson who closed out the quarterfinals as the leader (128 pts), followed right behind Jim Veysey (127 pts) and Alan Shields (125 pts). Watch for Justin Denis and Tristan Burnette who are the two remaining competitors who have all 16 of their players still competing.
    //     </p>
    //     <p>
    //       Who would have thought Akira Schmid would be the MVP of the Devils and arguably the entire first round? No one in our pool. This is where the in-depth stats on the webpage will begin to get interesting.
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 4/20/23 - WELCOME all new competitors!
    //     </h4>
    //     <p>
    //       Wow.... What a start to the playoffs! On top of that, I'm pleased to announce we had an overwhelming number of entries this year, obliterating the former record number of entries (85 entries 2022) with a total of 122 entries!
    //       I am pleased to have you join our pool that has been consistently growing for 18 years. All of you joined during a transitional year for the pool as we phased out the robust excel spreadsheet supported by macros and formulas and have migrated to a customized webpage. This webpage provides in depth stats surrounding player selections. A big thank you to <b>Colin Stuart</b> and <b>Alan Shields</b> who are the masterminds & coders for building the website. Along with the new website we have created a Discord channel to be used by all the competitors for smack talk, updates, memes, and general chat.
    //       Congrats to <b>Gary McIvor</b> Who has taken the early lead with 41 points.
    //     </p>
    //     <Divider />
    //     <h4>
    //       <span role='img' aria-label='loudspeaker'>📢</span> 4/17/23 - Welcome to BP's 18th Annual Playoff Hockey Pool!
    //     </h4>
    //     <p>
    //       This app is currently in beta and we would love any feedback you have. Bugs, suggestions, or cool ideas are all welcome. Please pass your thoughts on to BP or leave a comment on the <a href='https://discord.gg/GZQ4AWnv39'>Discord</a> and we will do our best to make this fun to use.
    //     </p>
    //     {/* <div style={{ position: 'fixed', right: 5, bottom: 5, zIndex: 100, width: 500, maxWidth: '97%' }}>
    //       <div className={`ui bottom attached small yellow message`}>
    //         <h4>
    //           <span role='img' aria-label='sparkles'>✨</span> New Features:
    //         </h4>
    //         <ul>
    //           <li>4/28/23 - Interface changes. Menu navigation and separation of features across pages. Hopefully mobile viewing will be a little more digestible now.</li>
    //           <li>4/25/23 - Site loading has been speed up ~20x - no more waiting for standings to populate.</li>
    //           <li>4/24/23 - Quickly find your team's place and point total in the standings with the new search feature in the standings list.</li>
    //         </ul>
    //         <h4>
    //           <span role='img' aria-label='bugs'>🐛</span> Known Issues:
    //         </h4>
    //         <ul>
    //           <li>Some weirdness with older seasons.</li>
    //         </ul>
    //         <h4>
    //           <span role='img' aria-label='notebook'>📓</span> Planned:
    //         </h4>
    //         <ul>
    //           <li>More frequent stat updates. Currently stats are refreshed ~every hr.</li>
    //         </ul>
    //       </div>
    //     </div > */}
    //   </div>
    // </div >

  );
};

export default CommissionersCorner;