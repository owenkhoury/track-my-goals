import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { createGoal, deleteGoal, removeDaysCompleted } from './utils';
import useAuth from './useAuth';

import './App.scss';

import { getWindowDimensions } from './Calendar';
import DeleteGoalRow from './DeleteGoalRow';
import GoalRow from './GoalRow';

export default function GoalsList({
    existingGoals,
    colorMap,
    updateSelected,
    addToColorMap,
    removeFromColorMap,
    handleGoalSelected,
    handleGoalRemoved,
    selectedGoals,
    creationDateMap,
    selectAllGoals
}) {
    const { auth } = useAuth();

    // This is the goal that is currently typed into the new goal input.
    const [newGoal, setNewGoal] = useState('');

    // List of goals that are in the pre-delete state.
    const [goalsToDelete, setGoalsToDelete] = useState([]);

    // All of the goals
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

    /**
     * When 'Select all' is clicked, set every goal's checkbox to be checked.
     * @param goals
     */
    function checkAllCheckmarks(goals: string[]) {
        goals.forEach((goal) => {
            if (document.getElementById(goal) as HTMLInputElement) {
                (document.getElementById(goal) as HTMLInputElement).checked = true;
            }
        });
    }

    function readyToDelete(goal: string) {
        setGoalsToDelete([...goalsToDelete, goal]);
    }

    return (
        <GoalContainer>
            <InnerContainer>
                <AppTitle>My Goals</AppTitle>
                <InputContainer>
                    <MyForm>
                        <GoalInput
                            type='text'
                            placeholder='Enter your next goal ...'
                            onChange={(e) => {
                                setNewGoal(e.target.value);
                            }}
                            onSubmit={(e) => {
                                return false;
                            }}
                            onKeyPress={(e) => {
                                if (e.keyCode === 13 || e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
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
                <SelectAll
                    onClick={() => {
                        selectAllGoals(goals);
                        checkAllCheckmarks(goals);
                    }}>
                    Select All
                </SelectAll>
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
                                          <GoalRow
                                              index={idx}
                                              goal={goal}
                                              goals={goals}
                                              goalsToDelete={goalsToDelete}
                                              colorMap={colorMap}
                                              selectedGoals={selectedGoals}
                                              creationDateMap={creationDateMap}
                                              handleGoalSelected={handleGoalSelected}
                                              handleGoalRemoved={handleGoalRemoved}
                                              updateSelected={updateSelected}
                                              readyToDelete={readyToDelete}
                                          />
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

const AppTitle = styled.div`
    color: white;
    margin-bottom: 1rem;
    font-family: 'Avenir Next';
    font-size: 1.5rem;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    margin-top: 1rem;
`;

const GoalContainer = styled.div`
    background-color: #1c1e1f;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    font-family: Helvetica;
    height: 100%;
    width: 25rem;
    border-right: 1.5px solid #47484a;
`;

const InputContainer = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
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
    flex-direction: column;
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

const SelectAll = styled.button`
    margin-top: 1rem;
    width: 8rem;

    background-color: #1d1f20;
    border-color: #0cc6ce;
    color: #80f2f7;

    border: 2px solid;
    font-size: 1em;

    filter: brightness(75%);

    &:hover {
        filter: brightness(50%);
    }
`;

const GoalInput = styled.input`
    border: 2px solid;

    height: 3rem;
    width: 18rem;
    color: #9a968f;
    font-size: 1em;
    background-color: #464e50;
    padding-left: 0.5rem;
    /* border-radius: 0.3rem 0 0 0.3rem; */

    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #f5f5f5;
    }
    ::-moz-placeholder {
        /* Firefox 19+ */
        color: #f5f5f5;
    }
    :-ms-input-placeholder {
        /* IE 10+ */
        color: #f5f5f5;
    }
    :-moz-placeholder {
        /* Firefox 18- */
        color: #f5f5f5;
    }
`;

const AddGoalButton = styled.button`
    background-color: #2b2f31;
    display: inline-block;

    font-size: 1em;
    /* padding: 1rem; */

    font-weight: bold;

    height: 100%;

    &:hover {
        filter: brightness(85%);
    }
`;
