import React from "react";
import { List } from 'semantic-ui-react'
import seasons from "../constants/seasons";

const Seasons = ({ onSeasonSelect }) => {

  const renderedSeasons = seasons.seasonList.map((season, index) => {
    return (
      <div>
        {season === '2023' || '2022' ?
          <List.Item
            onClick={() => onSeasonSelect(season.slice())}
            key={index}
          >
            <List.Header as='a'>
              {season}
            </List.Header>
          </List.Item>
          : null}
      </div>

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