import React, { useState, useEffect, useRef, Fragment } from "react";
import styled from "styled-components";
import useAuth from "./useAuth";
import GoalsList from "./GoalList";
import Calendar from "./Calendar";
import { db } from "./fire";
import HeaderBar from "./HeaderBar";
import { GOAL_COLORS, completedDay } from "./constants/AppConstants";
import Notes from "./Notes";
import { addCompletedDay, removeCompletedDay } from "./utils";

// TODO -- I'M NOT CLEARING OUT MY LOCAL TRACK OF COMPLETED DAYS WHEN A GOAL GETS DELETED.

export default function LoggedIn() {
  const { auth } = useAuth();

  const [selectedGoals, setSelectedGoals] = useState([]);

  // Color mapping. Goal --> Hex Color
  const [colorMap, setColorMap] = useState({});

  // The list of the existing goals.
  const [existingGoals, setExistingGoals] = useState([]);

  // The currently selected goal.
  const [selected, setSelected] = useState("");

  // Mapping of each goal to the days that are completed (selected).
  // The old state of the mapping at the time of the app being loaded
  const [oldCompletedDays, setOldCompletedDays] = useState({});

  // Mapping of each goal to the days that are completed (selected).
  // the new state of the mapping as the user makes new selections.
  const [newCompletedDays, setNewCompletedDays] = useState({});

  const [curMonth, setCurMonth] = useState(null);

  const [goalCreationDateMap, setGoalCreationDateMap] = useState({});

  // Track which completed day we are currently writing notes for.
  const [selectedDayForNotes, setSelectedDayForNotes] = useState(null);

  const addHandler = handler =>
    window.addEventListener("beforeunload", handler);
  const removeHandler = handler =>
    window.removeEventListener("beforeunload", handler);

  useEffect(() => {
    console.log("\n");
    console.log(
      "===================== LOGGED IN STATE ========================="
    );
    console.log("selectedDayForNotes: ", selectedDayForNotes);
    console.log("selectedGoals: ", selectedGoals);
    console.log("newCompletedDays:  ", newCompletedDays);
    console.log("\n");
  });

  /**
   * Save completed days for last viewed goal, before the app window closes or the page is refreshed.
   */
  const useWindowUnloadEffect = (handler, callOnCleanup) => {
    const prevHandler = useRef(null);
    useEffect(() => {
      if (prevHandler.current) removeHandler(handler.current); // remove the the current event listener, if one exists
      prevHandler.current = handler;
      addHandler(handler);
      return () => {
        if (callOnCleanup) handler();
        removeHandler(handler);
      };
    }, [handler]);
  };

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

  async function updateCurMonth(month: number) {
    setCurMonth(month);
  }

  function timeConverter(date: Date) {
    return date.toISOString().substring(0, 10);
  }

  /**
   * Pull Goal data from the firestore.
   */
  function fetchGoals() {
    db.collection("goals")
      .doc(auth.uid)
      .collection("userGoals")
      .where("uid", "==", auth.uid)
      .get()
      .then(snapshot => {
        const existingGoals: any[] = [];
        const existingColorMap = {};
        const createdDateMap = {};
        snapshot.docs.forEach(doc => {
          if (doc.data().goal) {
            existingGoals.push(doc.data().goal);
            existingColorMap[doc.data().goal] = doc.data().color;

            createdDateMap[doc.data().goal] = timeConverter(
              new Date(doc.data().created)
            );
          }
        });

        existingGoals.sort((a, b) => a.created - b.created);

        // Set the initially selected goal

        const selected: [string] = [selectedGoals[0]];
        setSelectedGoals(selected);

        setSelected(existingGoals[0]);
        handleGoalSelected(existingGoals[0]);
        setExistingGoals(existingGoals);
        setColorMap(existingColorMap);

        setGoalCreationDateMap(createdDateMap);
      });
  }

  /**
   * Load a mapping of each goal to its list of completed dates.
   */
  function fetchCompletedDays() {
    db.collection("completed")
      .doc(auth.uid)
      .collection("daysCompleted")
      .get()
      .then(snapshot => {
        const datesCompleted: any[] = [];

        snapshot.docs.forEach(doc => {
          const goal = doc.data().goal;
          const date = doc.data().date;
          const notes = doc.data().notes ? doc.data().notes : "";
          datesCompleted.push({ goal: goal, date: date, notes: notes });
        });

        const datesCompletedMap = {};
        datesCompleted.forEach(data => {
          if (data.goal in datesCompletedMap) {
            datesCompletedMap[data.goal].push({
              date: data.date,
              notes: data.notes
            });
          } else {
            datesCompletedMap[data.goal] = [
              { date: data.date, notes: data.notes }
            ];
          }
        });
        setOldCompletedDays(JSON.parse(JSON.stringify(datesCompletedMap)));
        setNewCompletedDays(datesCompletedMap);
      });
  }

  /**
   * Returns the new hex code to use.
   * @param goal
   */
  function addToColorMap(goal: string): string {
    let nextHexColor = null;
    // Watch for null pointer exception
    const colorsInUse = Object.values(colorMap);
    for (let i = 0; i < GOAL_COLORS.length; i++) {
      if (!colorsInUse.includes(GOAL_COLORS[i])) {
        nextHexColor = GOAL_COLORS[i];
        break;
      }
    }

    const updatedMap = colorMap;
    updatedMap[goal] = nextHexColor;
    setColorMap(updatedMap);

    return nextHexColor;
  }

  /**
   * TODO -- DECIDE IF I SHOULD KEEP THIS. NOT REALLY NEEDED SINCE THE
   * COLOR MAP WILL REMOVE THE DELETED GOAL'S COLOR ON REFRESH ANYWAY.
   * @param goal
   */
  function removeFromColorMap(goal: string) {
    const updatedMap = colorMap;

    Object.keys(updatedMap).forEach(key => {
      if (key == goal) {
        delete updatedMap[goal];
      }
    });
    setColorMap(updatedMap);
  }

  /**
   * Add newly selected goal to selectedGoalss state.
   * @param goal
   * @param goalToRemove
   */
  function handleGoalSelected(goal: string, goalToRemove?: string) {
    if (!selectedGoals.includes(goal)) {
      let updateSelected = [...selectedGoals, goal];

      if (goalToRemove && goalToRemove != goal) {
        updateSelected = updateSelected.filter(g => g != goalToRemove);
      }

      setSelectedGoals(updateSelected);
    }
  }

  /**
   * Remove goal from selectedGoals state.
   * @param goal
   */
  function handleGoalRemoved(goal: string) {
    if (selectedGoals.includes(goal)) {
      const filteredSelectedGoals = selectedGoals.filter(g => {
        return g != goal;
      });

      setSelectedGoals([...filteredSelectedGoals]);
    }
  }

  /**
   * Add this day to this goal's list of completed days.
   * @param date
   * @param goal
   */
  function handleDayCompleted(date: string, goal: string) {
    const completedDay: completedDay = {
      date: date,
      goal: goal,
      notes: ""
    };

    // Make firestore call to save completed date.
    addCompletedDay(auth.uid, completedDay);

    const update: Object = JSON.parse(JSON.stringify(newCompletedDays));
    update[goal] = update[goal]
      ? [...update[goal], { date: date, notes: "" }]
      : [{ date: date, notes: "" }];

    setNewCompletedDays(update);
  }

  /**
   * Remove this day from this goal's list of completed days.
   * @param date
   * @param goal
   */
  function handleDayRemoved(date: string, goal: string) {
    // Make firestore call to remove completed date.
    removeCompletedDay(auth.uid, goal, date);

    const update: Object = JSON.parse(JSON.stringify(newCompletedDays));
    update[goal] = update[goal].filter(curDate => curDate.date !== date);
    setNewCompletedDays(update);
  }

  function updateSelected(goal: string) {
    // batchUpdateCompletedDays(selected);
    if (GoalsList) setSelected(goal);
  }

  function handleNotesSelected(completedDay: completedDay) {
    setSelectedDayForNotes(completedDay);
  }

  return (
    <Container className="this-one">
      <HeaderBar curMonth={curMonth} updateCurMonth={updateCurMonth} />

      <CalendarAndGoalsContainer>
        <GoalsList
          existingGoals={existingGoals}
          selected={selected}
          colorMap={colorMap}
          updateSelected={updateSelected}
          addToColorMap={addToColorMap}
          removeFromColorMap={removeFromColorMap}
          handleGoalSelected={handleGoalSelected}
          handleGoalRemoved={handleGoalRemoved}
          selectedGoals={selectedGoals}
          creationDateMap={goalCreationDateMap}
        />
        <CalendarContainer>
          <Calendar
            key="calendar1"
            curMonth={curMonth}
            curGoal={selected}
            newCompletedDays={newCompletedDays}
            colorMap={colorMap}
            selectedGoals={selectedGoals}
            handleDayCompleted={handleDayCompleted}
            handleDayRemoved={handleDayRemoved}
            handleNotesSelected={handleNotesSelected}
          />
        </CalendarContainer>
        <Notes
          selectedDayForNotes={selectedDayForNotes}
          newCompletedDays={newCompletedDays}
        />
      </CalendarAndGoalsContainer>
    </Container>
  );
}

const CalendarContainer = styled.div`
  flex: 1;
  margin-top: 1rem;
  padding-right: 17rem;
  padding-left: 2rem;
  padding-top: 2rem;
`;

const CalendarAndGoalsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;
