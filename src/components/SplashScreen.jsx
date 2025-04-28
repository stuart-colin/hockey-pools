import React, { useEffect, useState } from "react";
import { Transition, Image } from "semantic-ui-react";

const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 250); // Wait for fade-out animation to complete
    }, 250);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onComplete]);

  return (
    <div style={styles.container}>
      <Transition visible={visible} animation="fade" duration={500}>
        <Image
          src='/public/../logo.svg'
          style={styles.logo}
        />
      </Transition>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Optional: Set a background color
    zIndex: 2000, // Ensure it appears above all other content
  },
  logo: {
    width: "300px",
  },
};

export default SplashScreen;