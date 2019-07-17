import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Day from "./Day";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

// TODO curGoal change to selected

/**
 * NOTES -- Re-renders on every goal selection
 */
export default function Calendar({
  curMonth,
  curGoal,
  completedDaysMap,
  colorMap,
  selectedGoals,
  handleDayCompleted,
  handleDayRemoved
}) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    console.log("selectedGoals", selectedGoals);
  });

  // Mapping of each goal to the days that are completed (selected).
  const [completedDays, setCompletedDays] = useState({});

  // const [curMonth, setCurMonth] = useState(null);

  // Load the current month onto the screen.
  // useEffect(() => {
  //   const today = new Date();
  //   setCurMonth(today.getMonth() + 1);
  // }, []);

  // MIGHT BE BAD DESIGN -- THIS SHOULD ONLY REALLY SET OUR LOCAL STATE ONCE.
  useEffect(() => {
    setCompletedDays(completedDaysMap);
  }, [completedDaysMap]);

  const monthDays = {
    "01": 31,
    "02": 28,
    "03": 31,
    "04": 30,
    "05": 31,
    "06": 30,
    "07": 31,
    "08": 31,
    "09": 30,
    "10": 31,
    "11": 30,
    "12": 31
  };

  const DaysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  function getMonth(month, completedDays) {
    const myMonth = [[]];
    let dayOfWeek = 1;
    let week = [];

    // Dynamically adjust the number of rows in the calendar as the window resizes.
    // const daysPerRow = Math.floor(windowDimensions.width / 180);
    const daysPerRow = 7;

    let firstOfMonth: any = month.toString().padStart(2, "0") + "-01-2019";
    firstOfMonth = new Date(firstOfMonth).getDay();

    // Add in a row for the days of the week
    for (let day = 0; day < 7; day++) {
      week.push(<DayOfWeek>{DaysOfWeek[day]}</DayOfWeek>);
    }

    myMonth.push(week);
    week = [];

    // Add in blank days until the first day of the month.
    for (let unusedDay = 0; unusedDay < firstOfMonth; unusedDay++) {
      week.push(
        <Day
          completedDays={null}
          completedColor={null}
          day={null}
          month={null}
          year={null}
          selectedGoals={null}
          colorMap={null}
          handleDayCompleted={null}
          handleDayRemoved={null}
          isCompleted={false}
          curGoal={curGoal}
          disabled={true}
        />
      );
    }

    dayOfWeek = firstOfMonth + 1;

    // USING 35 SO THAT WE GET 5 WEEKS.
    for (let i = 1; i <= monthDays[month]; i++) {
      const date =
        month.toString().padStart(2, "0") +
        "-" +
        i
          .toString()
          .toString()
          .padStart(2, "0") +
        "-" +
        "2019";

      if (dayOfWeek === daysPerRow + 1) {
        myMonth.push(week);
        dayOfWeek = 1;
        week = [];
      }

      let goalSelectedOnDay = {};

      selectedGoals.forEach(selectedGoal => {
        goalSelectedOnDay[selectedGoal] = completedDays[selectedGoal]
          ? completedDays[selectedGoal].indexOf(date) > -1
          : false;
      });

      let selectedGoalsForDay = [];
      selectedGoals.forEach(selectedGoal => {
        if (
          completedDays[selectedGoal] &&
          completedDays[selectedGoal].indexOf(date) > -1
        ) {
          selectedGoalsForDay.push(selectedGoal);
        }
      });

      week.push(
        <Day
          completedDays={completedDays[curGoal]}
          completedColor={colorMap ? colorMap[curGoal] : "green"}
          curGoal={curGoal}
          day={i}
          month={parseInt(month)}
          year={2019}
          selectedGoals={selectedGoalsForDay}
          colorMap={colorMap}
          handleDayCompleted={handleDayCompleted}
          handleDayRemoved={handleDayRemoved}
          isCompleted={
            completedDays[curGoal]
              ? completedDays[curGoal].indexOf(date) > -1
              : false
          }
          disabled={false}
        />
      );
      dayOfWeek += 1;
    }

    // fill out the last row with empty days
    for (let unusedDay = 0; unusedDay < 8 - dayOfWeek; unusedDay++) {
      week.push(
        <Day
          completedDays={null}
          completedColor={null}
          day={null}
          month={null}
          year={null}
          selectedGoals={null}
          colorMap={null}
          handleDayCompleted={null}
          handleDayRemoved={null}
          isCompleted={false}
          curGoal={curGoal}
          disabled={true}
        />
      );
    }

    myMonth.push(week);
    week = [];

    // Adds a blank row of disabled days so that the size stays the same.
    if (myMonth.length === 7) {
      for (let unusedDay = 0; unusedDay < 7; unusedDay++) {
        week.push(
          <Day
            completedDays={null}
            completedColor={null}
            day={null}
            month={null}
            year={null}
            selectedGoals={null}
            colorMap={null}
            handleDayCompleted={null}
            handleDayRemoved={null}
            isCompleted={false}
            curGoal={curGoal}
            disabled={true}
          />
        );
      }

      myMonth.push(week);
    }

    return myMonth;
  }

  function getYear(completedDays) {
    const calendarYear = {};
    for (let i = 1; i <= 12; i++) {
      let monthNum = i.toString();
      monthNum = monthNum.length === 1 ? "0" + monthNum : monthNum;

      const month = getMonth(monthNum, completedDays);
      calendarYear[i] = month;
    }
    return calendarYear;
  }

  const calendarYear = getYear(completedDays);

  return (
    <div>
      <Container>
        {calendarYear[curMonth]
          ? calendarYear[curMonth].map(week => {
              return <div>{week}</div>;
            })
          : null}
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-left: 30rem;
  justify-content: center;
  margin-left: 22rem;
  margin-top: 1rem;
`;

const DayOfWeek = styled.div`
  display: inline-block;
  width: 6rem;
  height: 1rem;
  margin: 0.4375rem;
  text-align: center;
`;

// LOAD THE COMPLETED DAYS INTO STATE.
// useEffect(() => {
//   console.log("LOADING COMPLETED DAYS");

//   const fetchCompletedDays = db
//     .collection(`daysCompleted-${auth.uid}`)
//     .get()
//     .then(snapshot => {
//       const datesCompleted = [];

//       snapshot.docs.forEach(doc => {
//         const goal = doc.data().goal;
//         const date = doc.data().date;
//         datesCompleted.push({ goal: goal, date: date });
//       });

//       const datesCompletedMap = {};
//       datesCompleted.forEach(data => {
//         if (data.goal in datesCompletedMap) {
//           datesCompletedMap[data.goal].push(data.date);
//         } else {
//           datesCompletedMap[data.goal] = [data.date];
//         }
//       });
//       setCompletedDays(datesCompletedMap);
//     });

//   if (typeof fetchCompletedDays === "function") {
//     return () => fetchCompletedDays();
//   }
// }, []);

// async function handleDayCompleted(date) {
//   // addCompletedDay(auth.uid, curGoal, date);

//   console.log("handleDayCompleted before: ", completedDays[curGoal]);

//   const updatedCompletedDays = completedDays;
//   updatedCompletedDays[curGoal] = completedDays[curGoal]
//     ? [...completedDays[curGoal], date]
//     : [date];

//   await setCompletedDays(updatedCompletedDays);

//   console.log("handleDayCompleted after: ", completedDays[curGoal]);
// }

// function handleDayRemoved(date) {
//   // removeCompletedDay(auth.uid, curGoal, date);

//   console.log(
//     "Removing day: ",
//     curGoal,
//     completedDays,
//     completedDays[curGoal]
//   );

//   const updatedCompletedDays = completedDays;
//   updatedCompletedDays[curGoal] = updatedCompletedDays[curGoal].filter(
//     curDate => curDate !== date
//   );

//   setCompletedDays(updatedCompletedDays);
// }

// if (month == "06") {
//   console.log(
//     "CREATING DAY",
//     date,
//     completedDays[curGoal]
//       ? completedDays[curGoal].indexOf(date) > -1
//       : false
//   );
// }

// useEffect(() => {
//   // setWindowDimensions(getWindowDimensions());
//   // console.log("dimensions: ", windowDimensions);

//   console.log("completedDays: ", completedDays);
//   console.log(
//     "Completed days for cur goal: ",
//     curGoal,
//     completedDays[curGoal]
//   );
// });
