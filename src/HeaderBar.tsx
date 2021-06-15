import React, { useState, Fragment } from 'react';
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

    const [calendarSelected, toggleCalendarSelected] = useState(true);

    function clickedAnalytics() {
        toggleAnalyticsSelected(!analyticsSelected);
        toggleCalendarSelected(!calendarSelected);
        toggleAnalytics();
    }

    return (
        <Header>
            <MonthAndLogoutContainer>
                <MonthContainer>
                    <CurMonth>{monthName[curMonth] + ' 2021'}</CurMonth>
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
                <div>
                    <CalendarButton onClick={clickedAnalytics} calendarOn={calendarSelected}>
                        Calendar
                    </CalendarButton>
                    <AnalyticsButton onClick={clickedAnalytics} analyticsOn={analyticsSelected}>
                        Analytics
                    </AnalyticsButton>
                </div>

                <Button onClick={logout}>Logout</Button>
            </MonthAndLogoutContainer>
        </Header>
    );
}

const MonthContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

const Header = styled.div`
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
    font-family: 'Space Mono', sans-serif;
`;

const MonthAndLogoutContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    background-color: #222627;
`;

const CurMonth = styled.div`
    font-size: 2.5rem;
    color: white;
    margin-left: 3rem;
    font-family: 'Space Mono', sans-serif;
    /* font-family: "Space Mono" !important; */
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

const CalendarButton = styled.button<{ calendarOn }>`
    display: inline-block;

    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
    display: inline-block;
    border-radius: 0.3rem;

    border-color: ${(props) => (props.calendarOn ? 'white' : '#086186')};
    color: ${(props) => (props.calendarOn ? 'white' : '#086186')};

    background-color: ${(props) => (props.calendarOn ? '#086186' : '#1d1f20')};
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
