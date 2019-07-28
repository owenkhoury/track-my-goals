import React, { useEffect, Fragment, useState } from "react";
import styled from "styled-components";

import { completedDay } from "./constants/AppConstants";

export default function Day({
  completedDays,
  completedColor,
  curGoal, // shouldn't need this
  day,
  month,
  year,
  goalsCompletedOnDay,
  selectedGoals,
  colorMap,
  handleDayCompleted,
  handleDayRemoved,
  isCompleted,
  newCompletedDays,
  disabled,
  handleNotesSelected
}) {
  const [myDate, setMyDate] = useState("");

  useEffect(() => {
    if (month && day && year) {
      const date =
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0") +
        "-" +
        year.toString();
      setMyDate(date);
    }
  });

  /**
   * Determine how to color in each day depending on how many goals
   * are currently selected.
   */
  function getColorDisplay() {
    const oneGoal: boolean =
      goalsCompletedOnDay && goalsCompletedOnDay.length === 1;

    const multipleGoals: boolean =
      goalsCompletedOnDay && goalsCompletedOnDay.length > 1;

    if (oneGoal) {
      const singleColor = colorMap[goalsCompletedOnDay[0]];
      return (
        <Fragment>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }}>
            <i
              className="glyphicon glyphicon-edit"
              style={{ color: "white" }}
              onClick={e => {
                console.log("clicked note button");
                e.stopPropagation();

                // const day: completedDay = {
                //   date: myDate,
                //   goal: curGoal,
                //   notes: "hey this is a note"
                // };

                // TODO -- PASS THE GOAL AND THE DAY. LOOK UP THE NOTE
                handleNotesSelected(myDate, curGoal);
              }}
            />
            <Text>{disabled ? "0" : day} </Text>
          </MyDiv>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }} />
        </Fragment>
      );
    } else if (multipleGoals) {
      let display = [];

      // TODO -- use a foreach loop. this is whack
      for (let x in goalsCompletedOnDay) {
        if (x === "1") {
          display.push(
            <MyDiv style={{ background: colorMap[goalsCompletedOnDay[x]] }}>
              <Text>{disabled ? "0" : day} </Text>
            </MyDiv>
          );
        } else {
          display.push(
            <MyDiv style={{ background: colorMap[goalsCompletedOnDay[x]] }} />
          );
        }
      }

      while (display.length !== 4) {
        display.push(<MyDiv style={{ background: "#D8D8D8" }} />);
      }

      return (
        <Fragment>
          {display[0]}
          {display[1]}
          {display[2]}
          {display[3]}
        </Fragment>
      );
    } else {
      const singleColor = disabled ? "#f1f1f1" : "#D8D8D8";
      return (
        <Fragment>
          <MyDiv style={{ background: singleColor }} />
          <MyDiv style={{ background: singleColor }}>
            <EditContainer>
              <Text>{disabled ? "0" : day} </Text>
            </EditContainer>
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
      completedColor={completedColor}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          const date =
            month.toString().padStart(2, "0") +
            "-" +
            day.toString().padStart(2, "0") +
            "-" +
            year.toString();

          // Only allow select and deselect if ony one goal is selected.
          if (selectedGoals.length === 1) {
            const goal = selectedGoals[0];

            const isGoalSelected =
              newCompletedDays &&
              newCompletedDays[goal] &&
              newCompletedDays[goal].filter(day => day.date === date).length >
                0; //.indexOf(date) > -1;

            if (isGoalSelected) {
              console.log("handleDayRemoved");
              handleDayRemoved(date, goal);
            } else {
              console.log("handleDayCompleted");
              handleDayCompleted(date, goal);
            }
          }
        }
      }}
    >
      {dayColors}
    </Button>
  );
}

const EditContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

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
  // completed: boolean;
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
  font-size: 1em;
  margin: 0.4375rem;
  border: ${props =>
    props.disabled ? "2px solid #f1f1f1;" : "2px solid #6B7A8F"};
  border-radius: 3px;
  text-align: right;

  &:hover {
    filter: ${props =>
      props.disabled ? "brightness(100%)" : "brightness(85%)"};
  }

  margin-top: 0.3rem;
`;

// 10adff - blue border
//5cc7ff -- blue
// 565656 -- black
