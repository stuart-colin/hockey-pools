import React from "react";
import useCreatePlayer from "../hooks/useCreatePlayer";

const PlayerCreator = ({ regularSeasonStats }) => {
  const { postData } = useCreatePlayer(); // Assuming useCreatePlayer provides postData

  const goalies = regularSeasonStats.goalieStats.map((goalie) => goalie.playerId);
  const skaters = regularSeasonStats.skaterStats.map((skater) => skater.playerId);

  const allPlayers = [...goalies, ...skaters]; // Combine goalies and skaters into one array

  const postPlayers = async (players) => {
    for (const player of players) {
      const playerData = { id: String(player) }; // Format as { "id": "playerId" }
      try {
        await postData(playerData); // Post each player to the API
        console.log(`Successfully posted player: ${player}`);
      } catch (error) {
        console.error(`Failed to post player: ${player}`, error);
      }
    }
  };

  return (
    <div>
      <h3>Player Creator</h3>
      <button onClick={() => postPlayers(allPlayers)}>Post All Players</button>
    </div>
  );
};

export default PlayerCreator;