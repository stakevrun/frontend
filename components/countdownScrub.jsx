import React, { useState, useEffect } from "react";

const CountdownComponentScrub = ({ initialMilliseconds, reset }) => {
  const [remainingTime, setRemainingTime] = useState(initialMilliseconds);
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    // Define a function to update the remaining time and format it
    const updateRemainingTime = () => {
      setRemainingTime((prevTime) => {
        // If remaining time is less than or equal to 0, stop countdown
        if (prevTime <= 1000) {
          reset();
          setFormattedTime("");
          return 0;
        }
        return prevTime - 1000;
      });
    };

    // Set an interval to update the remaining time every second
    const timeoutId = setTimeout(updateRemainingTime, 1000);

    // Format the remaining time
    const hoursLeft = Math.floor(remainingTime / 3600000);
    const minutesLeft = Math.floor((remainingTime % 3600000) / 60000);
    const secondsLeft = Math.floor((remainingTime % 60000) / 1000);

    // Set formatted time
    setFormattedTime(
      `${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds`
    );

    // Clear timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [remainingTime]);

  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="font-bold text-gray-400 text-md">{formattedTime}</div>
    </div>
  );
};

export default CountdownComponentScrub;
