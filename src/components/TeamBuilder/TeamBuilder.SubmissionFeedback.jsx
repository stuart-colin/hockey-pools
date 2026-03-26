import React from 'react';
import { Icon, Message } from 'semantic-ui-react';

/**
 * Displays submission status feedback messages
 */
const SubmissionFeedback = ({ status }) => {
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
      <Message positive>
        <Message.Header>Submission Successful</Message.Header>
        Your roster has been submitted successfully!
      </Message>
    );
  }

  if (status === 'error') {
    return (
      <Message negative>
        <Message.Header>Submission Failed</Message.Header>
        There was an error submitting your roster. Please ensure your User ID
        matches the provided ID.
      </Message>
    );
  }

  return null;
};

export default SubmissionFeedback;
