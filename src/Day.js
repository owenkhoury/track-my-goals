import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Day({
  day,
  month,
  year,
  handleDayCompleted,
  isCompleted
}) {
  const [completed, setCompleted] = useState(isCompleted);

  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  return (
    <Button
      completed={completed}
      onClick={() => {
        setCompleted(!completed);

        // Save this completed day in the database.
        handleDayCompleted(
          month.toString().padStart(2, "0") +
            "-" +
            day.toString().padStart(2, "0") +
            "-" +
            year.toString()
        );
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
