import React, { useState, useEffect, Fragment } from "react";
import useAuth from "./useAuth";
import GoalsList from "./GoalList";
import Calendar from "./Calendar";
import { db } from "./fire";

export default function LoggedIn() {
  const { auth } = useAuth();

  // The list of the existing goals.
  const [goals, setGoals] = useState(["asdfasd"]);

  // The currently selected goal.
  const [selected, setSelected] = useState("asdfasd");

  // Mapping of each goal to the days that are completed (selected).
  const [completedDays, setCompletedDays] = useState({});

  // LOAD THE EXISTING GOALS INTO STATE.
  useEffect(() => {
    console.log("FETCHING GOALS");
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
        setGoals(existingGoals);
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

  return (
    <Fragment>
      <GoalsList />
      <Calendar curGoal={selected} completedDaysMap={completedDays} />
    </Fragment>
  );
}
