import React from 'react';
import { Segment, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react';
import { useDevTools } from '../context/DevToolsContext';
import useCreatePlayer from '../hooks/useCreatePlayer';

const DevTools = ({ regularSeasonStats }) => {
  const { devTools, updateDevTools, resetDevTools } = useDevTools();
  const { postData } = useCreatePlayer();

  const handleTestEliminatedChange = (_, { checked }) => {
    updateDevTools('testEliminatedTeams', checked);
  };

  const handleScoresDateChange = (_, { value }) => {
    updateDevTools('testScoresDate', value || null);
  };

  const handleTeamAdd = (team) => {
    const teams = devTools.eliminatedTeams;
    if (team && !teams.includes(team)) {
      updateDevTools('eliminatedTeams', [...teams, team]);
    }
  };

  const handleTeamRemove = (index) => {
    updateDevTools('eliminatedTeams', devTools.eliminatedTeams.filter((_, i) => i !== index));
  };

  const handlePostAllPlayers = async () => {
    if (!regularSeasonStats) return;
    const goalies = regularSeasonStats.goalieStats.map((goalie) => goalie.playerId);
    const skaters = regularSeasonStats.skaterStats.map((skater) => skater.playerId);
    const allPlayers = [...goalies, ...skaters];

    for (const player of allPlayers) {
      const playerData = { id: String(player) };
      try {
        await postData(playerData);
        console.log(`Successfully posted player: ${player}`);
      } catch (error) {
        console.error(`Failed to post player: ${player}`, error);
      }
    }
  };

  return (
    <Segment padded>
      <Header as='h2'>🛠️ Dev Tools</Header>

      <Form>
        <div style={{ marginBottom: '20px' }}>
          <Header as='h4'>Eliminated Teams Override</Header>
          <Checkbox
            label='Enable eliminated teams testing'
            checked={devTools.testEliminatedTeams}
            onChange={handleTestEliminatedChange}
          />
          <p style={{ color: '#666', fontSize: '0.9em', marginTop: '8px' }}>
            When enabled, the selected teams below will be marked as eliminated
          </p>

          {devTools.testEliminatedTeams && (
            <div style={{ marginTop: '12px', paddingLeft: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                {devTools.eliminatedTeams.length > 0 ? (
                  <div>
                    {devTools.eliminatedTeams.map((team, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: '#f5f5f5',
                          marginBottom: '8px',
                          borderRadius: '4px',
                        }}
                      >
                        <span>{team}</span>
                        <Button
                          size='mini'
                          negative
                          onClick={() => handleTeamRemove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999' }}>No teams selected</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Header as='h4'>Live Stats Date Override</Header>
          <Input
            type='date'
            value={devTools.testScoresDate || ''}
            onChange={handleScoresDateChange}
            placeholder='YYYY-MM-DD'
            style={{ width: '200px' }}
          />
          <p style={{ color: '#666', fontSize: '0.9em', marginTop: '8px' }}>
            Set a specific date to test live stats (leave blank for today)
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Header as='h4'>Player Creator</Header>
          <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '12px' }}>
            Post all active NHL players to the database
          </p>
          <Button
            primary
            onClick={handlePostAllPlayers}
            disabled={!regularSeasonStats}
          >
            Post All Players
          </Button>
          <p style={{ color: '#666', fontSize: '0.85em', marginTop: '8px' }}>
            This will post all skaters and goalies from the current season
          </p>
        </div>
      </Form>

      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p style={{ fontSize: '0.85em', color: '#666', margin: 0 }}>
          <strong>Note:</strong> All dev settings are persisted to localStorage and will survive page reloads.
          Remember to disable these before the app goes to production!
        </p>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Button
          color="red"
          onClick={resetDevTools}
          content="Reset to Defaults"
        />
      </div>
    </Segment>
  );
};

export default DevTools;
