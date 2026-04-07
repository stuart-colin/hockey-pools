import React from 'react';
import { Button, Modal, Header, Icon } from 'semantic-ui-react';

const modalWhiteStyle = {
  background: '#fff',
};

const modalContentStyle = {
  background: '#fff',
  padding: '40px 20px',
  textAlign: 'center',
};

const iconSectionStyle = {
  marginBottom: '20px',
};

const modalIconStyle = {
  marginBottom: '15px',
};

const modalTitleStyle = {
  marginTop: '10px',
  marginBottom: '20px',
  color: '#333',
};

const modalBodyTextStyle = {
  fontSize: '16px',
  color: '#666',
  marginBottom: '0',
};

const modalActionsStyle = {
  background: '#f5f5f5',
  borderTop: '1px solid #ddd',
  padding: '10px 10px',
};

/**
 * Reusable confirmation dialog for clear and submit actions
 */
const ConfirmationDialog = ({
  isOpen,
  actionType, // 'clear' or 'submit'
  onConfirm,
  onCancel,
}) => {
  const isClearing = actionType === 'clear';

  return (
    <Modal
      basic={false}
      onClose={onCancel}
      open={isOpen}
      size='small'
      style={modalWhiteStyle}
    >
      <Modal.Content style={modalContentStyle}>
        <div style={iconSectionStyle}>
          <Icon
            name={isClearing ? 'trash' : 'checkmark'}
            size='huge'
            color={isClearing ? 'red' : 'green'}
            style={modalIconStyle}
          />
          <h2 style={modalTitleStyle}>
            {isClearing ? 'Clear Team' : 'Submit Team'}
          </h2>
        </div>
        <p style={modalBodyTextStyle}>
          {isClearing
            ? 'Are you sure you want to clear your entire team? This action cannot be undone.'
            : 'Are you sure you want to submit this team? You can edit it later if needed.'}
        </p>
      </Modal.Content>
      <Modal.Actions style={modalActionsStyle}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color={isClearing ? 'red' : 'green'}
          onClick={onConfirm}
        >
          {isClearing ? 'Clear' : 'Submit'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmationDialog;
