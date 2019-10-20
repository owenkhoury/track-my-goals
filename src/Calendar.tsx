import React, { useState } from 'react';
import styled from 'styled-components';
import Day from './Day';

import { animated, useSpring } from 'react-spring';
import { MONTH_DAYS } from './constants/AppConstants';

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
    completedDays,
    colorMap,
    selectedGoals,
    handleDayCompleted,
    handleDayRemoved,
    handleNoteSelected,
    selectedDayForNotes
}) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

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
            week.push(<Day disabled={true} />);
        }

        dayOfWeek = firstOfMonth + 1;

        // USING 35 SO THAT WE GET 5 WEEKS.
        for (let i = 1; i <= MONTH_DAYS[month]; i++) {
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
                    completedDays={completedDays}
                    colorMap={colorMap}
                    handleDayCompleted={handleDayCompleted}
                    disabled={false}
                    handleNoteSelected={handleNoteSelected}
                    selectedDayForNotes={selectedDayForNotes}
                />
            );
            dayOfWeek += 1;
        }

        // fill out the last row with empty days
        for (let unusedDay = 0; unusedDay < 8 - dayOfWeek; unusedDay++) {
            week.push(<Day disabled={true} />);
        }

        myMonth.push(week);
        week = [];

        // Adds a blank row of disabled days so that the size stays the same.
        if (myMonth.length === 7) {
            for (let unusedDay = 0; unusedDay < 7; unusedDay++) {
                week.push(<Day disabled={true} />);
            }

            myMonth.push(week);
        }

        week = [];

        week.push(
            selectedDayForNotes ? (
                <DeselectButton
                    onClick={() => {
                        if (selectedGoals && selectedGoals.length === 1) {
                            handleDayRemoved(selectedDayForNotes.date, selectedGoals[0]);
                        }
                    }}>
                    Remove Day
                </DeselectButton>
            ) : (
                <Day disabled={true} />
            )
        );

        // week.push(<Day disabled={true} />);

        myMonth.push(week);

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

    const calendarYear = getYear(completedDays);

    return (
        <Container style={animatedProps}>
            {calendarYear[curMonth]
                ? calendarYear[curMonth].map((week, idx) => {
                      if (idx === calendarYear[curMonth].length - 1) {
                          return <DeselectWrapper>{week}</DeselectWrapper>;
                      }

                      return <div id={week}>{week}</div>;
                  })
                : null}
        </Container>
    );
}

const Container = styled(animated.div)`
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 22rem;
    margin-top: 1rem;
    overflow: hidden; */

    margin-left: 3rem;

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
    /* margin-left: 22rem; */
    margin-top: 1rem;
    overflow: hidden;

    margin-top: 3rem;
`;

const DayOfWeek = styled.div`
    display: inline-block;
    width: 6rem;
    height: 1rem;
    margin: 0.4375rem;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.15rem;

    color: white;

    @media only screen and (max-width: 1450px) {
        width: 5rem;
    }

    @media only screen and (max-width: 1305px) {
        width: 3.8rem;
    }
`;

const DeselectWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
`;

const DeselectButton = styled.button`
    background-color: #464e50;
    width: 10rem;
    height: 4rem;
    margin-right: 9rem;
    font-family: 'Avenir Next' !important;
    // color: white;
    // border-radius: 0.5rem;

    border-color: #0cc6ce;
    color: #80f2f7;
    border-radius: 0.1rem;

    &:hover {
        filter: ${(props) => (props.disabled ? 'brightness(100%)' : 'brightness(85%)')};
    }

    @media only screen and (max-width: 1450px) {
        width: 7.5rem;
        height: 3rem;
        margin-right: 2rem;
    }

    @media only screen and (max-width: 1305px) {
        width: 3.8rem;
    }
`;
