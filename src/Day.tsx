import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  const [completed, setCompleted] = useState(isCompleted);

  useEffect(() => {
    setCompleted(isCompleted);
  }, [curGoal]);

  useEffect(() => {
    setCompleted(false);
    setCompleted(isCompleted);
  }, [isCompleted, month]);

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

          completed ? handleDayRemoved(date) : handleDayCompleted(date);
        }
      }}
    >
      {disabled ? "0" : day}
    </Button>
  );
}

interface ButtonProps {
  completed: boolean;
  disabled: boolean;
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
  border: ${props =>
    props.disabled ? "2px solid #f1f1f1;" : "2px solid #5cc7ff"} 
  border-radius: 3px;
  background-color: ${props =>
    props.disabled ? "#f1f1f1" : props.completed ? "#99E897" : "#D8D8D8"};
  text-align: right;

  &:hover {
    filter: ${props =>
      props.disabled ? "brightness(100%)" : "brightness(85%)"};
  }
`;
