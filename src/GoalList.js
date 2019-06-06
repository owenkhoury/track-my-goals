import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal } from "./utils";
import { useAppState } from "./app-state";
import { GoalsSelectedMap } from "./MockDB";
import { db } from "./fire";
import Calendar from "./Calendar";

export default function GoalsList() {
  const [{}, dispatch] = useAppState();

  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState(goals[0]);
  const [goalToMonthMap, setGoalToMonthMap] = useState({});

  async function loadGoals() {
    db.collection("Goals")
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.docs.forEach(doc => {
          items.push(doc.data().goal);
        });

        setGoals(items);
      });
  }

  // Pull the goals from state and set the first one as selected.
  useEffect(() => {
    loadGoals();
  }, []);

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

  // TODO -- Just render one calendar. Give it props
  // for completedDays and currentMonth.

  // Keep the mapping of goal to current month in this components
  // local state.

  return (
    <OverallContainer>
      <GoalListContainer>
        <Input type="text" onChange={e => setNewGoal(e.target.value)} />
        <Button
          onClick={() => {
            if (newGoal.length > 0) {
              createGoal(newGoal);
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
