import React, { useEffect, Fragment } from 'react';
import { AppStateProvider } from './app-state';
import appReducer, { initialState } from './appReducer';
import LoggedOut from './LoggedOut';
import LoggedIn from './LoggedIn';

import useAuth from './useAuth';

function App() {
    const { authAttempted, auth } = useAuth();

    useEffect(() => {
        document.getElementById('root').style.overflow = 'hidden';
    });

    if (!authAttempted) return null;
    return <Fragment>{auth ? <LoggedIn /> : <LoggedOut />}</Fragment>;
}

export default () => (
    <AppStateProvider reducer={appReducer} initialState={initialState}>
        <App />
    </AppStateProvider>
);
