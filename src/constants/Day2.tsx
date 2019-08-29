import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';

interface Day {
    completedColor?;
    curGoal?; // shouldn't need this
    day?;
    month?;
    year?;
    goalsCompletedOnDay?;
    selectedGoals?;
    colorMap?;
    handleDayCompleted?;
    completedDays?;
    disabled?;
    handleNoteSelected?;
    selectedDayForNotes?;
}

export default function Day2({
    completedColor,
    curGoal, // shouldn't need this
    day,
    month,
    year,
    goalsCompletedOnDay,
    selectedGoals,
    colorMap,
    handleDayCompleted,
    completedDays,
    disabled,
    handleNoteSelected,
    selectedDayForNotes
}: Day) {
    const [myDate, setMyDate] = useState('');

    const [isTodaysDate, setIsTodaysDate] = useState(false);

    const [doesDayHaveNote, setDayHasNote] = useState(false);

    const [notesSelected, setNotesSelected] = useState(false);

    useEffect(() => {
        console.log('day2: ', goalsCompletedOnDay, day);
    });

    useEffect(() => {
        if (completedDays && completedDays[curGoal]) {
            const day = completedDays[curGoal].find((e) => {
                return e.date === myDate;
            });

            if (day && day.notes && day.notes.length) {
                setDayHasNote(true);
            } else {
                setDayHasNote(false);
            }
        }
    }, [completedDays, curGoal]);

    useEffect(() => {
        if (month && day && year) {
            const date =
                month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') + '-' + year.toString();
            setMyDate(date);

            if (selectedDayForNotes) {
                setNotesSelected(date == selectedDayForNotes.date);
            }

            let today: any = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            today = mm + '-' + dd + '-' + yyyy;

            if (date == today) {
                setIsTodaysDate(true);
            } else {
                setIsTodaysDate(false);
            }
        }
    }, [month, day, year, selectedDayForNotes]);

    function createColorSquares() {
        const squares = [];

        if (goalsCompletedOnDay) {
            goalsCompletedOnDay.forEach((goal) => {
                squares.push(<MultiSelectSquare color={colorMap[goal]} />);
            });
        }

        console.log('squres: ', squares);

        return squares;
    }

    const mutliSelectSquares = createColorSquares();

    return (
        <Button>
            <Container>
                <DayNumber>{day}</DayNumber>
                <Squares>{mutliSelectSquares}</Squares>
            </Container>
        </Button>
    );
}

const Squares = styled.div`
    display: flex;
    padding-left: 0.2rem;
    flex-flow: row wrap;
`;

const DayNumber = styled.div`
    padding-right: 0.5rem;
    padding-top: 0.3rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 6rem;
    background-color: #d8d8d8;
`;

const MultiSelectSquare = styled.div<{ color }>`
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${(props) => props.color};
    border-radius: 2px;
    border: 0.5px solid black;
    margin: 0.1rem;
`;

interface ButtonProps {}

const Button = styled.button<ButtonProps>`
    font-family: 'Avenir Next' !important;
    padding: 0;
    display: inline-block;
    height: 6rem;
    width: 6rem;
    // -webkit-text-fill-color: ${(props) => (props.disabled ? 'transparent' : 'none')};
    font-size: 1em;
    margin: 0.4375rem;
    // border: ${(props) => (props.disabled ? '2px solid #f1f1f1;' : '2px solid #6B7A8F')};
    border: 2px solid #6B7A8F;
    border-radius: 3px;
    text-align: right;

    &:hover {
        filter: ${(props) => (props.disabled ? 'brightness(100%)' : 'brightness(85%)')};
    }

    height: 100%;

    margin-top: 0.3rem;
`;
