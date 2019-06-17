import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logout } from "./utils";

export default function HeaderBar() {
  return (
    <Header>
      <Button onClick={logout}>Logout</Button>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 70px;
  background-color: #d8d8d8;
  margin-bottom: 1rem;
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
