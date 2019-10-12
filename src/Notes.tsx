import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { completedDay } from './constants/AppConstants';
import { getWindowDimensions } from './Calendar';
import { useSpring, animated } from 'react-spring';

export default function Notes({ selectedDayForNotes, completedDays, handleNoteAdded, handleDayRemoved }) {
    const [goal, setGoal] = useState(null);

    const [date, setDate] = useState(null);

    const [note, setNote] = useState('');

    const [justSavedNote, setJustSavedNote] = useState(false);

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
            setNote(selectedDayForNotes.notes ? selectedDayForNotes.notes : '');
        }
    }, [selectedDayForNotes, completedDays]);

    /**
     * Display the green checkmark for 2 seconds before switching back to teh save button.
     */
    useEffect(() => {
        if (justSavedNote) {
            let counter = 2;
            let intervalId = setInterval(() => {
                counter = counter - 1;
                if (counter === 0) {
                    setJustSavedNote(false);
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    }, [justSavedNote]);

    function displaySuccessfulSave() {
        return (
            <SaveAnimationContainer>
                <svg
                    id='successAnimation'
                    className='animated'
                    xmlns='http://www.w3.org/2000/svg'
                    width='70'
                    height='70'
                    viewBox='0 0 70 70'
                    style={{ marginBottom: '0.5rem' }}>
                    <path
                        id='successAnimationResult'
                        fill='#D8D8D8'
                        d='M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z'
                    />
                    <circle
                        id='successAnimationCircle'
                        cx='35'
                        cy='35'
                        r='24'
                        stroke='#979797'
                        stroke-width='2'
                        stroke-linecap='round'
                        fill='transparent'
                    />
                    <polyline
                        id='successAnimationCheck'
                        stroke='#979797'
                        stroke-width='2'
                        points='23 34 34 43 47 27'
                        fill='transparent'
                    />
                </svg>
            </SaveAnimationContainer>
        );
    }

    return (
        <Fragment>
            {selectedDayForNotes ? (
                <Container>
                    <NewContainer>
                        <Fragment>
                            {justSavedNote ? (
                                displaySuccessfulSave()
                            ) : (
                                <SaveButton
                                    onClick={async () => {
                                        if (goal && date && note && note.length) {
                                            const dayToUpdate: completedDay = {
                                                goal: goal,
                                                date: date,
                                                notes: note
                                            };
                                            await handleNoteAdded(dayToUpdate);
                                            setJustSavedNote(true);
                                        }
                                    }}>
                                    Save note
                                </SaveButton>
                            )}
                            <OtherDisplay>
                                <br />
                                {goal}
                                <br />
                                {date}
                            </OtherDisplay>
                            <NotesInput
                                spellCheck={false}
                                placeholder={note ? null : `Add Notes for ${goal} on ${date}`}
                                windowHeight={windowDimensions.height}
                                onChange={(e) => setNote(e.target.value)}
                                value={note}>
                                <button>Hello</button>
                            </NotesInput>
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
    color: white;
    width: 17rem;
    background: #222627;
    font-family: 'Gayathri', sans-serif;
    height: ${(props) => (props.windowHeight ? `${props.windowHeight}px` : '35rem')};
    border: none;
    padding-top: 3rem;
    padding-right: 1rem;
    text-align: center;
    /* border-left: 1.5px solid #979797; */
    background-color: #222627;
`;

const SaveButton = styled.button`
    /* border: 3px solid black; */
    height: 5rem;
    /* background-color: #464e50;
    font-family: 'Gayathri', sans-serif;
    font-size: 1.3rem;
    color: white;
    padding: 0;
    border: 0;

    white-space: normal;

    &:hover {
        filter: brightness(85%);
    } */

    font-size: 1.2em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
    display: inline-block;
    border-radius: 0.3rem;

    background-color: #fdfd96;
    border-color: #0cc6ce;
    color: black;

    &:hover {
        filter: brightness(75%);
    }
`;

const SaveAnimationContainer = styled.button`
    height: 5rem;
    font-size: 1.2em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;
    display: inline-block;

    background-color: #fdfd96;
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
    background-color: #fdfd96;
`;

const Container = styled.div`
    width: 17rem;
    background-color: #fdfd96;

    color: #09868b;
    border-left: 1.5px solid #47484a;
    position: absolute;
    right: 0;
`;

const OtherDisplay = styled.div`
    color: black;
    width: 17rem;
    background: #d8d8d8;
    font-family: 'Gayathri', sans-serif;
    height: 8rem;
    padding-left: 0.5rem;
    border: none;
    padding-top: 3rem;
    font-size: 1.5rem;

    /* border-left: 1.5px solid #979797; */
    background-color: #fdfd96;

    background-attachment: local;
    background-image: linear-gradient(to right, #fdfd96 10px, transparent 10px),
        linear-gradient(to left, #fdfd96 10px, transparent 10px),
        repeating-linear-gradient(#fdfd96, #fdfd96 30px, #ccc 30px, #ccc 31px, white 31px);
    line-height: 31px;
    padding: 8px 10px;
`;

const NotesInput = styled.textarea<{ windowHeight }>`
    color: black;
    width: 17rem;
    background: #d8d8d8;
    font-family: 'Gayathri', sans-serif;
    height: ${(props) => (props.windowHeight ? `${props.windowHeight}px` : '35rem')};
    padding-left: 0.5rem;
    border: none;
    padding-top: 3rem;

    /* border-left: 1.5px solid #979797; */
    background-color: #fdfd96;

    background-attachment: local;
    background-image: linear-gradient(to right, #fdfd96 10px, transparent 10px),
        linear-gradient(to left, #fdfd96 10px, transparent 10px),
        repeating-linear-gradient(#fdfd96, #fdfd96 30px, #ccc 30px, #ccc 31px, white 31px);
    line-height: 31px;
    padding: 8px 10px;
`;

const Remainder = styled.div`
    background: #d8d8d8;
    height: 200px;
`;
