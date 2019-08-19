import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { completedDay } from './constants/AppConstants';
import { getWindowDimensions } from './Calendar';
import { useSpring, animated } from 'react-spring';
import { placeholder } from '@babel/types';

export default function Notes({ selectedDayForNotes, newCompletedDays, handleNoteAdded }) {
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
                                        // updateNotesForCompletedDay(auth.uid, dayToUpdate);
                                        await handleNoteAdded(dayToUpdate);
                                        await setShowSuccess(showSuccess === 1 ? 0 : 1);

                                        let saveDisplay = document.getElementById('Saved');

                                        saveDisplay.style.opacity = '1';
                                        saveDisplay.style.opacity = '0';
                                    }
                                }}>
                                Save Note
                            </SaveButton>
                            <Header style={{ paddingTop: '.5rem' }}>Note for:</Header>
                            <Header>{goal}</Header>
                            <Header style={{ paddingBottom: '1rem', borderBottom: '1px solid black' }}>{date}</Header>

                            <div className='alert'>
                                <span className='closebtn'>&times;</span>
                                This is an alert box.
                            </div>

                            <NotesInput
                                placeholder={note ? null : `Add Notes for ${goal} on ${date}`}
                                windowHeight={windowDimensions.height}
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                            />
                            <Remainder />
                        </Fragment>
                    </NewContainer>
                </Container>
            ) : (
                <Container>
                    <NewContainer>
                        <Placeholder windowHeight={windowDimensions.height}>
                            Click the edit icon on completed day to add a note
                        </Placeholder>
                    </NewContainer>
                </Container>
            )}
        </Fragment>
    );
}

const Whatever = styled.div`
    opacity: 0;
    -webkit-transition: all 2s ease-out;
    -moz-transition: all 2s ease-out;
    -ms-transition: all 2s ease-out;
    -o-transition: all 2s ease-out;
    transition: all 2s ease-out;
`;

const Placeholder = styled.div<{ windowHeight }>`
    color: black;
    width: 17rem;
    background: #d8d8d8;
    font-family: 'Avenir Next';
    height: ${(props) => (props.windowHeight ? `${props.windowHeight}px` : '35rem')};
    padding-left: 0.5rem;
    border: none;
    padding-top: 3rem;
    /* border-left: 1.5px solid #979797; */
    background-color: #d8d8d8;
`;

const SuccessfulSave = styled(animated.div)<{ success }>`
    width: 5rem;
    height: 2rem;
    background-color: green;
    opacity: ${(props) => props.success};
`;

const Header = styled.h4`
    font-family: 'Avenir Next';
    padding-left: 0.3rem;
    color: black;
`;

const SaveButton = styled.button`
    /* border: 3px solid black; */
    height: 5rem;
    background-color: #09868b;
    font-family: 'Avenir Next';
    font-size: 1.3rem;
    color: white;

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
    background-color: #d8d8d8;
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
    height: ${(props) => (props.windowHeight ? `${props.windowHeight - 300}px` : '35rem')};
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
