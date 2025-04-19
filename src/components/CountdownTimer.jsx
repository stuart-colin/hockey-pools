import React, { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";

const CountdownTimer = () => {
  // Target date: Saturday, April 19th at 6 PM EST
  const targetDate = new Date("2025-04-19T18:00:00-04:00").getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate the remaining time
  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return null; // Timer has completed
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  if (!timeLeft) {
    return <Message color='red' style={{ textAlign: "center", margin: "10px" }}>Rosters submissions are locked!</Message>;
  }

  return (
    <Message color='red' style={{ textAlign: "center", margin: "10px" }}>
      <div className="header">Puck Drop & Roster Lock 🏒</div>
      <p>
        {timeLeft.hours} hours,
        {" "}
        {timeLeft.minutes} minutes,
        {" "}
        {timeLeft.seconds} seconds
      </p>
    </Message>
  );
};

export default CountdownTimer;