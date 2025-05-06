import React, { useState, useEffect } from 'react';
import { Input, Message } from 'semantic-ui-react';
import getOrdinal from '../utils/getOrdinals';

const Search = ({ loading, rankedRosters, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!loading) {
      setFilteredUsers(rankedRosters.filter(user => user.owner && user.owner.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, rankedRosters, loading]); // Add rankedRosters and loading to dependencies

  const searchedUser = filteredUsers.map(user => (
    <div key={user.owner.id}>{user.owner.name} - {user.rank}{getOrdinal(user.rank)} place, {user.points} points </div>
  ));

  const labelDisplay = () => {
    if (!searchTerm.length || !filteredUsers.length) {
      return { display: 'none' }
    }
  }

  return (
    <div>
      <Input
        icon='users'
        iconPosition='left'
        type='text'
        placeholder={placeholder}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Message
        color='blue'
        style={labelDisplay()}
      >
        <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
          {searchedUser}
        </div>
      </Message>
    </div>
  );
};

export default Search;