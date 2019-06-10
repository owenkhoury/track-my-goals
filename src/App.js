import React, { useEffect } from "react";
import GoalsList from "./GoalList";
import styled from "styled-components";
import { AppStateProvider, useAppState } from "./app-state";
import appReducer, { initialState } from "./appReducer";
import LoggedOut from "./LoggedOut";

import useAuth from "./useAuth";

function App() {
  const { authAttempted, auth } = useAuth();
  if (!authAttempted) return null;

  return (
    <div>
      {auth ? (
        <AppContainer>
          <GoalsList />
        </AppContainer>
      ) : (
        <LoggedOut />
      )}
    </div>
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
