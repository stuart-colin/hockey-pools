import React from 'react';
import { Button, Modal, Header, Icon } from 'semantic-ui-react';

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
      style={{ background: '#fff' }}
    >
      <Modal.Content style={{ background: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <Icon
            name={isClearing ? 'trash' : 'checkmark'}
            size='huge'
            color={isClearing ? 'red' : 'green'}
            style={{ marginBottom: '15px' }}
          />
          <h2 style={{ marginTop: '10px', marginBottom: '20px', color: '#333' }}>
            {isClearing ? 'Clear Team' : 'Submit Team'}
          </h2>
        </div>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '0' }}>
          {isClearing
            ? 'Are you sure you want to clear your entire team? This action cannot be undone.'
            : 'Are you sure you want to submit this team? You can edit it later if needed.'}
        </p>
      </Modal.Content>
      <Modal.Actions style={{ background: '#f5f5f5', borderTop: '1px solid #ddd', padding: '10px 10px' }}>
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
