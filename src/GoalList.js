import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, deleteGoal } from "./utils";
import { db } from "./fire";
import Calendar from "./Calendar";
import useAuth from "./useAuth";
import HeaderBar from "./HeaderBar";

export default function GoalsList() {
  const { auth } = useAuth();

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(["asdfasd"]);

  // The currently selected goal.
  const [selected, setSelected] = useState("asdfasd");

  // map of each goal to the dates that have been selected
  const [goalToDatesCompleted, setGoalToDatesCompleted] = useState({});

  // Refs.
  let goalInputRef = React.createRef();

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

  return (
    <OverallContainer>
      <GoalContainer>
        <AppTitle>Habit Tracker</AppTitle>
        <InputContainer>
          <GoalInput
            ref={goalInputRef}
            type="text"
            placeholder="Enter your next habit"
            onChange={e => setNewGoal(e.target.value)}
          />
          <AddGoalButton
            onClick={() => {
              if (newGoal.length > 0 && !goals.includes(newGoal)) {
                createGoal({
                  uid: auth.uid,
                  goal: newGoal
                });
                // dispatch({ type: "GOAL_ADDED", newGoal });
                setNewGoal("");
                setGoals([newGoal, ...goals]);
              }
            }}
          >
            ADD
          </AddGoalButton>
        </InputContainer>
        <ListContainer>
          {goals.map((goal, idx) => {
            return (
              <ListRow
                style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
                selected={goal === selected}
                onClick={() => {
                  setSelected(goal);
                }}
              >
                {" "}
                {goal}
                {/* // TODO -- IMPORT ICONS, INCLUDING TRASH ICON FOR DELETING */}
                <DeleteButton
                  onClick={() => {
                    console.log("yo: ", goal, auth.uid);
                    deleteGoal(auth.uid, goal);
                    setGoals(goals.filter(g => g !== goal));
                  }}
                >
                  {" "}
                  X{" "}
                </DeleteButton>
              </ListRow>
            );
          })}
        </ListContainer>
      </GoalContainer>

      <CalendarContainer>
        <HeaderBar />
        <Calendar
          curGoal={selected}
          // completedDaysMap={
          //   goalToDatesCompleted[selected] ? goalToDatesCompleted : []
          // }
          startingMonth={6}
        />
      </CalendarContainer>
    </OverallContainer>
  );
}

const OverallContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  min-width: 100vw; // TODO -- WHY DO I NEED THIS?
`;

const GoalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: #0d160a;
  font-family: Helvetica;
`;

const AppTitle = styled.div`
  color: white;
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 4rem;
  padding-right: 10rem;
  font-family: Helvetica;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ListContainer = styled.div`
  height: 27rem;
  overflow-y: scroll;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddGoalButton = styled.button`
  background-color: #227c20;
  display: inline-block;
  color: #faf8f8;
  font-size: 1em;
  padding: 1rem;
  border: none;
  font-weight: bold;
  border-radius: 0 0.3rem 0.3rem 0;
`;

const GoalInput = styled.input`
  height: 3rem;
  width: 16rem;
  color: black;
  background: #d8d8d8;
  border: none;
  font-size: 1em;

  padding-left: 0.5rem;
  border-radius: 0.3rem 0 0 0.3rem;
`;

const DeleteButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
`;

const ListRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between
  vertical-align: middle;
  line-height: 2.5rem;
  height: 2.5rem;
  width: 19rem;
  border-radius: 0.3rem;
  margin-top: 2rem;
  background-color: ${props => (props.selected ? "#227c20" : "#D8D8D8")};
  color: ${props => (props.selected ? "#D8D8D8" : "black")};
  padding-left: 0.5rem;
  margin-left: 1.2rem;
  font-family: "Helvetica", "Arial", sans-serif;

  &:hover {
    background-color: ${props => (props.selected ? "#227c20" : "#8BCC91")};
  }
`;

const VerticalLine = styled.div`
  border-left: thick solid #ff0000;
`;
