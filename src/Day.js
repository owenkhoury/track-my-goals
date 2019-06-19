import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Day({
  curGoal,
  day,
  month,
  year,
  handleDayCompleted,
  handleDayRemoved,
  isCompleted,
  disabled
}) {
  const [completed, setCompleted] = useState(isCompleted);

  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

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
        }
      }}
    >
      {disabled ? "0" : day}
    </Button>
  );
}

const Button = styled.button`
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
