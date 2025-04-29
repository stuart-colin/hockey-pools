import React, { useState, useEffect } from "react";
import { Flag, Grid, Icon, Segment, Header, List, Dimmer, Loader, Button } from "semantic-ui-react";
import Search from "./Search";
import StandingsItem from "./StandingsItem";
import "../css/customStyle.css";

const StandingsList = ({ users, season }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!users.loading) setLoading(false);
  }, [users]);

  function setRanks(roster) {
    let currentCount = -1,
      currentRank = 0,
      stack = 1;
    for (let i = 0; i < roster.length; i++) {
      const result = roster[i];
      if (currentCount !== result["points"]) {
        currentRank += stack;
        stack = 1;
      } else {
        stack++;
      }
      result["rank"] = currentRank;
      currentCount = result["points"];
    }
  }

  const sortedRosters = [].concat(users.rosters).sort((a, b) => (a.points > b.points ? -1 : 1));
  setRanks(sortedRosters);

  const pot = sortedRosters.length * 20;

  // const winnings = [
  //   ' — $' + (pot * 0.65).toFixed(2),
  //   ' — $' + (pot * 0.14).toFixed(2),
  //   ' — $' + (pot * 0.08).toFixed(2),
  //   ' — $' + (pot * 0.05).toFixed(2),
  //   ' — $' + (pot * 0.04).toFixed(2),
  //   ' — $' + (pot * 0.02).toFixed(2),
  //   ' — $' + (pot * 0.02).toFixed(2),
  // ];

  // const winningsDistro = sortedRosters.map((user, index) => {
  //   return (
  //     user.rank <= 7 ? winnings[user.rank - 1] : ''
  //   )
  // })

  const renderedList = sortedRosters.map((user, index) => (
    <StandingsItem
      user={user}
      key={index}
      index={index}
      poolSize={sortedRosters.length}
    />
  ));

  return (
    <Segment.Group>
      {/* Header Segment */}
      <Segment attached="top" >
        <Grid textAlign="center">
          <Grid.Row columns={3}>
            {/* Toggle Visibility Button */}
            <Grid.Column width={2}>
              <Icon
                circular
                color="blue"
                name={visible ? "chevron up" : "chevron down"}
                onClick={() => setVisible(!visible)}
                style={{ marginRight: "10px" }}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              {/* Season Header */}
              <Header as="h3" color="blue" textAlign="center" style={{ flex: 1 }}>
                {season} Standings
              </Header>
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Row>
              Pot: ${pot} <Flag name="canada" />
            </Grid.Row>
          </Grid.Row>
          {/* Search Component */}
          <Grid.Row columns={12}>
            <Search users={users} placeholder={"Search Rosters"} />
          </Grid.Row>
        </Grid>
      </Segment>

      {/* Content Segment */}
      <Segment
        attached="bottom"
        className={visible ? "expandedStandingsStyle" : "collapsedStyle"}
      >
        {loading ? (
          <Dimmer active inverted>
            <Loader>Loading Standings...</Loader>
          </Dimmer>
        ) : (
          <List divided relaxed selection>{renderedList}</List>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default StandingsList;