import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, deleteGoal, removeDaysCompleted } from "./utils";
import useAuth from "./useAuth";

/**
 * Color map stuff has bugs to workout, but it's a start.
 */

export default function GoalsList({
  existingGoals,
  selected,
  colorMap,
  updateSelected,
  addToColorMap,
  removeFromColorMap
}) {
  const { auth } = useAuth();

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(existingGoals);

  useEffect(() => {
    setGoals(existingGoals);
  }, [existingGoals]);

  return (
    <GoalContainer>
      <AppTitle>Habit Tracker</AppTitle>
      <InputContainer>
        <GoalInput
          type="text"
          placeholder="Enter your next habit"
          onChange={e => setNewGoal(e.target.value)}
        />
        <AddGoalButton
          onClick={() => {
            if (newGoal.length > 0 && !goals.includes(newGoal)) {
              const goalColor = addToColorMap(newGoal);
              createGoal(auth.uid, newGoal, goalColor);

              if (goals.includes(newGoal)) {
                console.log("HERE 3");
                updateSelected(newGoal);
              }

              setNewGoal("");
              setGoals([...goals, newGoal]);
            }
          }}
        >
          ADD
        </AddGoalButton>
      </InputContainer>
      <ListContainer>
        {goals
          ? goals.map((goal, idx) => {
              return (
                <ListRow
                  style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
                  selected={goal === selected}
                  colorMap={colorMap}
                  goal={goal}
                  onClick={() => {
                    if (goals.includes(goal)) {
                      console.log("HERE 2: ", goals, goal);
                      updateSelected(goal);
                    }
                  }}
                >
                  {" "}
                  {goal}
                  {/* // TODO -- IMPORT ICONS, INCLUDING TRASH ICON FOR DELETING */}
                  <DeleteButton
                    onClick={e => {
                      e.stopPropagation();
                      const idx = goals.indexOf(goal);
                      const length = goals.length;

                      deleteGoal(auth.uid, goal);
                      setGoals(goals.filter(g => g !== goal));
                      removeDaysCompleted(auth.uid, goal);

                      console.log("DELETE: ", goals, length);

                      // Check that this isn't the last goal in the list.
                      if (idx - 1 >= 0) {
                        console.log(
                          "goal deleted: ",
                          goals,
                          idx,
                          goals[idx - 1]
                        );
                        if (goals.includes(goals[idx - 1])) {
                          console.log("HERE 1");
                          updateSelected(goals[idx - 1]);
                        }
                      }
                    }}
                  >
                    {" "}
                    X{" "}
                  </DeleteButton>
                </ListRow>
              );
            })
          : null}
      </ListContainer>
    </GoalContainer>
  );
}

const GoalContainer = styled.div`
  // display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: #0d160a;
  font-family: Helvetica;
  position: absolute;
  height: 100%;
`;

const AppTitle = styled.div`
  color: white;
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 4rem;
  padding-right: 10rem;
  font-family: Montserrat, sans-serif;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ListContainer = styled.div`
  height: 27rem;
  overflow-y: scroll;
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

  &:hover {
    filter: brightness(85%);
  }
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

interface ListRowProps {
  selected: boolean;
  colorMap: Object;
  goal: string;
}

const ListRow = styled.div<ListRowProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between
  vertical-align: middle;
  line-height: 2.5rem;
  height: 2.5rem;
  width: 19rem;
  border-radius: 0.3rem;
  margin-top: 2rem;
  background-color: ${props =>
    props.selected && props.colorMap && props.goal
      ? props.colorMap[props.goal]
      : "#D8D8D8"};
  padding-left: 0.5rem;
  margin-left: 1.2rem;
  font-family: Montserrat, sans-serif;

  &:hover {
    background-color: ${props =>
      props.colorMap && props.goal ? props.colorMap[props.goal] : "#D8D8D8"};
    filter: ${props =>
      props.selected ? "brightness(100%)" : "brightness(85%)"};
  }
`;
