import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logout } from "./utils";

export default function HeaderBar() {
  return (
    <Header>
      <span>Habit Tracker</span>
      <Button onClick={logout}>Logout</Button>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 70px;
  background-color: #5cc7ff;
`;

const Button = styled.button`
  display: inline-block;
  color: #5cc7ff;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #5cc7ff;
  border-radius: 3px;
  display: inline-block;
`;
