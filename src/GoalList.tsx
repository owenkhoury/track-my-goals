import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, deleteGoal, removeDaysCompleted } from "./utils";
import useAuth from "./useAuth";
import { tsPropertySignature } from "@babel/types";

export default function GoalsList({
  existingGoals,
  selected,
  colorMap,
  updateSelected,
  addToColorMap,
  removeFromColorMap,
  handleGoalSelected,
  handleGoalRemoved,
  selectedGoals
}) {
  const { auth } = useAuth();

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(existingGoals);

  const [wasGoalSelectedOnLoad, setWasGoalSelectedOnLoad] = useState(true);

  useEffect(() => {
    setGoals(existingGoals);
  }, [existingGoals]);

  return (
    <GoalContainer>
      <AppTitle />
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
                <NewListRow
                  style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
                  selected={goal === selected}
                  checked={
                    (document.getElementById(goal) as HTMLInputElement) &&
                    (document.getElementById(goal) as HTMLInputElement).checked
                  }
                  colorMap={colorMap}
                  goal={goal}
                  onClick={() => {
                    // TODO -- PUT THIS INTO ITS OWN FUNCTION
                    if (goals.includes(goal)) {
                      // Set as selected and check this rows checkbox, remove the previously selected from the selectedList.
                      handleGoalSelected(goal, selected);
                      updateSelected(goal);

                      // Use this so that I can check the first goal's checkbox on page load.
                      if (wasGoalSelectedOnLoad) {
                        setWasGoalSelectedOnLoad(false);
                      }

                      (document.getElementById(
                        selected
                      ) as HTMLInputElement).checked = false;

                      (document.getElementById(
                        goal
                      ) as HTMLInputElement).checked = true;
                    }
                  }}
                >
                  <ListRowLeft>
                    <Circle
                      selected={goal === selected}
                      color={
                        colorMap && colorMap[goal] ? colorMap[goal] : "red"
                      }
                      className="dot"
                    />
                    <ListRowInfo>
                      <Goal>{goal}</Goal>
                      <StartDate>Jan 11th, 2019</StartDate>
                    </ListRowInfo>
                  </ListRowLeft>
                  <label>
                    <input // TODO -- PUT THIS LOGIC INTO THE CIRCLE
                      id={goal}
                      type="checkbox"
                      defaultChecked={idx === 0}
                      onClick={e => {
                        e.stopPropagation();
                        let checkbox = document.getElementById(
                          goal
                        ) as HTMLInputElement;

                        console.log("checked: ", checkbox.checked);

                        if (idx === 0 && selectedGoals.length === 0) {
                          checkbox.checked = true;
                          handleGoalSelected(goal);
                        }

                        if (checkbox.checked) {
                          handleGoalSelected(goal);
                        } else if (selectedGoals.length === 1) {
                          e.preventDefault();
                        } else {
                          handleGoalRemoved(goal);
                        }
                      }}
                    />
                  </label>{" "}
                  {/* // TODO -- IMPORT ICONS, INCLUDING TRASH ICON FOR DELETING */}
                  <DeleteButton
                    onClick={e => {
                      e.stopPropagation();
                      const idx = goals.indexOf(goal);

                      deleteGoal(auth.uid, goal);
                      setGoals(goals.filter(g => g !== goal));
                      removeDaysCompleted(auth.uid, goal);

                      // Check that this isn't the last goal in the list.
                      if (idx - 1 >= 0) {
                        if (goals.includes(goals[idx - 1])) {
                          updateSelected(goals[idx - 1]);
                        }
                      }
                    }}
                  >
                    {" "}
                    <i
                      className="glyphicon glyphicon-trash"
                      style={{ paddingRight: ".5rem" }}
                    />
                  </DeleteButton>
                </NewListRow>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 35rem;
  overflow-y: scroll;
`;

const AddGoalButton = styled.button`
  background-color: #bcb9b9;
  display: inline-block;
  color: #faf8f8;
  font-size: 1em;
  /* padding: 1rem; */
  border: none;
  font-weight: bold;

  &:hover {
    filter: brightness(85%);
  }
`;

const GoalInput = styled.input`
  height: 3rem;
  width: 18rem;
  color: black;
  background: #d8d8d8;
  border: none;
  font-size: 1em;

  padding-left: 0.5rem;
  /* border-radius: 0.3rem 0 0 0.3rem; */
`;

const DeleteButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
`;

interface ListRowProps {
  selected: boolean;
  checked: boolean;
  colorMap: Object;
  goal: string;
}

const ListRow = styled.div<ListRowProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  line-height: 2.5rem;
  height: 4rem;
  width: 19.5rem;
  border-radius: 0.3rem;
  margin-top: 2rem;
  background-color: ${props =>
    (props.selected || props.checked) && props.colorMap && props.goal
      ? props.colorMap[props.goal]
      : "#D8D8D8"};
  padding-left: 0.5rem;
  color: black;
  margin-left: 0.5rem;
  font-family: Montserrat, sans-serif;

  &:hover {
    background-color: ${props =>
      props.colorMap && props.goal ? props.colorMap[props.goal] : "#D8D8D8"};
    filter: ${props =>
      props.selected ? "brightness(100%)" : "brightness(85%)"};
  }
`;

const NewListRow = styled.div<ListRowProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
  line-height: 2.5rem;
  height: 5rem;
  width: 19.5rem;
  border-radius: 0.3rem;
  margin-top: 2rem;
  background-color: #D8D8D8;
  filter: ${props => (props.selected ? "brightness(65%)" : "brightness(100%)")};
  padding-left: 0.5rem;
  color: black;
  margin-left: 0.5rem;
  font-family: "Avenir Next" !important;

  &:hover {
    /* background-color: ${props =>
      props.colorMap && props.goal ? props.colorMap[props.goal] : "#D8D8D8"}; */
    filter: ${props =>
      props.selected ? "brightness(65%)" : "brightness(50%)"};
  }
`;

const ListRowInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-left: 0.75rem;
`;

const Circle = styled.span<{ color; selected }>`
  height: 2.5rem;
  width: 2.5rem;
  background-color: ${props => props.color};
  border-radius: 50%;
  /* border: ${props => (props.selected ? "" : "3px solid " + props.color)}; */
`;

const Goal = styled.div`
  color: black;
  font-size: 1rem;
  font-family: "Avenir Next" !important;
  overflow: auto;
  height: 29px;
  margin-bottom: 0;
`;

const StartDate = styled.div`
  color: "#A9A9A9";
  font-size: 0.6rem;
  font-family: "Avenir Next" !important;
  overflow: auto;
  height: 25px;
  padding-bottom: 0.6rem;
`;

const ListRowLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
