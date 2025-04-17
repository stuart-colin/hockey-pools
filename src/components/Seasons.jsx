import React from "react";
import { List } from 'semantic-ui-react'
import seasons from "../constants/seasons";

const Seasons = ({ onSeasonSelect }) => {

  const renderedSeasons = seasons.seasonList.map((season, index) => {
    return (
      <List.Item
        onClick={() => onSeasonSelect(season.slice())}
        key={index}
      >
        {season === '2024' || season === '2023' || season === '2022' ?
          <List.Header as='a'>
            {season}
          </List.Header>
          : null}
      </List.Item>

    )
  }
  )

  return (
    <div style={{ textAlign: 'center' }}>
      <List horizontal>
        {renderedSeasons}
      </List>
    </div>
  )
}


export default Seasons;