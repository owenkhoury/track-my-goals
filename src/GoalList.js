import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, logout } from "./utils";
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

  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState(goals[0]);
  const [goalToMonthMap, setGoalToMonthMap] = useState({});
  const [goalToDates, setGoalToDates] = useState({});

  const [goalToDocId, setGoalToDocId] = useState({});

  /**
   * Pull in the existing habits from the database that have the
   * logged in user's uid.
   */
  async function loadGoals() {
    db.collection("goals")
      .where("uid", "==", auth.uid)
      .get()
      .then(snapshot => {
        const existingGoals = [];
        const goalToDaysSelected = {};
        const goalToIdMapping = [];

        snapshot.docs.forEach(doc => {
          const docId = doc.id;
          const goal = doc.data().goal;
          const datesCompleted = doc.data().datesCompleted;

          goalToIdMapping[goal] = docId;
          existingGoals.push(goal);
          goalToDaysSelected[goal] = datesCompleted;
        });

        setGoalToDocId(goalToIdMapping);
        setGoals(existingGoals);
        setGoalToDates(goalToDaysSelected);
      });
  }

  // Pull the goals from state and set the first one as selected.
  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    console.log("yo yo yo");
  });

  // Whenver a goal is added. Add a mappping of that goal to the current month.
  // As the user looks to different months on different goals, that will be saved
  // in state.

  // TODO UPDATE THE goalToMonthMap state whenever the month is changed for
  // a given goal.
  useEffect(() => {
    goals.forEach(goal => {
      let curMap = goalToMonthMap;

      if (!curMap[goal]) {
        const today = new Date();
        curMap[goal] = today.getMonth() + 1;
      }
    });
  }, [goals, goalToMonthMap]);

  useEffect(() => {
    console.log("month map: ", goalToMonthMap);
  });

  return (
    <OverallContainer>
      <GoalListContainer>
        <Button onClick={logout}>yo yo yo</Button>

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

      <Calendar startingMonth={5} />
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
