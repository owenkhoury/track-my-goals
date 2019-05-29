import React, { useState, useEffect } from "react";
import { useAppState } from "./app-state";
import styled from "styled-components";

const monthMap = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sept",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

export default function Day({ day, month, year }) {
  const [completed, setCompleted] = useState(false);

  const [{ goals, selectedGoal, selectedDays }, dispatch] = useAppState();

  // useEffect(() => {
  //   console.log(
  //     month.toString() +
  //       "-" +
  //       day.toString().padStart(2, "0") +
  //       "-" +
  //       year.toString()
  //   );
  // }, [day, month, year]);

  return (
    <Button
      completed={completed}
      onClick={() => {
        setCompleted(!completed);

        // UPDATE GLOBAL STATE OF MAPPING OF GOALS TO DATES COMPLETED.
        // dispatch({
        //   type: "DAY_SELECTED",
        //   goal: "workout",
        //   selectedDay: "01-05-19"
        // });
      }}
    >
      {day}
    </Button>
  );
}

const Button = styled.button`
  display: inline-block;
  height: 100px;
  width: 100px;
  color: ${props => (props.completed ? "black" : "black")};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #5cc7ff;
  border-radius: 3px;
  background-color: ${props => (props.completed ? "#99E897" : "white")};
`;

const ClickableDay = styled.button`
  width: 120px;
  height: 120px;
`;

const CalendarDay = styled.div`
    width: 150px
    height: 150px
    background-color: #dee2e6;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    color: hsl(197, 10%, 45%);
    font-size: 85%;
    pointer-events: none;
`;
