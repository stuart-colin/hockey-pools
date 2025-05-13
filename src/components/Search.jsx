import React, { useState, useEffect } from 'react';
import { Input, Message, Icon } from 'semantic-ui-react';
import getOrdinal from '../utils/getOrdinals';

const Search = ({ loading, rankedRosters, placeholder, onSearchResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null); // New state for hover

  useEffect(() => {
    if (!loading) {
      setFilteredUsers(rankedRosters.filter(user => user.owner && user.owner.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, rankedRosters, loading]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const searchedUserResults = filteredUsers
    .slice(0, 5)
    .map(user => (
      <div
        key={user.owner.id}
        onMouseEnter={() => setHoveredUserId(user.owner.id)}
        onMouseLeave={() => setHoveredUserId(null)}
        onClick={() => onSearchResultClick && onSearchResultClick(user.owner.id)}
        style={{ cursor: 'pointer', padding: '5px 0', textAlign: 'left', marginLeft: '5px' }}
      >
        {hoveredUserId === user.owner.id && (
          <Icon name='arrow right' style={{ marginLeft: '-20px' }} />
        )}
        <strong>{user.owner.name}</strong>
        {`: ${user.rank}${getOrdinal(user.rank)} place — ${user.points} points — ${user.playersRemaining}/16 players`}
      </div>
    ));

  return (
    <div>
      <Input
        icon={
          searchTerm ? (
            <Icon name='times' link onClick={handleClearSearch} />
          ) : (
            'users'
          )
        }
        iconPosition='left'
        type='text'
        placeholder={placeholder}
        onChange={e => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      {searchTerm.length > 0 && filteredUsers.length > 0 && (
        <Message color='blue'>
          {searchedUserResults}
        </Message>
      )}
    </div>
  );
};

export default Search;