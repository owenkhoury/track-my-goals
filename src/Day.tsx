import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { addCompletedDay, removeCompletedDay } from "./utils";
import useAuth from "./useAuth";

// None of the props changed, so it didn't re-render

export default function Day({
  completedDays,
  curGoal,
  day,
  month,
  year,
  handleDayCompleted,
  handleDayRemoved,
  isCompleted,
  disabled
}) {
  const { auth } = useAuth();

  const [completed, setCompleted] = useState(isCompleted);

  // useEffect(() => {
  //   if (month && day && year) {
  //     const date =
  //       month.toString().padStart(2, "0") +
  //       "-" +
  //       day.toString().padStart(2, "0") +
  //       "-" +
  //       year.toString();

  //     if (date == "06-01-2019") {
  //       console.log("SETTING isCompleted as", isCompleted);
  //     }
  //   }
  // });

  useEffect(() => {
    console.log("YOOOOOOOOOOOOOOOOOOOOO");
    setCompleted(isCompleted);
  }, [curGoal]);

  useEffect(() => {
    if (month && day && year) {
      const date =
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0") +
        "-" +
        year.toString();

      if (date == "06-01-2019") {
        console.log("MOUNTED");
      }
    }
  }, []);

  useEffect(() => {
    setCompleted(false);
    setCompleted(isCompleted);
  }, [isCompleted]);

  // useEffect(() => {
  //   if (completed && !isCompleted) {
  //     setCompleted(false);
  //   }
  // });

  useEffect(() => {
    if (month && day && year) {
      const date =
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0") +
        "-" +
        year.toString();

      if (date == "06-01-2019") {
        console.log("RE-RENDER", isCompleted, completed, completedDays);
      }
    }
  });

  return (
    <Button
      completed={completed}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          setCompleted(!completed);

          const date =
            month.toString().padStart(2, "0") +
            "-" +
            day.toString().padStart(2, "0") +
            "-" +
            year.toString();

          // Either store or remove the day in the firstore.
          completed ? handleDayRemoved(date) : handleDayCompleted(date);
          // completed
          //   ? addCompletedDay(auth.uid, curGoal, date)
          //   : removeCompletedDay(auth.uid, curGoal, date);
        }
      }}
    >
      {disabled ? "0" : curGoal}
    </Button>
  );
}

interface ButtonProps {
  completed: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-block;
  height: 6rem;
  width: 6rem;
  -webkit-text-fill-color: ${props =>
    props.disabled ? "transparent" : "none"};
  color: ${props => (props.completed ? "white" : "black")};
  font-size: 1em;
  margin: 0.4375rem;
  border: 2px solid #5cc7ff;
  border-radius: 3px;
  background-color: ${props => (props.completed ? "#99E897" : "#D8D8D8")};
  text-align: right;

  &:hover {
    background-color: ${props =>
      props.disabled ? "#D8D8D8" : props.completed ? "#227c20" : "#c2c2c2"};
  }

  // old green color = #99E897
`;
