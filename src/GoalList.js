import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, retrieveSelectedDays } from "./utils";
import { useAppState } from "./app-state";
import { GoalsSelectedMap } from "./MockDB";
import { db } from "./fire";

export default function GoalsList() {
  const [{ goals, selectedGoal, selectedDays }, dispatch] = useAppState();

  const [newGoal, setNewGoal] = useState("");

  const [myGoals, setMyGoals] = useState([]);

  const [selected, setSelected] = useState(goals[0]);

  async function loadGoals() {
    db.collection("Goals")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          // goals.push(doc.data().Goal);
          setMyGoals([...myGoals, doc.data().Goal]);
        });
      });
  }

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    //console.log('Goals: ', goals.map((goal) => {console.log(goal)}))
    // console.log("selected days: ", selectedDays);
    console.log("myGoals", myGoals.length);

    myGoals.forEach(goal => console.log("Here: ", goal));
  });

  return (
    <ListRowContainer>
      <Input type="text" onChange={e => setNewGoal(e.target.value)} />
      <Button
        onClick={() => {
          createGoal(newGoal);
          dispatch({ type: "GOAL_ADDED", newGoal });
          setNewGoal("");
        }}
      >
        Add goal
      </Button>

      {myGoals.map((goal, idx) => {
        return (
          <ListRow
            style={goals[idx + 1] ? null : { borderWidth: "5px" }}
            selected={goal === selected}
            onClick={() => {
              setSelected(goal);
              const selectedDays = GoalsSelectedMap[goal];
              // Not hooked to firebase yet. Just mocking the backend
              dispatch({ type: "SELECTED_DAYS_LOADED", selectedDays });
            }}
          >
            {" "}
            {goal}
          </ListRow>
        );
      })}
    </ListRowContainer>
  );
}

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: white;
  background: black;
  border: none;
  border-radius: 3px;
`;

const Button = styled.button`
  display: inline-block;
  color: #5cc7ff;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #5cc7ff;
  border-radius: 3px;
  display: inline-block;
`;

const ListRowContainer = styled.div`
  flex-basis: "33.3%";
  max-width: "33.3%";
  padding-right: 1em;
  padding-left: 6em;
  padding-top: 6em;
`;

const ListRow = styled.div`
  height: 50px;
  width: 300px;
  border-width: 5px 5px 0px 5px;
  border-color: #ff6030;
  padding-top: 20px;
  border-style: solid;

  background-color: ${props => (props.selected ? "#FFE16D" : "white")};
`;
