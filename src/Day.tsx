import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import useAuth from "./useAuth";
import { removeCompletedDay, addCompletedDay } from "./utils";

// TODO -- UPDATE COMPONENT TO USE PROP INTERFACE. ALLOWS OPTIONS.
// interface Props  {
//   completedDays:
// }

export default function Day({
  completedDays,
  completedColor,
  curGoal,
  day,
  month,
  year,
  selectedGoals,
  colorMap,
  handleDayCompleted,
  handleDayRemoved,
  isCompleted,
  disabled
}) {
  const { auth } = useAuth();

  const [completed, setCompleted] = useState(isCompleted);

  useEffect(() => {
    console.log("selected goals: ", selectedGoals);
  });

  useEffect(() => {
    setCompleted(isCompleted);
  }, [curGoal]);

  useEffect(() => {
    setCompleted(false);
    setCompleted(isCompleted);
  }, [isCompleted, month]);

  function getColorDisplay() {
    if (selectedGoals && selectedGoals.length === 1) {
      const singleColor = colorMap[selectedGoals[0]];
      return (
        <Fragment>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }}>
            <Text>{disabled ? "0" : day} </Text>
          </MyDiv>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }} />
        </Fragment>
      );
    } else if (selectedGoals && selectedGoals.length > 1) {
      if (selectedGoals.length > 1) {
        console.log(
          "multiple colors for this day: ",
          selectedGoals,
          colorMap[selectedGoals[0]],
          colorMap[selectedGoals[1]]
        );
      }

      let divList = [];

      // TODO -- use a foreach loop. this is whack
      for (let x in selectedGoals) {
        if (x === "1") {
          divList.push(
            <MyDiv style={{ background: colorMap[selectedGoals[x]] }}>
              <Text>{disabled ? "0" : day} </Text>
            </MyDiv>
          );
        } else {
          divList.push(
            <MyDiv style={{ background: colorMap[selectedGoals[x]] }} />
          );
        }
      }

      while (divList.length !== 4) {
        divList.push(<MyDiv style={{ background: "#D8D8D8" }} />);
      }

      return (
        <Fragment>
          {divList[0]}
          {divList[1]}
          {divList[2]}
          {divList[3]}
        </Fragment>
      );
    } else {
      const singleColor = disabled ? "#f1f1f1" : "#D8D8D8";
      return (
        <Fragment>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }}>
            <Text>{disabled ? "0" : day} </Text>
          </MyDiv>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }} />
        </Fragment>
      );
    }
  }

  const dayColors = getColorDisplay();

  return (
    <Button
      completed={completed}
      completedColor={completedColor}
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

          if (completed) {
            handleDayRemoved(date);
            removeCompletedDay(auth.uid, curGoal, date);
          } else {
            selectedGoals.push(curGoal);
            handleDayCompleted(date);
            addCompletedDay(auth.uid, curGoal, date);
          }
        }
      }}
    >
      {dayColors}
    </Button>
  );
}

const Text = styled.div`
  z-index: 10;
  padding-right: 0.5rem;
`;

const MyDiv = styled.div`
  width: 50%;
  height: 50%;
  float: left;
`;

interface ButtonProps {
  completed: boolean;
  disabled: boolean;
  completedColor: string;
}

const Button = styled.button<ButtonProps>`
  font-family: "Avenir Next" !important;
  padding: 0;
  display: inline-block;
  height: 6rem;
  width: 6rem;
  -webkit-text-fill-color: ${props =>
    props.disabled ? "transparent" : "none"};
  color: ${props => (props.completed ? "white" : "black")};
  font-size: 1em;
  margin: 0.4375rem;
  border: ${props =>
    props.disabled ? "2px solid #f1f1f1;" : "2px solid #10adff"};
  border-radius: 3px;
  background-color: ${props =>
    props.disabled
      ? "#f1f1f1"
      : props.completed
      ? props.completedColor
      : "#D8D8D8"};
  text-align: right;

  &:hover {
    filter: ${props =>
      props.disabled ? "brightness(100%)" : "brightness(85%)"};
  }

  margin-top: 0.3rem;
`;

//5cc7ff -- blue
// 565656 -- black
