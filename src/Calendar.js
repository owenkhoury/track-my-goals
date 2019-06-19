import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Day from "./Day";
import { db } from "./fire";
import { addCompletedDay, removeCompletedDay } from "./utils";
import useAuth from "./useAuth";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function Calendar({ curGoal, completedDaysMap }) {
  const { auth } = useAuth();
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // Mapping of each goal to the days that are completed (selected).
  const [completedDays, setCompletedDays] = useState({});

  const [curMonth, setCurMonth] = useState(null);

  useEffect(() => {
    const today = new Date();
    setCurMonth(today.getMonth() + 1);
  }, []);

  useEffect(() => {
    // setWindowDimensions(getWindowDimensions());
    // console.log("dimensions: ", windowDimensions);

    console.log("completedDays: ", completedDays);
    console.log(
      "Completed days for cur goal: ",
      curGoal,
      completedDays[curGoal]
    );
  });

  // LOAD THE COMPLETED DAYS INTO STATE.
  useEffect(() => {
    console.log("LOADING COMPLETED DAYS");

    const fetchCompletedDays = db
      .collection(`daysCompleted-${auth.uid}`)
      .get()
      .then(snapshot => {
        const datesCompleted = [];

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

    if (typeof fetchCompletedDays === "function") {
      return () => fetchCompletedDays();
    }
  }, []);

  // TODO -- BATCH THESE REQUESTS WHEN USER SWITCHES BETWEEN GOALS
  // SAVE SOME READS AND WRITES
  async function handleDayCompleted(date) {
    // addCompletedDay(auth.uid, curGoal, date);

    console.log("Adding day: ", curGoal, completedDays, completedDays[curGoal]);

    const updatedCompletedDays = completedDays;
    updatedCompletedDays[curGoal] = completedDays[curGoal]
      ? [...completedDays[curGoal], date]
      : [date];

    setCompletedDays(updatedCompletedDays);
  }

  async function handleDayRemoved(date) {
    // removeCompletedDay(auth.uid, curGoal, date);

    console.log(
      "Removing day: ",
      curGoal,
      completedDays,
      completedDays[curGoal]
    );

    const updatedCompletedDays = completedDays;
    updatedCompletedDays[curGoal] = updatedCompletedDays[curGoal].filter(
      curDate => curDate !== date
    );

    setCompletedDays(updatedCompletedDays);
  }

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

  const monthName = {
    1: "January",
    2: "February",
    3: "march",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };

  // TODO -- ALWAYS RENDER 5 ROWS OF 7 DAYS. USE THE GETDAY() FUNCTION TO START
  // EACH MONTH ON THE DAY THAT IT ACTUALLY BEGINS.

  function getMonth(month) {
    const myMonth = [[]];
    let dayOfWeek = 1;
    let week = [];

    // Dynamically adjust the number of rows in the calendar as the window resizes.
    // const daysPerRow = Math.floor(windowDimensions.width / 180);
    const daysPerRow = 7;

    let firstOfMonth = month.toString().padStart(2, "0") + "-01-2019";
    firstOfMonth = new Date(firstOfMonth).getDay();

    // Add in blank days until the first day of the month.
    for (let unusedDay = 0; unusedDay < firstOfMonth; unusedDay++) {
      week.push(<Day curGoal={curGoal} disabled={true} />);
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

      if (month == "06") {
        console.log(
          "CREATING DAY",
          date,
          completedDays[curGoal]
            ? completedDays[curGoal].indexOf(date) > -1
            : false
        );
      }

      week.push(
        <Day
          curGoal={curGoal}
          day={i}
          month={parseInt(month)}
          year={2019}
          handleDayCompleted={handleDayCompleted}
          handleDayRemoved={handleDayRemoved}
          isCompleted={false}
        />
      );
      dayOfWeek += 1;
    }

    // fill out the last row with empty days
    for (let unusedDay = 0; unusedDay < 8 - dayOfWeek; unusedDay++) {
      week.push(<Day disabled={true} />);
    }

    myMonth.push(week);
    return myMonth;
  }

  function getYear() {
    console.log("GET YEAR", curGoal, completedDays[curGoal]);

    const calendarYear = {};
    for (let i = 1; i <= 12; i++) {
      let monthNum = i.toString();
      monthNum = monthNum.length === 1 ? "0" + monthNum : monthNum;

      const month = getMonth(monthNum);
      calendarYear[i] = month;
    }
    return calendarYear;
  }

  const calendarYear = getYear();

  return (
    <div>
      <Container>
        {/* // TODO add a row with the days of the week */}

        <DaysOfWeek>
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </DaysOfWeek>

        {calendarYear[curMonth]
          ? calendarYear[curMonth].map(week => {
              return <div>{week}</div>;
            })
          : null}
      </Container>
      <MonthInfoContainer>
        <PrevMonth
          onClick={() => {
            setCurMonth(curMonth !== 1 ? curMonth - 1 : curMonth);
          }}
        />
        <Month>{monthName[curMonth] + " 2019"}</Month>
        <NextMonth
          onClick={() => {
            setCurMonth(curMonth !== 12 ? curMonth + 1 : curMonth);
          }}
        />
      </MonthInfoContainer>
    </div>
  );
}

const DaysOfWeek = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 742px;
`;

const Month = styled.div`
  font-size: 3rem;
  color: #0d160a;
`;

const NextMonth = styled.button`
  margin-left: 2rem;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1.5rem 0 1.5rem 3rem;
  border-color: transparent transparent transparent #0d160a;
`;

const PrevMonth = styled.button`
  margin-right: 2rem;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1.5rem 3rem 1.5rem 0;
  border-color: transparent #0d160a transparent transparent;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
`;

const MonthInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1em;
  justify-content: center;
`;
