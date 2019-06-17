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
          {/* <HeaderBar /> */}
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
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
