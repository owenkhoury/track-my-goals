import React, { useEffect } from "react";
import GoalsList from "./GoalList";
import styled from "styled-components";
import Day from "./Day";
import { AppStateProvider, useAppState } from "./app-state";
import appReducer, { initialState } from "./appReducer";
import Calendar from "./Calendar";
import { loadGoals } from "./utils";
import { db } from "./fire";

function App() {
  // useEffect(() => {
  // const goals = loadGoals(dispatch);

  // console.log("here: ", goals);

  // goals.forEach(() => console.log("count++"));

  // dispatch({ type: "GOALS_LOADED", goals });

  //   db.collection("Goals")
  //     .get()
  //     .then(snapshot => {
  //       snapshot.docs.forEach(doc => {
  //         // goals.push(doc.data().Goal);
  //         dispatch({ type: "GOAL_ADDED", newGoal: doc.data.Goal });
  //       });
  //     });
  // }, []);

  // useEffect(() => {
  //   const goals = await loadGoals();
  //   console.log(goals);
  // }, []);

  return (
    <AppContainer>
      <GoalsList />
      <br />
      <br />
      <Calendar />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #efe2ba;
  height: 100%;
  width: auto;
`;

const MyDivRight = styled.div`
  width: "66.6%";
  float: right;
`;

const MyDivLeft = styled.div`
  width: "33.3%";
  float: left;
`;

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
