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

    const [backgroundColor, setBackgroundColor] = useState('#d8d8d8');

    const [isDaySelected, toggleDaySelected] = useState(false);

    useEffect(() => {
        if (goalsCompletedOnDay && goalsCompletedOnDay.length === 1) {
            setBackgroundColor(colorMap[goalsCompletedOnDay]);
            toggleDaySelected(true);
        } else {
            setBackgroundColor('#d8d8d8');
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
                squares.push(<MultiSelectSquare color={colorMap[goal]} />);
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
                    style={{
                        filter: notesSelected ? 'brightness(85%)' : 'brightness(100%)'
                    }}>
                    <Container style={{ backgroundColor: `${backgroundColor}` }}>
                        <DayNumber style={{ color: 'white' }}>{day}</DayNumber>
                        {isTodaysDate ? (
                            <i
                                className='glyphicon glyphicon-time'
                                style={{ color: 'white', marginRight: '.2rem', marginTop: '.3rem' }}
                            />
                        ) : null}
                        {doesDayHaveNote ? (
                            <i
                                className='glyphicon glyphicon-edit'
                                style={{ color: backgroundColor === '#d8d8d8' ? 'black' : 'white' }}
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
                    style={{
                        filter: notesSelected ? 'brightness(85%)' : 'brightness(100%)'
                    }}>
                    <Container>
                        <DayNumber>{day}</DayNumber>
                        <Squares>{mutliSelectSquares}</Squares>
                    </Container>
                </Button>
            );
        } else if (disabled) {
            return <Button disabled={true} />;
        }
    }

    function handleDayClicked() {
        if (!disabled) {
            if (selectedGoals.length === 1) {
                const goal = selectedGoals[0];

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

const Button = styled.button<{ disabled }>`
    font-family: 'Avenir Next' !important;
    padding: 0;
    display: inline-block;
    height: 6rem;
    width: 6rem;
    -webkit-text-fill-color: ${(props) => (props.disabled ? 'transparent' : 'none')};
    font-size: 1em;
    margin: 0.4375rem;
    border: ${(props) => (props.disabled ? '2px solid #f1f1f1;' : '2px solid #6B7A8F')};
    border-radius: 3px;
    text-align: right;

    &:hover {
        filter: ${(props) => (props.disabled ? 'brightness(100%)' : 'brightness(85%)')};
    }

    height: 100%;

    margin-top: 0.3rem;
`;

// import React, { useEffect, Fragment, useState } from 'react';
// import styled from 'styled-components';

// interface Day {
//     completedColor?;
//     curGoal?; // shouldn't need this
//     day?;
//     month?;
//     year?;
//     goalsCompletedOnDay?;
//     selectedGoals?;
//     colorMap?;
//     handleDayCompleted?;
//     completedDays?;
//     disabled?;
//     handleNoteSelected?;
//     selectedDayForNotes?;
// }

// export default function Day({
//     completedColor,
//     curGoal, // shouldn't need this
//     day,
//     month,
//     year,
//     goalsCompletedOnDay,
//     selectedGoals,
//     colorMap,
//     handleDayCompleted,
//     completedDays,
//     disabled,
//     handleNoteSelected,
//     selectedDayForNotes
// }: Day) {
//     const [myDate, setMyDate] = useState('');

//     const [isTodaysDate, setIsTodaysDate] = useState(false);

//     const [doesDayHaveNote, setDayHasNote] = useState(false);

//     const [notesSelected, setNotesSelected] = useState(false);

//     useEffect(() => {
//         if (completedDays && completedDays[curGoal]) {
//             const day = completedDays[curGoal].find((e) => {
//                 return e.date === myDate;
//             });

//             if (day && day.notes && day.notes.length) {
//                 setDayHasNote(true);
//             } else {
//                 setDayHasNote(false);
//             }
//         }
//     }, [completedDays, curGoal]);

//     useEffect(() => {
//         if (month && day && year) {
//             const date =
//                 month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') + '-' + year.toString();
//             setMyDate(date);

//             if (selectedDayForNotes) {
//                 setNotesSelected(date == selectedDayForNotes.date);
//             }

//             let today: any = new Date();
//             let dd = String(today.getDate()).padStart(2, '0');
//             let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//             let yyyy = today.getFullYear();
//             today = mm + '-' + dd + '-' + yyyy;

//             if (date == today) {
//                 setIsTodaysDate(true);
//             } else {
//                 setIsTodaysDate(false);
//             }
//         }
//     }, [month, day, year, selectedDayForNotes]);

//     /**
//      * Determine how to color in each day depending on how many goals
//      * are currently selected.
//      */
//     function getColorDisplay() {
//         const oneGoal: boolean = goalsCompletedOnDay && goalsCompletedOnDay.length === 1;

//         const multipleGoals: boolean = goalsCompletedOnDay && goalsCompletedOnDay.length > 1;

//         if (oneGoal) {
//             const singleColor = colorMap[goalsCompletedOnDay[0]];
//             return (
//                 <Fragment>
//                     <MyDiv
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'start',
//                             background: singleColor,
//                             paddingLeft: '0.5rem',
//                             paddingTop: '0.2rem'
//                         }}>
//                         {doesDayHaveNote ? (
//                             <i
//                                 className='glyphicon glyphicon-edit'
//                                 style={{ color: 'white' }}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleNoteSelected(myDate, curGoal);
//                                 }}
//                             />
//                         ) : null}
//                     </MyDiv>
//                     <MyDiv style={{ background: singleColor }}>
//                         <Text style={{ color: 'white' }}>{disabled ? '0' : day} </Text>
//                         {isTodaysDate ? (
//                             <i
//                                 className='glyphicon glyphicon-time'
//                                 style={{ color: 'white', marginRight: '.2rem', marginTop: '.3rem' }}
//                             />
//                         ) : null}
//                     </MyDiv>
//                     <MyDiv style={{ background: singleColor }} />
//                     <MyDiv style={{ background: singleColor }} />
//                 </Fragment>
//             );
//         } else if (multipleGoals) {
//             let display = [];

//             // TODO -- use a foreach loop. this is whack
//             for (let x in goalsCompletedOnDay) {
//                 if (x === '1') {
//                     display.push(
//                         <MyDiv style={{ background: colorMap[goalsCompletedOnDay[x]], color: 'white' }}>
//                             <Text>{disabled ? '0' : day} </Text>
//                             {isTodaysDate ? (
//                                 <i
//                                     className='glyphicon glyphicon-time'
//                                     style={{ color: 'white', marginRight: '.2rem', marginTop: '.3rem' }}
//                                 />
//                             ) : null}
//                         </MyDiv>
//                     );
//                 } else {
//                     display.push(<MyDiv style={{ background: colorMap[goalsCompletedOnDay[x]] }} />);
//                 }
//             }

//             while (display.length !== 4) {
//                 display.push(<MyDiv style={{ background: '#97D4E8' }} />);
//             }

//             return (
//                 <Fragment>
//                     {display[0]}
//                     {display[1]}
//                     {display[2]}
//                     {display[3]}
//                 </Fragment>
//             );
//         } else {
//             const singleColor = disabled ? '#f1f1f1' : '#d8d8d8';

//             const divStyle = { background: singleColor };

//             return (
//                 <Fragment>
//                     <MyDiv
//                         style={{
//                             background: singleColor
//                         }}
//                     />
//                     <MyDiv style={divStyle}>
//                         <Text>{disabled ? '0' : day} </Text>
//                         {isTodaysDate ? (
//                             <i
//                                 className='glyphicon glyphicon-time'
//                                 style={{ color: 'black', marginRight: '.2rem', marginTop: '.3rem' }}
//                             />
//                         ) : null}
//                     </MyDiv>
//                     <MyDiv style={divStyle} />
//                     <MyDiv style={divStyle} />
//                 </Fragment>
//             );
//         }
//     }

//     const dayColors = getColorDisplay();

//     return (
//         <Button
//             style={{
//                 filter: notesSelected ? 'brightness(85%)' : 'brightness(100%)'
//             }}
//             completedColor={completedColor}
//             disabled={disabled}
//             onClick={() => {
//                 if (!disabled) {
//                     // Only allow select and deselect if ony one goal is selected.
//                     if (selectedGoals.length === 1) {
//                         const goal = selectedGoals[0];

//                         handleNoteSelected(myDate, curGoal);

//                         const isDayCompleted =
//                             completedDays &&
//                             completedDays[goal] &&
//                             completedDays[goal].filter((day) => day.date === myDate).length > 0;

//                         if (!isDayCompleted) {
//                             handleDayCompleted(myDate, goal);
//                         }
//                     }
//                 }
//             }}>
//             {dayColors}
//         </Button>
//     );
// }

// const Text = styled.div`
//     z-index: 10;
//     padding-right: 0.5rem;
// `;

// const MyDiv = styled.div`
//     width: 50%;
//     height: 50%;
//     float: left;
// `;

// interface ButtonProps {
//     disabled: boolean;
//     completedColor: string;
// }

// const Button = styled.button<ButtonProps>`
//     font-family: 'Avenir Next' !important;
//     padding: 0;
//     display: inline-block;
//     height: 6rem;
//     width: 6rem;
//     -webkit-text-fill-color: ${(props) => (props.disabled ? 'transparent' : 'none')};
//     font-size: 1em;
//     margin: 0.4375rem;
//     border: ${(props) => (props.disabled ? '2px solid #f1f1f1;' : '2px solid #6B7A8F')};
//     border-radius: 3px;
//     text-align: right;

//     &:hover {
//         filter: ${(props) => (props.disabled ? 'brightness(100%)' : 'brightness(85%)')};
//     }

//     margin-top: 0.3rem;
// `;
