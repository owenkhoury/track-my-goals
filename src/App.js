import React from "react";
import GoalsList from "./GoalList";
import Calendar from "./Calendar";
import styled from "styled-components";
import { AppStateProvider } from "./app-state";
import appReducer, { initialState } from "./appReducer";

function App() {
  return (
    <AppContainer>
      <GoalsList />
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

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
