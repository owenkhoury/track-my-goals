import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { updateNotesForCompletedDay } from "./utils";
import { completedDay } from "./constants/AppConstants";
import useAuth from "./useAuth";

export default function Notes({ selectedDayForNotes, newCompletedDays }) {
  const { auth } = useAuth();

  const [goal, setGoal] = useState(null);

  const [date, setDate] = useState(null);

  const [note, setNote] = useState("");

  useEffect(() => {
    if (selectedDayForNotes) {
      setGoal(selectedDayForNotes.goal);
      setDate(selectedDayForNotes.date);
      console.log(newCompletedDays[selectedDayForNotes.goal]);
    }
  }, [selectedDayForNotes, newCompletedDays]);

  return (
    <Container>
      <NewContainer>
        <button
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
          Save Notes
        </button>
        <NotesInput
          placeholder={`Add Notes for ${goal} on ${date}`}
          onChange={e => setNote(e.target.value)}
        />
      </NewContainer>
    </Container>
  );
}

const NewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 17rem;
  border-left: 1px solid black;
  background: #d8d8d8;
  position: absolute;
  height: 100%;
  right: 0;
`;

const NotesInput = styled.textarea`
  width: 17rem;
  background: #d8d8d8;
  font-family: "Avenir Next";
  padding-bottom: 250%;
  padding-left: 0.5rem;
  border: none;
  padding-top: 3rem;
`;
