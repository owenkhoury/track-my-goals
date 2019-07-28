import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { updateNotesForCompletedDay } from "./utils";
import { completedDay } from "./constants/AppConstants";
import useAuth from "./useAuth";
import { getWindowDimensions } from "./Calendar";

export default function Notes({ selectedDayForNotes, newCompletedDays }) {
  const { auth } = useAuth();

  const [goal, setGoal] = useState("none selected");

  const [date, setDate] = useState("none selected");

  const [note, setNote] = useState("");

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
  });

  useEffect(() => {
    console.log("note: ", selectedDayForNotes);
  });

  useEffect(() => {
    if (selectedDayForNotes) {
      setGoal(selectedDayForNotes.goal);
      setDate(selectedDayForNotes.date);
      setNote(selectedDayForNotes.notes);
    }
  }, [selectedDayForNotes, newCompletedDays]);

  return (
    <Container>
      <NewContainer>
        <Header>Note for:</Header>
        <Header>{goal}</Header>
        <Header>{date}</Header>
        <NotesInput
          // placeholder={`Add Notes for ${goal} on ${date}`}
          windowHeight={windowDimensions.height}
          onChange={e => setNote(e.target.value)}
          value={note}
        />
        <SaveButton
          onClick={() => {
            if (goal && date) {
              const dayToUpdate: completedDay = {
                goal: goal,
                date: date,
                notes: note
              };
              updateNotesForCompletedDay(auth.uid, dayToUpdate);
            }
          }}
        >
          Save Note
        </SaveButton>
        <Remainder />
      </NewContainer>
    </Container>
  );
}

const Header = styled.h6`
  font-family: "Avenir Next";
`;

const SaveButton = styled.button`
  border: 3px solid #09868b;
  height: 5rem;
  color: #09868b;
  font-family: "Avenir Next";

  &:hover {
    filter: brightness(85%);
  }
`;

const NewContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #d8d8d8;
`;

const Container = styled.div`
  width: 17rem;
  background: #d8d8d8;
  position: absolute;
  right: 0;
`;

const NotesInput = styled.textarea<{ windowHeight }>`
  width: 17rem;
  background: #d8d8d8;
  font-family: "Avenir Next";
  height: ${props =>
    props.windowHeight ? `${props.windowHeight - 300}px` : "35rem"};
  padding-left: 0.5rem;
  border: none;
  padding-top: 3rem;
  border-left: 1.5px solid #979797;
`;

const Remainder = styled.div`
  background: #d8d8d8;
  height: 200px;
`;
