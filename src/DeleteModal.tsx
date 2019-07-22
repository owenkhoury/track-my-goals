import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useAuth from "./useAuth";

export default function DeleteModal({ onClick, onDelete }) {
  return (
    <Modal>
      <div>Are you sure you want to delete this goal?</div>
      <button onClick={onClick}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
    </Modal>
  );
}

const Modal = styled.div`
  position: fixed;
  margin-top: 10rem;
  background: white;
  width: 15rem;
  height: 15rem;
  /* transform: translate(-50%, -50%); */
  z-index: 50;
  border: 0.3rem solid black;
`;
