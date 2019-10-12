import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import MultiSelectSquare from './MultiSelectSquare';

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

export default function Day({
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

    const [backgroundColor, setBackgroundColor] = useState('#464e50');

    const [isDaySelected, toggleDaySelected] = useState(false);

    useEffect(() => {
        if (goalsCompletedOnDay && goalsCompletedOnDay.length === 1) {
            setBackgroundColor(colorMap[goalsCompletedOnDay]);
            toggleDaySelected(true);
        } else {
            setBackgroundColor('#464e50');
        }
    }, [goalsCompletedOnDay]);

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
                squares.push(<MultiSelectSquare color={colorMap[goal]} goal={goal} />);
            });
        }
        return squares;
    }

    function getColorDisplay() {
        // check if single select or multi-select.
        if (selectedGoals && selectedGoals.length === 1) {
            return (
                <Button
                    disabled={disabled}
                    onClick={handleDayClicked}
                    isNoteSelected={notesSelected}
                    numGoals={1}
                    isCurrentDay={isTodaysDate}
                    isMultiSelect={selectedGoals.length > 1}>
                    <Container style={{ backgroundColor: `${backgroundColor}` }}>
                        <DayNumber style={{ color: 'white' }}>{day}</DayNumber>
                        {doesDayHaveNote ? (
                            <i
                                className='glyphicon glyphicon-edit'
                                style={{ color: backgroundColor === '#464e50' ? 'black' : 'white' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNoteSelected(myDate, curGoal);
                                }}
                            />
                        ) : null}
                    </Container>
                </Button>
            );
        } else if (selectedGoals && selectedGoals.length > 1) {
            const mutliSelectSquares = createColorSquares();

            return (
                <Button
                    disabled={disabled}
                    onClick={handleDayClicked}
                    isNoteSelected={notesSelected}
                    numGoals={2}
                    isCurrentDay={isTodaysDate}
                    isMultiSelect={selectedGoals.length > 1}>
                    <Container style={{ backgroundColor: '#464e50' }}>
                        <DayNumber style={{ color: 'white' }}>{day}</DayNumber>
                        <Squares>{mutliSelectSquares}</Squares>
                    </Container>
                </Button>
            );
        } else if (disabled) {
            return (
                <Button
                    disabled={true}
                    isNoteSelected={false}
                    numGoals={0}
                    isCurrentDay={false}
                    isMultiSelect={false}
                />
            );
        }
    }

    function handleDayClicked() {
        if (!disabled) {
            if (selectedGoals.length === 1) {
                const goal = selectedGoals[0];

                // THIS IS PRETTTY INEFICIENT.
                const isDayCompleted =
                    completedDays &&
                    completedDays[goal] &&
                    completedDays[goal].filter((day) => day.date === myDate).length > 0;

                if (!isDayCompleted) {
                    handleDayCompleted(myDate, goal);
                }

                handleNoteSelected(myDate, curGoal);
            }
        }
    }

    const display = getColorDisplay();

    return <Fragment>{display}</Fragment>;
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
    height: 100%;
`;

const Button = styled.button<{ disabled; isNoteSelected; numGoals; isCurrentDay; isMultiSelect }>`
    font-family: 'Avenir Next' !important;
    padding: 0;
    display: inline-block;
    height: ${(props) => (props.disabled ? '100%' : '6rem')};
    width: 6rem;
    -webkit-text-fill-color: ${(props) => (props.disabled ? 'transparent' : 'none')};
    font-size: 1em;
    margin: 0.4375rem;
    border: ${(props) => (props.disabled ? 'none;' : props.isCurrentDay ? '2px solid white' : '2px solid #6B7A8F')};
    border-radius: 3px;
    text-align: right;

    filter: ${(props) => (props.isNoteSelected || props.isMultiSelect ? 'none' : 'brightness(75%)')};
    &:hover {
        filter: ${(props) => (props.numGoals === 1 || props.isMultiSelect ? 'none' : 'brightness(75%)')};
    }

    // Size the square based on the width of the browser window.
    @media only screen and (max-width: 1450px) {
        height: ${(props) => (props.disabled ? '100%' : '5rem')};
        width: 5rem;
    }

    @media only screen and (max-width: 1305px) {
        height: ${(props) => (props.disabled ? '100%' : '3.8rem')};
        width: 3.8rem;
    }

    margin-top: 0.3rem;
`;
