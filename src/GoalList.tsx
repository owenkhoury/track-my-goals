import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { createGoal, deleteGoal, removeDaysCompleted } from "./utils";
import useAuth from "./useAuth";

import "./App.scss";

import DeleteModal from "./DeleteModal";
import { getWindowDimensions } from "./Calendar";

export default function GoalsList({
  existingGoals,
  selected,
  colorMap,
  updateSelected,
  addToColorMap,
  removeFromColorMap,
  handleGoalSelected,
  handleGoalRemoved,
  selectedGoals,
  creationDateMap
}) {
  const { auth } = useAuth();

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    console.log("dimensions: ", windowDimensions);
    setWindowDimensions(getWindowDimensions());
  });

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(existingGoals);

  const [wasGoalSelectedOnLoad, setWasGoalSelectedOnLoad] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [goalToDelete, setGoalToDelete] = useState(null);

  const [curIdx, setCurIdx] = useState(null);

  useEffect(() => {
    setGoals(existingGoals);
  }, [existingGoals]);

  // TODO -- THE CHECK BOXES ARE MESSED UP WHEN DELETING
  // DON'T SET THE DELETED GOAL AS SELECTED, JUST USE SEPARATE STATE.
  function handleDelete(goal: string, idx: number) {
    deleteGoal(auth.uid, goal);
    setGoals(goals.filter(g => g !== goal));
    removeDaysCompleted(auth.uid, goal);

    handleGoalRemoved(goal);

    // Check if there are still goals remaining after this delete.
    if (goals.length - 1 > 0) {
      const nextGoalIdx = idx === 0 ? idx + 1 : idx - 1;
      updateSelected(goals[nextGoalIdx]);
      handleGoalSelected(goals[nextGoalIdx], goals[idx]);
    }

    setShowDeleteModal(false);
  }

  return (
    <GoalContainer deleteModalShowing={showDeleteModal}>
      {showDeleteModal ? (
        <DeleteModal
          onClick={() => setShowDeleteModal(false)}
          onDelete={() => handleDelete(goalToDelete, curIdx)}
        />
      ) : null}
      <AppTitle />
      {showDeleteModal ? null : (
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
      )}
      <ListContainer windowHeight={windowDimensions.height}>
        {goals && !showDeleteModal
          ? goals.map((goal, idx) => {
              return (
                <NewListRow
                  // style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
                  selected={goal === selectedGoals[0]}
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
                      selected={goal === selectedGoals[0]}
                      color={
                        colorMap && colorMap[goal] ? colorMap[goal] : "red"
                      }
                      className="dot"
                    />
                    <ListRowInfo>
                      <Goal>{goal}</Goal>
                      <StartDate>{creationDateMap[goal]}</StartDate>
                    </ListRowInfo>
                  </ListRowLeft>

                  <ListRowRight>
                    <Checkbox>
                      <input
                        id={goal}
                        type="checkbox"
                        defaultChecked={idx === 0}
                        onClick={e => {
                          e.stopPropagation();
                          let checkbox = document.getElementById(
                            goal
                          ) as HTMLInputElement;

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
                    </Checkbox>{" "}
                    <DeleteButton
                      onClick={e => {
                        e.stopPropagation();
                        setGoalToDelete(goal);
                        setCurIdx(goals.indexOf(goal));
                        setShowDeleteModal(true);
                      }}
                    >
                      {" "}
                      <i
                        className="glyphicon glyphicon-trash"
                        style={{ paddingRight: ".5rem" }}
                      />
                    </DeleteButton>
                  </ListRowRight>
                </NewListRow>
              );
            })
          : null}
      </ListContainer>
    </GoalContainer>
  );
}

const GoalContainer = styled.div<{ deleteModalShowing }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: #0d160a;
  font-family: Helvetica;
  position: absolute;
  height: 100%;
  width: 25rem;
  background: ${props =>
    props.deleteModalShowing ? "rgba(0, 0, 0, 0.6)" : null};
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

const ListContainer = styled.div<{ windowHeight }>`
  display: flex;
  direction: rtl;
  flex-direction: column;
  align-items: center;
  height: ${props =>
    props.windowHeight ? `${props.windowHeight - 320}px` : "35rem"};
  overflow-y: scroll;
  margin-top: 2rem;
  padding-left: 0.5rem;
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

const NewListRow = styled.div<ListRowProps>`
  display: flex;
  direction: ltr;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
  line-height: 2.5rem;
  height: 5rem;
  margin-bottom: 2rem;
  width: 19.5rem;
  border-radius: 0.3rem;
  border: 1px solid #565656;
  /* margin-top: 2rem; */
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
  border: .04rem solid black;
  /* border: ${props => (props.selected ? "" : "3px solid " + props.color)}; */
`;

const Goal = styled.div`
  color: black;
  font-size: 1rem;
  font-family: "Avenir Next" !important;
  overflow: auto;
  height: 29px;
  margin-bottom: 0;
  overflow-y: hidden; // hide vertical
  overflow-x: hidden;
`;

const StartDate = styled.div`
  color: "#A9A9A9";
  font-size: 0.6rem;
  font-family: "Avenir Next" !important;
  overflow-y: hidden; // hide vertical
  overflow-x: hidden;
  height: 25px;
  padding-bottom: 0.6rem;
`;

const ListRowLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ListRowRight = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const Checkbox = styled.label`
  margin-right: 0rem;
  width: 3rem;
`;
