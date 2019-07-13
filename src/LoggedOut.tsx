import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
// import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
// import Signup from "./Signup";
// import Login from "./Login";

export default function LoggedOut() {
  const [focus, setFocus] = useState(null);

  // Control whether user sees login or signup.
  const [isLogin, setIsLogin] = useState(true);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  useOutsideAlerter(emailRef);
  useOutsideAlerter(passwordRef);

  function useOutsideAlerter(ref) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setFocus("");
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
    // <div className="LoggedOut">
    //   <Tabs>
    //     <TabList>
    //       <Tab>Login</Tab>
    //       <Tab>Sign Up</Tab>
    //     </TabList>
    //     <TabPanels>
    //       <TabPanel>
    //         <Login />
    //       </TabPanel>
    //       <TabPanel>
    //         <Signup />
    //       </TabPanel>
    //     </TabPanels>
    //   </Tabs>
    // </div>
    <Container>
      <Heading>Log into Habit Tracker</Heading>
      <CreateAccount>New? Create Account</CreateAccount>
      <LoginInput
        ref={emailRef}
        focus={focus === "email"}
        placeholder={"Email Address"}
        onClick={() => setFocus("email")}
      />
      <LoginInput
        ref={passwordRef}
        focus={focus === "password"}
        placeholder={"Password"}
        onClick={() => setFocus("password")}
      />
      <LoginButton>Login</LoginButton>
    </Container>
  );
}

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
  border-bottom: ${props => (props.focus ? "" : "3px solid black")};
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
