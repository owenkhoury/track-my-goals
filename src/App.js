import React from "react";
import styled from "styled-components";
import { AppStateProvider } from "./app-state";
import appReducer, { initialState } from "./appReducer";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

import useAuth from "./useAuth";

function App() {
  const { authAttempted, auth } = useAuth();
  if (!authAttempted) return null;

  return (
    <Container>
      {auth ? (
        <AppContainer>
          <LoggedIn />
        </AppContainer>
      ) : (
        <LoggedOut />
      )}
    </Container>
  );
}

const Container = styled.div`
  overflow-y: hidden;
  height: 100%;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
`;

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
