import Sun from "../public/images/sun.png";
import Moon from "../public/images/moon.png";
import Image from "next/image";
import type { RootState } from "../globalredux/store";
import { useDispatch, useSelector } from "react-redux";
import { changeDarkMode } from "../globalredux/Features/darkmode/darkModeSlice";
import styles from "../styles/Home.module.css";

const Toggle = () => {
  const dispatch = useDispatch();
  const reduxDarkMode = useSelector(
    (state: RootState) => state.darkMode.darkModeOn
  );

  const handleClick = () => {
    dispatch(changeDarkMode());
    console.log("Running dark mode click");
  };

  return (
    <div className={styles.t}>
      <Image
        height={30}
        width={30}
        src={"/images/sun.png"}
        alt="Vrun logo"
        className={styles.tIcon}
      />
      <Image
        height={30}
        width={30}
        src={"/images/moon.png"}
        alt="Moon"
        className={styles.tIcon}
      />

      <div
        className={styles.tButton}
        onClick={handleClick}
        style={{ left: reduxDarkMode ? 0 : 25 }}
      ></div>
    </div>
  );
};

export default Toggle;
