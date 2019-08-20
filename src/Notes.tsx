import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { completedDay } from './constants/AppConstants';
import { getWindowDimensions } from './Calendar';
import { useSpring, animated } from 'react-spring';

export default function Notes({ selectedDayForNotes, newCompletedDays, handleNoteAdded, handleDayRemoved }) {
    const [goal, setGoal] = useState(null);

    const [date, setDate] = useState(null);

    const [note, setNote] = useState('');

    const [showSuccess, setShowSuccess] = useState(1);

    const props = useSpring({ opacity: 0, from: { opacity: showSuccess } });

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        setWindowDimensions(getWindowDimensions());
    }, []);

    useEffect(() => {
        if (selectedDayForNotes) {
            setGoal(selectedDayForNotes.goal);
            setDate(selectedDayForNotes.date);
            setNote(selectedDayForNotes.notes);
        }
    }, [selectedDayForNotes, newCompletedDays]);

    return (
        <Fragment>
            {selectedDayForNotes ? (
                <Container>
                    <NewContainer>
                        <Fragment>
                            <SaveButton
                                onClick={async () => {
                                    if (goal && date && note.length) {
                                        const dayToUpdate: completedDay = {
                                            goal: goal,
                                            date: date,
                                            notes: note
                                        };
                                        await handleNoteAdded(dayToUpdate);
                                    }
                                }}>
                                Save Note For
                                <br />
                                {goal}
                                <br />
                                {date}
                            </SaveButton>

                            <NotesInput
                                placeholder={note ? null : `Add Notes for ${goal} on ${date}`}
                                windowHeight={windowDimensions.height}
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                            />
                            <DeselectButton
                                onClick={() => {
                                    handleDayRemoved(date, goal);
                                }}>
                                Deselect Day
                            </DeselectButton>
                            <Remainder />
                        </Fragment>
                    </NewContainer>
                </Container>
            ) : (
                <Container>
                    <NewContainer>
                        <Placeholder windowHeight={windowDimensions.height}>Click on a day to add a note</Placeholder>
                    </NewContainer>
                </Container>
            )}
        </Fragment>
    );
}

const Placeholder = styled.div<{ windowHeight }>`
    color: black;
    width: 17rem;
    background: #d8d8d8;
    font-family: 'Avenir Next';
    height: ${(props) => (props.windowHeight ? `${props.windowHeight}px` : '35rem')};
    border: none;
    padding-top: 3rem;
    padding-right: 1rem;
    text-align: center;
    /* border-left: 1.5px solid #979797; */
    background-color: #d8d8d8;
`;

const SaveButton = styled.button`
    /* border: 3px solid black; */
    height: 10rem;
    background-color: #262228;
    font-family: 'Avenir Next';
    font-size: 1.3rem;
    color: white;
    padding: 0;
    border: 0;

    white-space: normal;

    &:hover {
        filter: brightness(85%);
    }
`;

const DeselectButton = styled.button`
    height: 5rem;
    background-color: #062f4f;

    color: white;

    font-family: 'Avenir Next';
    font-size: 1.3rem;

    padding: 0;
    border: 0;

    &:hover {
        filter: brightness(85%);
    }
`;

const NewContainer = styled.div`
    /* display: flex;
    flex-direction: column;
    background-color: #d8d8d8; */

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background-color: #062f4f;
`;

const Container = styled.div`
    width: 17rem;
    background-color: #d8d8d8;

    color: #09868b;
    border-left: 1.5px solid #979797;
    position: absolute;
    right: 0;
`;

const NotesInput = styled.textarea<{ windowHeight }>`
    color: black;
    width: 17rem;
    background: #d8d8d8;
    font-family: 'Avenir Next';
    height: ${(props) => (props.windowHeight ? `${props.windowHeight - 290}px` : '35rem')};
    padding-left: 0.5rem;
    border: none;
    padding-top: 3rem;
    /* border-left: 1.5px solid #979797; */
    background-color: #d8d8d8;
`;

const Remainder = styled.div`
    background: #d8d8d8;
    height: 200px;
`;
