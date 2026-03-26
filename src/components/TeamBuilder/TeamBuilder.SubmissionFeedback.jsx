import React from 'react';
import { Icon, Message } from 'semantic-ui-react';

/**
 * Displays submission status feedback messages
 */
const SubmissionFeedback = ({ status, onDismiss }) => {
  if (status === 'processing') {
    return (
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Submitting...</Message.Header>
          Your roster is being submitted. Please wait.
        </Message.Content>
      </Message>
    );
  }

  if (status === 'success') {
    return (
      <Message positive onDismiss={onDismiss}>
        <Message.Header>Roster Submission Successful!</Message.Header>
        You may edit your team until the start of the first game of the playoffs.
      </Message>
    );
  }

  if (status === 'error') {
    return (
      <Message negative onDismiss={onDismiss}>
        <Message.Header>Submission Failed</Message.Header>
        There was an error submitting your roster.
      </Message>
    );
  }

  return null;
};

export default SubmissionFeedback;
