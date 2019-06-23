import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import useAuth from "./useAuth";
import GoalsList from "./GoalList";
import Calendar from "./Calendar";
import { db } from "./fire";
import HeaderBar from "./HeaderBar";
import { addCompletedDay, removeCompletedDay } from "./utils";

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
  // The old state of the mapping at the time of the app being loaded
  const [oldCompletedDays, setOldCompletedDays] = useState({});

  // Mapping of each goal to the days that are completed (selected).
  // the new state of the mapping as the user makes new selections.
  const [newCompletedDays, setNewCompletedDays] = useState({});

  const [curMonth, setCurMonth] = useState(null);

  // Load the current month onto the screen.
  useEffect(() => {
    const today = new Date();
    setCurMonth(today.getMonth() + 1);
  }, []);

  // Load goals and completed days on component mount (only once).
  useEffect(() => {
    fetchGoals();
    fetchCompletedDays();
  }, []);

  // Component will unmount. Add the selected days for last goal.
  useEffect(() => {
    return () => {
      batchUpdateCompletedDays(selected);
    };
  }, []);

  async function updateCurMonth(month: number) {
    console.log("HERE");
    setCurMonth(month);
  }

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
    console.log("fetchCompletedDays");

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
        setOldCompletedDays(JSON.parse(JSON.stringify(datesCompletedMap)));
        setNewCompletedDays(datesCompletedMap);
      });
  }

  async function handleDayCompleted(date: string) {
    const updatedCompletedDays = newCompletedDays;
    updatedCompletedDays[selected] = newCompletedDays[selected]
      ? [...newCompletedDays[selected], date]
      : [date];
    await setNewCompletedDays(updatedCompletedDays);
  }

  function handleDayRemoved(date: string) {
    const updatedCompletedDays = newCompletedDays;
    updatedCompletedDays[selected] = updatedCompletedDays[selected].filter(
      curDate => curDate !== date
    );
    setNewCompletedDays(updatedCompletedDays);
  }

  function updateSelected(goal: string) {
    console.log("updateSelected");

    batchUpdateCompletedDays(selected);
    setSelected(goal);
  }

  /**
   * When the user switches between goals, batch update all of their
   * selections into the database
   */
  async function batchUpdateCompletedDays(goal: string) {
    console.log("batchUpdateCompletedDays");
    console.log(oldCompletedDays[goal]);
    console.log(newCompletedDays[goal]);

    if (newCompletedDays[goal]) {
      if (oldCompletedDays[goal]) {
        // Add new Days.
        newCompletedDays[goal].forEach(date => {
          if (!oldCompletedDays[goal].includes(date)) {
            addCompletedDay(auth.uid, goal, date);
          }
        });

        // Remove de-selected days.
        oldCompletedDays[goal].forEach(date => {
          if (!newCompletedDays[goal].includes(date)) {
            removeCompletedDay(auth.uid, goal, date);
          }
        });
      } else {
        // This is a newly created goal.
        newCompletedDays[goal].forEach(date => {
          addCompletedDay(auth.uid, goal, date);
        });

        // Add this new goal to the 'oldCompletedDays' mapping.
        setOldCompletedDays(JSON.parse(JSON.stringify(newCompletedDays)));
      }
    }
  }

  return (
    <Container>
      <GoalsList
        existingGoals={existingGoals}
        selected={selected}
        handleSelected={updateSelected}
      />
      <CalendarContainer>
        <HeaderBar curMonth={curMonth} updateCurMonth={updateCurMonth} />
        <Calendar
          curMonth={curMonth}
          curGoal={selected}
          completedDaysMap={newCompletedDays}
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
  height: 100%;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
`;
