import classes from "./DayButton.module.css";
import { useEffect, useState } from "react";

// DayButton component that represents a single day button.
function DayButton(props) {
  const [isActive, setIsActive] = useState(false);

  const dayNames = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  // Sets the button to active if it is the currently selected day.
  useEffect(() => {
    if (dayNames[props.activeDay] == props.text) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [props.activeDay]);

  function handleClick() {
    props.setSelfAsActive(props.num);
    props.onClick(props.num);
  }

  return (
    <div className={`${classes.actions} ${isActive ? classes.active : ""}`}>
      <button buttonText={props.text} onClick={handleClick}>
        {props.text}
      </button>
    </div>
  );
}

export default DayButton;
