import React, { useState, useEffect } from "react";
import { Message, Icon } from "semantic-ui-react";

const Alert = ({ messageHeading, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Generate a unique identifier for the alert based on its content
  const alertHash = JSON.stringify({ messageHeading, message });

  useEffect(() => {
    const storedHash = localStorage.getItem("alertHash");
    const alertClosed = localStorage.getItem("alertClosed");

    if (storedHash === alertHash && alertClosed === "true") {
      setVisible(false);
    } else {
      // If the alert content has changed, reset visibility and update the hash
      localStorage.setItem("alertHash", alertHash);
      localStorage.removeItem("alertClosed");
      setVisible(true);
    }
  }, [alertHash]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("alertClosed", "true"); // Save the closed state in localStorage
    if (onClose) {
      onClose(); // Call the optional onClose callback if provided
    }
  };

  if (!visible) return null;

  return (
    <Message
      warning
      style={{
        margin: "10px",
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