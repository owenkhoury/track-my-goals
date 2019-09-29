import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { createGoal, deleteGoal, removeDaysCompleted } from './utils';
import useAuth from './useAuth';

import './App.scss';

import { getWindowDimensions } from './Calendar';
import DeleteGoalRow from './DeleteGoalRow';

export default function GoalsList({
    existingGoals,
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

    // This is the goal that is currently typed into the new goal input.
    const [newGoal, setNewGoal] = useState('');

    // List of goals that are in the pre-delete state.
    const [goalsToDelete, setGoalsToDelete] = useState([]);

    // The list of the existing goals.
    const [goals, setGoals] = useState(existingGoals);

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        setWindowDimensions(getWindowDimensions());
    }, []);

    useEffect(() => {
        setGoals(existingGoals);
    }, [existingGoals]);

    // TODO -- THE CHECK BOXES ARE MESSED UP WHEN DELETING
    // DON'T SET THE DELETED GOAL AS SELECTED, JUST USE SEPARATE STATE.
    function handleDelete(goal: string, idx: number) {
        deleteGoal(auth.uid, goal);
        setGoals(goals.filter((g) => g !== goal));
        removeDaysCompleted(auth.uid, goal);

        removeFromColorMap(goal);

        handleGoalRemoved(goal);

        // Check if there are still goals remaining after this delete.
        if (goals.length - 1 > 0) {
            const nextGoalIdx = idx === 0 ? idx + 1 : idx - 1;
            updateSelected(goals[nextGoalIdx]);
            handleGoalSelected(goals[nextGoalIdx], goals[idx]);
        }
    }

    function undoDelete(goal: string) {
        let update = JSON.parse(JSON.stringify(goalsToDelete));
        update = update.filter((g) => g != goal);

        setGoalsToDelete(update);
    }

    return (
        <GoalContainer>
            <InnerContainer>
                <InputContainer>
                    <MyForm>
                        <GoalInput
                            type='text'
                            placeholder='Enter your next habit'
                            onChange={(e) => setNewGoal(e.target.value)}
                        />
                        <AddGoalButton
                            type='reset'
                            onClick={() => {
                                if (newGoal.length > 0 && !goals.includes(newGoal)) {
                                    const goalColor = addToColorMap(newGoal);
                                    createGoal(auth.uid, newGoal, goalColor);

                                    if (goals.includes(newGoal)) {
                                        updateSelected(newGoal);
                                    }

                                    setNewGoal('');
                                    setGoals([...goals, newGoal]);
                                }
                            }}>
                            ADD
                        </AddGoalButton>
                    </MyForm>
                </InputContainer>
                <ListContainer windowHeight={windowDimensions.height}>
                    {goals
                        ? goals.map((goal, idx) => {
                              return (
                                  <Fragment>
                                      {goalsToDelete.includes(goal) ? (
                                          <DeleteGoalRow
                                              goal={goal}
                                              index={idx}
                                              undoDelete={() => undoDelete(goal)}
                                              confirmDelete={(goalToDelete, index) => handleDelete(goalToDelete, index)}
                                          />
                                      ) : (
                                          <NewListRow
                                              // selected={goal === selectedGoals[0]}
                                              selected={selectedGoals.includes(goal)}
                                              checked={
                                                  (document.getElementById(goal) as HTMLInputElement) &&
                                                  (document.getElementById(goal) as HTMLInputElement).checked
                                              }
                                              colorMap={colorMap}
                                              goal={goal}
                                              toDelete={goalsToDelete.includes(goal)}
                                              onClick={() => {
                                                  if (goals.includes(goal)) {
                                                      if (selectedGoals) {
                                                          selectedGoals.forEach((element) => {
                                                              if (
                                                                  document.getElementById(element) as HTMLInputElement
                                                              ) {
                                                                  (document.getElementById(
                                                                      element
                                                                  ) as HTMLInputElement).checked = false;
                                                              }
                                                          });
                                                      }

                                                      // Set as selected and check this rows checkbox, remove the previously selected from the selectedList.
                                                      handleGoalSelected(goal, selectedGoals);
                                                      updateSelected(goal);

                                                      (document.getElementById(
                                                          goal
                                                      ) as HTMLInputElement).checked = true;
                                                  }
                                              }}>
                                              <ListRowLeft>
                                                  <Circle
                                                      color={colorMap && colorMap[goal] ? colorMap[goal] : 'red'}
                                                      className='dot'
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
                                                          type='checkbox'
                                                          defaultChecked={idx === 0}
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              let checkbox = document.getElementById(
                                                                  goal
                                                              ) as HTMLInputElement;

                                                              if (checkbox.checked) {
                                                                  handleGoalSelected(goal);
                                                              } else if (selectedGoals.length === 1) {
                                                                  e.preventDefault();
                                                              } else {
                                                                  handleGoalRemoved(goal);
                                                              }
                                                          }}
                                                      />
                                                  </Checkbox>{' '}
                                                  <DeleteButton
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setGoalsToDelete([...goalsToDelete, goal]);

                                                          // update local state of rows in delete state
                                                          setGoalsToDelete([...goalsToDelete, goal]);
                                                      }}>
                                                      {' '}
                                                      <DeleteIcon className='glyphicon glyphicon-trash' />
                                                  </DeleteButton>
                                              </ListRowRight>
                                          </NewListRow>
                                      )}
                                  </Fragment>
                              );
                          })
                        : null}
                </ListContainer>
            </InnerContainer>
        </GoalContainer>
    );
}

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    margin-top: 3rem;
`;

const GoalContainer = styled.div`
    /* display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    font-family: Helvetica;
    position: absolute;
    height: 100%;
    width: 25rem;
    border-right: 1.5px solid #d0d0d0; */

    background-color: #1c1e1f;

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    font-family: Helvetica;
    // position: absolute;
    height: 100%;
    width: 25rem;
    border-right: 1.5px solid #47484a;
