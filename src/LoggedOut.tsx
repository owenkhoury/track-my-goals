import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { login } from "./utils";
// import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
// import Signup from "./Signup";
// import Login from "./Login";

export default function LoggedOut() {
  const [focus, setFocus] = useState(null);

  // Control whether user sees login or signup.
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useOutsideAlerter(emailRef);
  useOutsideAlerter(passwordRef);

  const handleLogin = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  function useOutsideAlerter(ref) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setFocus("");
        setError(null);
      }
    }
    useEffect(() => {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
  }

  return (
    <Container>
      <Heading>Log into Habit Tracker</Heading>
      <CreateAccount>
        New?{" "}
        <TextLink onClick={() => console.log("yo")}>Create Account</TextLink>
      </CreateAccount>
      <LoginInput
        ref={emailRef}
        focus={focus === "email"}
        placeholder={"Email Address"}
        onClick={() => {
          setFocus("email");
          setError(null);
        }}
      />
      <LoginInput
        ref={passwordRef}
        focus={focus === "password"}
        placeholder={"Password"}
        onClick={() => {
          setFocus("password");
          setError(null);
        }}
      />
      <LoginButton onClick={handleLogin}>Login</LoginButton>
      {error ? <ErrorMessage>Invalid username or password</ErrorMessage> : null}
    </Container>
  );
}

const TextLink = styled.u`
  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /*centers items on the line (the x-axis by default)*/
  align-items: center; /*centers items on the cross-axis (y by default)*/
`;

const Heading = styled.h1`
  color: black;
  font-size: 1.64rem;
  font-family: "Avenir Next" !important;
`;

const CreateAccount = styled.h1`
  color: "#A9A9A9";
  font-size: 1rem;
  margin-top: 1rem;
  font-family: "Avenir Next" !important;
`;

const LoginInput = styled.input<{ focus }>`
  height: 3rem;
  width: 18rem;
  border: none;
  font-size: 1em;
  margin-top: 2rem;

  padding-left: 1rem;
  border-radius: 0.3rem;
  font-family: "Avenir Next" !important;

  background-color: ${props => (props.focus ? "#e5e5e5" : "transparent")};
  border-bottom: ${props =>
    props.focus ? "3px solid transparent" : "3px solid black"};
`;

const LoginButton = styled.button`
  height: 3rem;
  width: 19rem;
  color: black;
  background: #d8d8d8;
  border: none;
  font-size: 1.1em;
  margin-top: 2rem;

  padding-left: 1rem;
  border-radius: 0.3rem;
  font-family: "Avenir Next" !important;
`;

const ErrorMessage = styled.h1`
  margin-top: 1.5rem;
  color: #cf2e38;
  font-size: 1rem;
  font-family: "Avenir Next" !important;
`;
