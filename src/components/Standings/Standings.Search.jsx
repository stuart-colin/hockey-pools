import React, { useState, useEffect } from 'react';
import {
  Icon,
  Input,
  List,
  Message,
} from 'semantic-ui-react';
import getOrdinal from '../../utils/getOrdinals';

const StandingsSearch = ({ loading, rankedRosters, placeholder, onSearchResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!loading) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredUsers(
        rankedRosters.filter(user =>
          Boolean(user.owner?.id) &&
          typeof user.owner?.name === 'string' &&
          user.owner.name.toLowerCase().includes(lowerSearchTerm)
        )
      );
    }
  }, [searchTerm, rankedRosters, loading]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const searchedUserResults = filteredUsers
    .slice(0, 5)
    .map(user => (
      <List.Item
        key={user.owner.id}
        onClick={() => onSearchResultClick && onSearchResultClick(user.owner.id)}
        style={{ cursor: 'pointer', padding: '5px 0', textAlign: 'left' }}
      >
        <strong>{user.owner.name}</strong>
        {`: ${user.rank}${getOrdinal(user.rank)} place — ${user.points} points — ${user.playersRemaining}/16 players`}
      </List.Item>
    ));

  return (
    <div style={{ padding: '15px 0 0' }}>
      <Input
        error={!filteredUsers.length}
        fluid
        icon={
          searchTerm ? (
            <Icon name='times' link onClick={handleClearSearch} />
          ) : (
            'users'
          )
        }
        iconPosition='left'
        onChange={e => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        type='text'
        value={searchTerm}
      />
      {searchTerm.length > 0 && filteredUsers.length > 0 && (
        <Message color='blue'>
          <List animated divided relaxed selection>
            {searchedUserResults}
          </List>
        </Message>
      )}
    </div>
  );
};

export default StandingsSearch;