import React from 'react';
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

export default function HeaderBar({ curMonth, updateCurMonth }) {
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
                <Button onClick={logout}>Logout</Button>
            </MonthAndLogoutContainer>
        </Header>
    );
}

const AppTitle = styled.h1`
    font-size: 1.5rem;
    font-family: 'Montserrat', sans-serif;
    color: #0d160a;
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
    display: flex;
    flex-direction: row;
    height: 4.4rem;
    background-color: #d8d8d8; // #e3e3e3; // #d8d8d8; // #c2c2c2;
    border-bottom: 2px solid #979797;
`;

const MonthAndLogoutContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    background-color: #d8d8d8;
`;

const VerticalBar = styled.div`
    border-left: 0rem dotted black; // TODO -- DECIDE IF I WANT THIS BAR HERE
    height: 4.5rem;
    margin-left: 13.7rem;
`;

const CurMonth = styled.div`
    font-size: 2.5rem;
    color: #0d160a;
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

    background-color: #ededed;
    border-color: #09868b;
    color: #09868b;

    &:hover {
        background-color: #bcb9b9;
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

    border-color: #09868b;
    color: #09868b;

    &:hover {
        background-color: #bcb9b9;
    }
`;
