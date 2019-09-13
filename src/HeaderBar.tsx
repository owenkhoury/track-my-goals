import React, { useState } from 'react';
import styled from 'styled-components';
import { logout } from './utils';

const monthName = {
    1: 'Jan',
    2: 'Feb',
    3: 'mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sept',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
};

export default function HeaderBar({ curMonth, updateCurMonth, toggleAnalytics }) {
    const [analyticsSelected, toggleAnalyticsSelected] = useState(false);

    function clickedAnalytics() {
        toggleAnalyticsSelected(!analyticsSelected);
        toggleAnalytics();
    }

    return (
        <Header>
            <AppTitle>HabitTracker</AppTitle>
            <VerticalBar />
            <MonthAndLogoutContainer>
                <MonthContainer>
                    <CurMonth>{monthName[curMonth] + ' 2019'}</CurMonth>
                    <MonthButton
                        onClick={() => {
                            if (curMonth != 1) {
                                updateCurMonth(curMonth - 1);
                            }
                        }}>
                        Prev
                    </MonthButton>
                    <MonthButton
                        onClick={() => {
                            if (curMonth != 12) {
                                updateCurMonth(curMonth + 1);
                            }
                        }}>
                        Next
                    </MonthButton>
                </MonthContainer>
                <AnalyticsButton onClick={clickedAnalytics} analyticsOn={analyticsSelected}>
                    Analytics
                </AnalyticsButton>
                <Button onClick={logout}>Logout</Button>
            </MonthAndLogoutContainer>
        </Header>
    );
}

const AppTitle = styled.h1`
    font-size: 1.5rem;
    font-family: 'Montserrat', sans-serif;
    color: white;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
`;

const MonthContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

const Header = styled.div`
    /* display: flex;
    flex-direction: row;
    height: 4.4rem;
    background-color: #d8d8d8;
    border-bottom: 2px solid #979797; */

    color: white;

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    height: 4.4rem;
    background-color: #222627;
    border-bottom: 2px solid #47484a;
`;

const MonthAndLogoutContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    background-color: #222627;
`;

const VerticalBar = styled.div`
    border-left: 0rem dotted black; // TODO -- DECIDE IF I WANT THIS BAR HERE
    height: 4.5rem;
    margin-left: 13.7rem;
`;

const CurMonth = styled.div`
    font-size: 2.5rem;
    color: white;
    margin-left: 3rem;
    font-family: 'Montserrat', sans-serif;
    /* font-family: "Avenir Next" !important; */
    margin-right: 1rem;
    padding-left: 1rem;
    margin-left: 3rem;
`;

const MonthButton = styled.button`
    display: inline-block;

    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid;

    border-radius: 3px;
    display: inline-block;
    border-radius: 0.3rem;

    background-color: #1d1f20;
    border-color: #0cc6ce;
    color: #80f2f7;

    &:hover {
        filter: brightness(75%);
    }
`;

const Button = styled.button`
    display: inline-block;

    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
    display: inline-block;
    border-radius: 0.3rem;

    background-color: #1d1f20;
    border-color: #0cc6ce;
    color: #80f2f7;

    &:hover {
        filter: brightness(75%);
    }
`;

const AnalyticsButton = styled.button<{ analyticsOn }>`
    display: inline-block;

    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
    display: inline-block;
    border-radius: 0.3rem;

    border-color: ${(props) => (props.analyticsOn ? 'white' : '#CF2E38')};
    color: ${(props) => (props.analyticsOn ? 'white' : '#CF2E38')};

    background-color: ${(props) => (props.analyticsOn ? '#CF2E38' : '#1d1f20')};
    &:hover {
        filter: brightness(75%);
    }
`;
