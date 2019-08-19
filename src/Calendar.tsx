import React, { useState } from 'react';
import styled from 'styled-components';
import Day from './Day';

import { useTransition, animated } from 'react-spring';

export function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

/**
 * NOTES -- Re-renders on every goal selection
 */
export default function Calendar({
    curMonth,
    curGoal,
    newCompletedDays,
    colorMap,
    selectedGoals,
    handleDayCompleted,
    handleDayRemoved,
    handleNoteSelected
}) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    const monthDays = {
        '01': 31,
        '02': 28,
        '03': 31,
        '04': 30,
        '05': 31,
        '06': 30,
        '07': 31,
        '08': 31,
        '09': 30,
        '10': 31,
        '11': 30,
        '12': 31
    };

    const DaysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    function getMonth(month, completedDays) {
        const myMonth = [[]];
        let dayOfWeek = 1;
        let week = [];

        // Dynamically adjust the number of rows in the calendar as the window resizes.
        // const daysPerRow = Math.floor(windowDimensions.width / 180);
        const daysPerRow = 7;

        let firstOfMonth: any = month.toString().padStart(2, '0') + '-01-2019';
        firstOfMonth = new Date(firstOfMonth).getDay();

        // Add in a row for the days of the week
        for (let day = 0; day < 7; day++) {
            week.push(<DayOfWeek>{DaysOfWeek[day]}</DayOfWeek>);
        }

        myMonth.push(week);
        week = [];

        // Add in blank days until the first day of the month.
        for (let unusedDay = 0; unusedDay < firstOfMonth; unusedDay++) {
            week.push(
                <Day
                    completedColor={null}
                    day={null}
                    month={null}
                    year={null}
                    goalsCompletedOnDay={null}
                    selectedGoals={null}
                    newCompletedDays={null}
                    colorMap={null}
                    handleDayCompleted={null}
                    handleDayRemoved={null}
                    curGoal={curGoal}
                    disabled={true}
                    handleNoteSelected={handleNoteSelected}
                />
            );
        }

        dayOfWeek = firstOfMonth + 1;

        // USING 35 SO THAT WE GET 5 WEEKS.
        for (let i = 1; i <= monthDays[month]; i++) {
            const date =
                month.toString().padStart(2, '0') +
                '-' +
                i
                    .toString()
                    .toString()
                    .padStart(2, '0') +
                '-' +
                '2019';

            if (dayOfWeek === daysPerRow + 1) {
                myMonth.push(week);
                dayOfWeek = 1;
                week = [];
            }

            let goalsCompletedOnDay = [];
            selectedGoals.forEach((selectedGoal) => {
                if (
                    completedDays[selectedGoal] &&
                    completedDays[selectedGoal].filter((day) => day.date === date).length > 0 //.indexOf(date) > -1
                ) {
                    goalsCompletedOnDay.push(selectedGoal);
                }
            });

            week.push(
                <Day
                    completedColor={colorMap ? colorMap[curGoal] : 'green'}
                    curGoal={curGoal}
                    day={i}
                    month={parseInt(month)}
                    year={2019}
                    goalsCompletedOnDay={goalsCompletedOnDay}
                    selectedGoals={selectedGoals}
                    newCompletedDays={newCompletedDays}
                    colorMap={colorMap}
                    handleDayCompleted={handleDayCompleted}
                    handleDayRemoved={handleDayRemoved}
                    disabled={false}
                    handleNoteSelected={handleNoteSelected}
                />
            );
            dayOfWeek += 1;
        }

        // fill out the last row with empty days
        for (let unusedDay = 0; unusedDay < 8 - dayOfWeek; unusedDay++) {
            week.push(
                <Day
                    completedColor={null}
                    day={null}
                    month={null}
                    year={null}
                    goalsCompletedOnDay={null}
                    selectedGoals={null}
                    newCompletedDays={null}
                    colorMap={null}
                    handleDayCompleted={null}
                    handleDayRemoved={null}
                    curGoal={curGoal}
                    disabled={true}
                    handleNoteSelected={handleNoteSelected}
                />
            );
        }

        myMonth.push(week);
        week = [];

        // Adds a blank row of disabled days so that the size stays the same.
        if (myMonth.length === 7) {
            for (let unusedDay = 0; unusedDay < 7; unusedDay++) {
                week.push(
                    <Day
                        completedColor={null}
                        day={null}
                        month={null}
                        year={null}
                        goalsCompletedOnDay={null}
                        selectedGoals={null}
                        newCompletedDays={null}
                        colorMap={null}
                        handleDayCompleted={null}
                        handleDayRemoved={null}
                        curGoal={curGoal}
                        disabled={true}
                        handleNoteSelected={handleNoteSelected}
                    />
                );
            }

            myMonth.push(week);
        }

        return myMonth;
    }

    function getYear(completedDays) {
        const calendarYear = {};
        for (let i = 1; i <= 12; i++) {
            let monthNum = i.toString();
            monthNum = monthNum.length === 1 ? '0' + monthNum : monthNum;

            const month = getMonth(monthNum, completedDays);
            calendarYear[i] = month;
        }
        return calendarYear;
    }

    const calendarYear = getYear(newCompletedDays);

    return (
        <Container>
            {calendarYear[curMonth]
                ? calendarYear[curMonth].map((week) => {
                      return <div id={week}>{week}</div>;
                  })
                : null}
        </Container>
    );
}

const Container = styled.div`
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 22rem;
    margin-top: 1rem;
    overflow: hidden; */

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-left: 22rem;
    margin-top: 1rem;
    overflow: hidden;
`;

const DayOfWeek = styled.div`
    display: inline-block;
    width: 6rem;
    height: 1rem;
    margin: 0.4375rem;
    margin-bottom: 2rem;
    text-align: center;
`;
