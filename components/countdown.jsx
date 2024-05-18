import React, { useState, useEffect } from 'react';

const CountdownComponent = ({ milliseconds, reset }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate remaining time

      const now = new Date().getTime();

    
      console.log("NOW:" + now)
      console.log("MILIS:" + milliseconds)
      const remainingTime =  now - milliseconds;

      console.log("Remaing time:" + remainingTime)

      // If remaining time is less than or equal to 0, stop countdown
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        setFormattedTime("");
        reset();
        return;
      }

      // Convert remaining time to hours, minutes, and seconds
      const hoursLeft = Math.floor(remainingTime / 3600000);
      const minutesLeft = Math.floor((remainingTime % 3600000) / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);

      // Format remaining time
      const formattedTime = `${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds`;

      // Update state with formatted time
      setFormattedTime(formattedTime);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [milliseconds]);

  return (
    <div className="flex flex-col items-start justify-center gap-2">
    <div className="font-bold text-gray-400 text-md">{formattedTime}</div>
   
    </div>
  );
};

export default CountdownComponent;
