import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";

export default function Notes({}) {
  return (
    <Container>
      <NotesInput placeholder="Add Notes for goal 3 on 7/18/19" />
    </Container>
  );
}

const Container = styled.div`
  width: 17rem;
  border-left: 1px solid black;
  background: #d8d8d8;
  position: absolute;
  height: 100%;
  right: 0;
`;

const NotesInput = styled.textarea`
  width: 17rem;
  height: 100%;
  background: #d8d8d8;
  font-family: "Avenir Next";
  padding-bottom: 250%;
  padding-left: 0.5rem;
`;
