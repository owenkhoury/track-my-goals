import React, { useState, useEffect } from "react";
import { useAppState } from "./app-state";
import styled from "styled-components";
import useAuth from "./useAuth";
import { db } from "./fire";

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
  const { auth } = useAuth();

  const [completed, setCompleted] = useState(false);

  const [{ goals, selectedGoal, selectedDays }, dispatch] = useAppState();

  useEffect(() => {
    console.log(
      month.toString() +
        "-" +
        day.toString().padStart(2, "0") +
        "-" +
        year.toString()
    );
  }, [day, month, year]);

  async function addCompletedDay() {
    const date =
      month.toString() +
      "-" +
      day.toString().padStart(2, "0") +
      "-" +
      year.toString();

    // let query = db.collection("goals").doc("B9RBqWiqJQHzV4lRuB1U");
    // // query = query.where("uid", "==", auth.uid);
    // // query = query.where("goal", "==", "new type of goal");

    // await query.set({ datesCompleted: [date] }, { merge: true });

    db.runTransaction(transaction => {
      return transaction.get("goals/B9RBqWiqJQHzV4lRuB1U").then(snapshot => {
        const updatedArray = snapshot.get("daysCompleteed");
        updatedArray.push(date);
        transaction.update(
          "B9RBqWiqJQHzV4lRuB1U",
          "daysCompleted",
          updatedArray
        );
      });
    });
  }

  return (
    <Button
      completed={completed}
      onClick={() => {
        setCompleted(!completed);
        addCompletedDay();
        // TODO -- MAKE REQUEST TO SAVE THIS DAY
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
