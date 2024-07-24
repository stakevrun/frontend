import React from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";

const RollingNumber = ({ n, bool }: any) => {
  const { number } = useSpring({
    from: { number: 0.0000001 },
    to: { number: parseFloat(n) },
    delay: 150,
    config: { mass: 0.2, tension: 20, friction: 10 }
  });

  const fixedNum = bool ? 0.00000000 : 5.00000;

  return (
    <animated.div style={{ display: "inline-block", transition: "0.2s all ease-in-out" }}>
      {number.to((value) => value.toFixed(fixedNum))}
    </animated.div>
  );
};

RollingNumber.propTypes = {
  n: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bool: PropTypes.bool.isRequired,
};

export default RollingNumber;
