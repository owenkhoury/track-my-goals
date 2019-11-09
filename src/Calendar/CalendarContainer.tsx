import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import { animated, useSpring } from 'react-spring';
import Calendar from './Calendar';

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
export default function CalendarContainer({
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
    const props = useSpring({ scroll: 100, from: { scroll: 0 } });
    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <Container style={animatedProps}>
            <Calendar
                curMonth={1}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
            <Calendar
                curMonth={2}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
            <Calendar
                curMonth={3}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
            <Calendar
                curMonth={3}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
            <Calendar
                curMonth={4}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
            <Calendar
                curMonth={5}
                curGoal={curGoal}
                completedDays={completedDays}
                colorMap={colorMap}
                selectedGoals={selectedGoals}
                handleDayCompleted={handleDayCompleted}
                handleDayRemoved={handleDayRemoved}
                handleNoteSelected={handleNoteSelected}
                selectedDayForNotes={selectedDayForNotes}
            />
        </Container>
    );
}

const Container = styled(animated.div)`
    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    margin-top: 1rem;
    overflow: hidden;

    margin-top: 3rem;

    overflow-y: scroll;

    max-height: 80%;
`;

// const DeselectWrapper = styled.div`
//     width: 100%;
//     display: flex;
//     align-items: flex-end;
//     justify-content: flex-end;
// `;

// const DeselectButton = styled.button`
//     background-color: #464e50;
//     width: 10rem;
//     height: 4rem;
//     margin-right: 9rem;
//     font-family: 'Avenir Next' !important;

//     background-color: #1d1f20;
//     border-color: #0cc6ce;
//     color: #80f2f7;
//     border-radius: 0.1rem;

//     &:hover {
//         filter: ${(props) => (props.disabled ? 'brightness(100%)' : 'brightness(85%)')};
//     }

//     @media only screen and (max-width: 1450px) {
//         width: 7.5rem;
//         height: 3rem;
//         margin-right: 2rem;
//     }

//     @media only screen and (max-width: 1305px) {
//         width: 3.8rem;
//     }
// `;
