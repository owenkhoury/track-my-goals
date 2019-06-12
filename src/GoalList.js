import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, logout, loadCompletedDays } from "./utils";
import { useAppState } from "./app-state";
import { GoalsSelectedMap } from "./MockDB";
import { db } from "./fire";
import Calendar from "./Calendar";
import useAuth from "./useAuth";

// NOTE -- I HAVE A MAPPING OF GOAL NAMES TO DOCUMENT IDS. USE
// THESE IDS TO UPDATE THEIR COMPLETED DAYS.

export default function GoalsList() {
  const { auth } = useAuth();

  const [{}, dispatch] = useAppState();

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(["asdfasd"]);

  // The currently selected goal.
  const [selected, setSelected] = useState("asdfasd");

  // map of each goal to the dates that have been selected
  const [goalToDatesCompleted, setGoalToDatesCompleted] = useState({});

  useEffect(() => {
    console.log("LOADED COMPLETED DAYS: ", goalToDatesCompleted);
  });

  // LOAD THE EXISTING GOALS INTO STATE.
  useEffect(() => {
    const fetchGoals = db
      .collection("goals")
      .where("uid", "==", auth.uid)
      .get()
      .then(snapshot => {
        const existingGoals = [];
        snapshot.docs.forEach(doc => {
          existingGoals.push(doc.data().goal);
        });

        setSelected(existingGoals[0]);
        setGoals(existingGoals);
      });

    if (typeof fetchGoals === "function") {
      return () => fetchGoals();
    }
  }, []);

  // LOAD THE COMPLETED DAYS INTO STATE.
  useEffect(() => {
    const fetchCompletedDays = db
      .collection(`daysCompleted-${auth.uid}`)
      .get()
      .then(snapshot => {
        const datesCompleted = [];

        snapshot.docs.forEach(doc => {
          const goal = doc.data().goal;
          const date = doc.data().date;
          datesCompleted.push({ goal: goal, date: date });
        });

        const datesCompletedMap = {};
        datesCompleted.forEach(data => {
          if (data.goal in datesCompletedMap) {
            datesCompletedMap[data.goal].push(data.date);
          } else {
            datesCompletedMap[data.goal] = [data.date];
          }
        });
        setGoalToDatesCompleted(datesCompletedMap);
      });

    if (typeof fetchCompletedDays === "function") {
      return () => fetchCompletedDays();
    }
  }, []);

  return (
    <OverallContainer>
      <GoalListContainer>
        <Input type="text" onChange={e => setNewGoal(e.target.value)} />
        <Button
          onClick={() => {
            if (newGoal.length > 0 && !goals.includes(newGoal)) {
              createGoal({
                uid: auth.uid,
                goal: newGoal
              });
              dispatch({ type: "GOAL_ADDED", newGoal });
              setNewGoal("");
              setGoals([...goals, newGoal]);
            }
          }}
        >
          Add goal
        </Button>

        {goals.map((goal, idx) => {
          return (
            <ListRow
              style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
              selected={goal === selected}
              onClick={() => {
                setSelected(goal);
                // forceUpdate();
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
      </GoalListContainer>

      {/* TODO -- THIS CONDITION STOPPED GETTING SET TO TRUE */}
      <Calendar
        curGoal={selected}
        completedDays={
          goalToDatesCompleted[selected] ? goalToDatesCompleted[selected] : []
        }
        startingMonth={6}
      />
    </OverallContainer>
  );
}

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

const GoalListContainer = styled.div`
  flex-basis: "33.3%";
  max-width: "33.3%";
  padding-right: 10em;
  padding-left: 6em;
  padding-top: 6em;
`;

const OverallContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: white;
  background: black;
  border: none;
  border-radius: 3px;
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
