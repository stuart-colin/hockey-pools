import React, { useState } from "react";
import { Message, Icon } from "semantic-ui-react";

const Alert = ({ messageHeading, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose(); // Call the optional onClose callback if provided
    }
  };

  if (!visible) return null;

  return (
    <Message
      warning
      style={{
        margin: '10px',
      }}
    >
      <Icon
        name="close"
        style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
        onClick={handleClose}
      />
      <Message.Content>
        <Message.Header>{messageHeading}</Message.Header>
        <p>{message}</p>
      </Message.Content>
    </Message>
  );
};

export default Alert;