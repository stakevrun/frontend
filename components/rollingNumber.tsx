import React from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";

const RollingNumber = ({ n, bool }: any) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: n },
    delay: 150,
    config: { mass: 0.2, tension: 20, friction: 10 }
  });


  const fixedNum = bool? 0 : 5;

  return (
    <animated.div style={{ display: "inline-block", transition: "0.2s all ease-in-out"}}>
      {number.to((n) => n.toFixed(fixedNum))}
    </animated.div>
  );
};



export default RollingNumber;