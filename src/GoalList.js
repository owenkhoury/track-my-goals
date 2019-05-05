import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createGoal, fetchGoals } from './utils';
import { useAppState } from './app-state';

export default function GoalsList() {    

    const [{goals}, dispatch] = useAppState();

    const [newGoal, setNewGoal] = useState('')

    useEffect(() => { 
        console.log('Goals: ', goals.map((goal) => {console.log(goal)}))
    }, []);

    return (
        <ListRowContainer>  
            {
                goals.map((goal) => {
                    return (
                        <ListRow>{goal}</ListRow>
                    );
                })
            }
            <ListRow>
            <input 
                type='text'
                onChange={(e) => setNewGoal(e.target.value)}
            />
            <button onClick={() => {
                createGoal(newGoal);

                dispatch({ type: 'GOAL_ADDED', newGoal })

                setNewGoal('');
            }}>
            Add goal
            </button>
            </ListRow>
        </ListRowContainer>
    )
}

const ListRowContainer = styled.div`
    // box-sizing: border-box;
    // flex: 0 0 auto;
    // flex-basis: '33.3%';
    // max-width: '33.3%';
    padding-right: 1em;
    padding-left: 6em;
    padding-top: 6em;
`;

const ListRow = styled.div`
    height: 50px;
    width: 300px;
    background-color: #32CD32;
    border: 5px solid black;
    padding-top : 20px;
`;
