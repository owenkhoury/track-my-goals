import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logout } from "./utils";

const monthName = {
  1: "Jan",
  2: "Feb",
  3: "mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sept",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};

export default function HeaderBar({ curMonth, updateCurMonth }) {
  // const [curMonth, setCurMonth] = useState(null);

  // Load the current month onto the screen.
  // useEffect(() => {
  //   const today = new Date();
  //   setCurMonth(today.getMonth() + 1);
  // }, []);

  return (
    <Header>
      <MonthContainer>
        <CurMonth>{monthName[curMonth] + " 2019"}</CurMonth>
        <MonthButton
          onClick={() => {
            if (curMonth != 1) {
              updateCurMonth(curMonth - 1);
            }
          }}
        >
          Prev
        </MonthButton>
        <MonthButton
          onClick={() => {
            if (curMonth != 12) {
              updateCurMonth(curMonth + 1);
            }
          }}
        >
          Next
        </MonthButton>
      </MonthContainer>
      <Button onClick={logout}>Logout</Button>
    </Header>
  );
}

const MonthContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background-color: #d8d8d8;
  margin-bottom: 1rem;
  margin-left: 24rem;
`;

const CurMonth = styled.div`
  font-size: 2.5rem;
  color: #0d160a;
  margin-left: 3rem;
  font-family: "Montserrat", sans-serif;
  margin-right: 1rem;
  padding-left: 1rem;
`;

const MonthButton = styled.button`
  display: inline-block;

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid;
  border-color: #acacac;
  border-radius: 3px;
  display: inline-block;
  background-color: #cbc9c9;
  border-radius: 0.3rem;

  &:hover {
    background-color: #bcb9b9;
  }
`;

const Button = styled.button`
  display: inline-block;

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid;
  border-radius: 3px;
  display: inline-block;
  background-color: #cbc9c9;
  border-radius: 0.3rem;

  &:hover {
    background-color: #bcb9b9;
  }
`;
