import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

const wrapperStyle = {
  margin: '20px',
  textAlign: 'center',
};

const SignInNotice = ({ message, title }) => (
  <Segment.Group>
    <Segment style={wrapperStyle}>
      <Header as='h2' icon>
        <Icon name='user circle' />
        {title}
        <Header.Subheader>
          {message}
        </Header.Subheader>
      </Header>
    </Segment>
  </Segment.Group>
);

export default SignInNotice;