`;

const InputContainer = styled.div`
    /* display: flex;
    flex-direction: row; */

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
`;

const MyForm = styled.form`
    display: flex;
    flex-direction: row;
`;

const ListContainer = styled.div<{ windowHeight }>`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    direction: rtl;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    display: flex;
    direction: rtl;
    flex-direction: column;
    align-items: center;
    height: ${(props) => (props.windowHeight ? `${props.windowHeight - 330}px` : '35rem')};
    overflow-y: scroll;
    margin-top: 2rem;
    padding-left: 0.5rem;
`;

const AddGoalButton = styled.button`
    background-color: #2b2f31;
    display: inline-block;
    color: #faf8f8;
    font-size: 1em;
    /* padding: 1rem; */
    border: none;
    font-weight: bold;

    height: 100%;

    &:hover {
        filter: brightness(85%);
    }
`;

const DeleteIcon = styled.i`
    padding-right: 0.5rem;
    &:hover {
        filter: brightness(85%);
        color: red;
    }
`;

const GoalInput = styled.input`
    height: 3rem;
    width: 18rem;
    color: 9a968f;
    background: #d8d8d8;
    border: none;
    font-size: 1em;

    background-color: #464e50;

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
    toDelete: boolean; // check if this row is in deleting state (user clicked delete button but waiting for confirmation / cancellation).
}

const NewListRow = styled.div<ListRowProps>`
  display: flex;
  direction: ltr;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
  line-height: 2.5rem;
  height: 4.2rem;
  margin-bottom: 2rem;
  width: 19.5rem;
  border-radius: 0.3rem;
  border: 1px solid #888888;
  /* margin-top: 2rem; */
  background-color: ${(props) => (props.toDelete ? 'red' : '#464e50')}; 
  filter: ${(props) => (props.selected ? 'brightness(65%)' : 'brightness(100%)')};
  padding-left: 0.5rem;
  color: white;
  margin-left: 0.5rem;
  font-family: "Avenir Next" !important;

  &:hover {
    /* background-color: ${(props) => (props.colorMap && props.goal ? props.colorMap[props.goal] : '#d8d8d8')}; */
    filter: ${(props) => (props.selected ? 'brightness(65%)' : 'brightness(50%)')};
  }
`;

const ListRowInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding-left: 0.75rem;
`;

const Circle = styled.span<{ color }>`
    height: 2.5rem;
    width: 2.5rem;
    background-color: ${(props) => props.color};
    border-radius: 50%;
    border: 0.04rem solid black;
`;

const Goal = styled.div`
    color: white;
    font-size: 1rem;
    font-family: 'Avenir Next' !important;
    overflow: auto;
    height: 29px;
    margin-bottom: 0;
    overflow-y: hidden; // hide vertical
    overflow-x: hidden;
`;

const StartDate = styled.div`
    color: '#A9A9A9';
    font-size: 0.6rem;
    font-family: 'Avenir Next' !important;
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
