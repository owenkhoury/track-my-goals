import React, { useState, useEffect } from 'react';
import GoalsList from './GoalList';
import { AppStateProvider } from './app-state';
import appReducer, { initialState } from './appReducer'

function App() {
  // Ask Ali or someone about this
  // const [myGoals, setMyGoals] = useState(fetchGoals())

  // const [myGoals, setMyGoals] = useState(["Workout", "Meditate", "Eat Healthy"]);
  // const [newGoal, setNewGoal] = useState('');

  // const [{}]

  // const dummyGoals = ["Workout", "Meditate", "Eat Healthy"];

  return (
    <React.Fragment>
      <GoalsList />
    </React.Fragment>
  )
}

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
