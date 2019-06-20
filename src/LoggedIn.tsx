import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import useAuth from "./useAuth";
import GoalsList from "./GoalList";
import Calendar from "./Calendar";
import { db } from "./fire";
import HeaderBar from "./HeaderBar";

/**
 * When the goal is changed by the goalList component, send
 * up the dates selected for that goal. Compare it against the dates selected
 * for that goal in the existingGoals local state to see what's been
 * added / removed. Make bulk updates to the database.
 */

export default function LoggedIn() {
  const { auth } = useAuth();

  // The list of the existing goals.
  const [existingGoals, setExistingGoals] = useState([]);

  // The currently selected goal.
  const [selected, setSelected] = useState("asdfasd");

  // Mapping of each goal to the days that are completed (selected).
  const [completedDays, setCompletedDays] = useState({});

  // Load goals and completed days on component mount (only once).
  useEffect(() => {
    fetchGoals();
    fetchCompletedDays();
  }, []);

  function fetchGoals() {
    db.collection("goals")
      .where("uid", "==", auth.uid)
      .get()
      .then(snapshot => {
        const existingGoals: any[] = [];
        snapshot.docs.forEach(doc => {
          existingGoals.push(doc.data().goal);
        });

        setSelected(existingGoals[0]);
        setExistingGoals(existingGoals);
      });
  }

  function fetchCompletedDays() {
    db.collection(`daysCompleted-${auth.uid}`)
      .get()
      .then(snapshot => {
        const datesCompleted: any[] = [];

        snapshot.docs.forEach(doc => {
          const goal = doc.data().goal;
          const date = doc.data().date;
          datesCompleted.push({ goal: goal, date: date });
        });

        const datesCompletedMap = {};
        datesCompleted.forEach(data => {
          if (data.goal in datesCompletedMap) {
            datesCompletedMap[data.goal].push(data.date);
          } else {
            datesCompletedMap[data.goal] = [data.date];
          }
        });
        setCompletedDays(datesCompletedMap);
      });
  }

  function updateSelected(goal: string) {
    setSelected(goal);
  }

  async function handleDayCompleted(date) {
    // addCompletedDay(auth.uid, curGoal, date);

    console.log("handleDayCompleted before: ", completedDays[selected]);

    const updatedCompletedDays = completedDays;
    updatedCompletedDays[selected] = completedDays[selected]
      ? [...completedDays[selected], date]
      : [date];

    await setCompletedDays(updatedCompletedDays);

    console.log("handleDayCompleted after: ", completedDays[selected]);
  }

  function handleDayRemoved(date) {
    // removeCompletedDay(auth.uid, selected, date);

    console.log(
      "Removing day: ",
      selected,
      completedDays,
      completedDays[selected]
    );

    const updatedCompletedDays = completedDays;
    updatedCompletedDays[selected] = updatedCompletedDays[selected].filter(
      curDate => curDate !== date
    );

    setCompletedDays(updatedCompletedDays);
  }

  return (
    <Container>
      <GoalsList
        existingGoals={existingGoals}
        selected={selected}
        handleSelected={updateSelected}
      />
      <CalendarContainer>
        <HeaderBar />
        <Calendar
          curGoal={selected}
          completedDaysMap={completedDays}
          handleDayCompleted={handleDayCompleted}
          handleDayRemoved={handleDayRemoved}
        />
      </CalendarContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
