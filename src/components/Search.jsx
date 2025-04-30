import React, { useState, useEffect } from 'react';
import { Input, Message } from 'semantic-ui-react';
import getOrdinal from '../utils/getOrdinals';

const Search = ({ users, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!users.loading) {
      setFilteredUsers(users.rosters.filter(user => user.roster.owner.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm]);

  const searchedUser = filteredUsers.map(user => (
    <div key={user.roster.owner.id}>{user.roster.owner.name} - {user.rank}{getOrdinal(user.rank)} place, {user.points} points </div>
  ));

  const labelDisplay = () => {
    if (!searchTerm.length || !filteredUsers.length) {
      return { display: 'none' }
    }
  }
  // console.log(filteredUsers)
  // onUserSearch(filteredUsers);

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