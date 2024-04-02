import React from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";

const RollingNumber = ({ n }: any) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: n },
    delay: 150,
    config: { mass: 0.2, tension: 20, friction: 10 }
  });

  return (
    <animated.div style={{ display: "inline-block" }}>
      {number.to((n) => n.toFixed(0))}
    </animated.div>
  );
};



export default RollingNumber;