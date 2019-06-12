import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Day from "./Day";
import { addCompletedDay } from "./utils";
import useAuth from "./useAuth";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/**
 * Get the current month. Render all of it's days on the screen. Any
 * leftover days start rendering days for the next month. If the go into
 * the future button is clicked, then set the current month
 */

export default function Calendar({ curGoal, completedDays }) {
  const { auth } = useAuth();
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const [curMonth, setCurMonth] = useState(null);

  useEffect(() => {
    const today = new Date();
    setCurMonth(today.getMonth() + 1);
  }, []);

  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
    console.log("dimensions: ", windowDimensions);
  });

  async function handleDayCompleted(date) {
    addCompletedDay(auth.uid, curGoal, date);
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

  function getMonth(month) {
    const myMonth = [[]];
    let dayOfWeek = 1;
    let week = [];

    const daysPerRow = Math.floor(windowDimensions.width / 180);

    for (let i = 1; i <= monthDays[month]; i++) {
      if (dayOfWeek === daysPerRow) {
        myMonth.push(week);
        dayOfWeek = 1;
        week = [];
      }

      // TODO -- Only the last one is getting set as selected

      const date =
        month.toString().padStart(2, "0") +
        "-" +
        i
          .toString()
          .toString()
          .padStart(2, "0") +
        "-" +
        "2019";

      // console.log(
      //   "YOOOO: ",
      //   completedDays,
      //   date,
      //   completedDays.indexOf(date) > -1
      // );

      week.push(
        <Day
          day={i}
          month={parseInt(month)}
          year={2019}
          handleDayCompleted={handleDayCompleted}
          isCompleted={completedDays.indexOf(date) > -1}
        />
      );
      dayOfWeek += 1;
    }
    myMonth.push(week);
    return myMonth;
  }

  function getYear() {
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
    <Container>
      <MonthInfo>
        <Month>{monthName[curMonth]}</Month>
        <ChangeMonthButton
          onClick={() => {
            setCurMonth(curMonth !== 1 ? curMonth - 1 : curMonth);
          }}
        >
          prev month
        </ChangeMonthButton>
        <ChangeMonthButton
          onClick={() => {
            setCurMonth(curMonth !== 12 ? curMonth + 1 : curMonth);
          }}
        >
          next month
        </ChangeMonthButton>
      </MonthInfo>

      {calendarYear[curMonth]
        ? calendarYear[curMonth].map(week => {
            return <div>{week}</div>;
          })
        : null}
    </Container>
  );
}

const Month = styled.div`
  font-size: 40px;
`;

const ChangeMonthButton = styled.button`
  margin-left: 30px;
  background: #3498db;
  width: 180px;

  border-radius: 3px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const MonthInfo = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1em;
`;
