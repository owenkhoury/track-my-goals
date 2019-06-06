import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Day from "./Day";
import { useAppState } from "./app-state";

/**
 * Get the current month. Render all of it's days on the screen. Any
 * leftover days start rendering days for the next month. If the go into
 * the future button is clicked, then set the current month
 */

export default function Calendar({ startingMonth }) {
  // The GoalsList sets the Global state's value of selectedDays.
  // I pull it from the global state here.
  const [{ selectedDays }, dispatch] = useAppState();

  const [curMonth, setCurMonth] = useState(startingMonth);

  useEffect(() => {
    console.log("MOUNTED NEW CALENDAR", startingMonth);
  }, []);

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

  // On the component mount. Get the current month number, and set it
  // in local state.
  useEffect(() => {
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    // var yyyy = today.getFullYear();

    // const curDay = mm + "/" + dd + "/" + yyyy;

    var today = new Date();

    console.log("MOUNTED");
    // setCurMonth(today.getMonth() + 1);
  }, []);

  function getMonth(month) {
    const myMonth = [[]];
    let dayOfWeek = 1;
    let week = [];

    for (let i = 1; i <= monthDays[month]; i++) {
      if (dayOfWeek === 8) {
        myMonth.push(week);
        dayOfWeek = 1;
        week = [];
      }
      // TODO -- INSTEAD OF PASSING JUST PASSING A DAY OF THE MONTH
      // TO THE DAY COMPONENT, PASS A DD-MM-YYYY TO USE AS AN ID.
      week.push(<Day day={i} month={parseInt(month)} year={2019} />);
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

  // Need to associate a Date with each of these Days
  // so that I can distinguish the ones that need to be
  // rendered as selected.

  // On initial load --> get the current month. Use that to
  // decide how many days / what month to render. Keep the
  // Month and year in local state, so that I can update it
  // as the user goes forward and backward in time.

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
      {calendarYear[curMonth].map(week => {
        return <div>{week}</div>;
      })}
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
