import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { login, signup } from './utils';

export default function LoggedOut() {
    const [focus, setFocus] = useState(null);

    // Control whether user sees login or signup.
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // login refs
    const loginEmailRef = useRef(null);
    const loginPasswordRef = useRef(null);

    useOutsideAlerter(loginEmailRef);
    useOutsideAlerter(loginPasswordRef);

    // Signup refs
    const signupEmailRef = useRef(null);
    const signupPasswordRef = useRef(null);

    useOutsideAlerter(signupEmailRef);
    useOutsideAlerter(signupPasswordRef);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await login(loginEmailRef.current.value, loginPasswordRef.current.value);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await signup({
                email: signupEmailRef.current.value,
                password: signupPasswordRef.current.value
            });
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    function useOutsideAlerter(ref) {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setFocus('');
                setError(null);
            }
        }
        useEffect(() => {
            // Bind the event listener
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener('mousedown', handleClickOutside);
            };
        });
    }

    return isLogin ? (
        <Login>
            <Heading>Log into Habit Tracker</Heading>
            <CreateAccount>
                New? <TextLink onClick={() => setIsLogin(false)}>Create Account</TextLink>
            </CreateAccount>
            <LoginInput
                ref={loginEmailRef}
                isLogin={isLogin}
                focus={focus === 'email'}
                placeholder={'Email Address'}
                onClick={() => {
                    setFocus('email');
                    setError(null);
                }}
            />
            <LoginInput
                ref={loginPasswordRef}
                isLogin={isLogin}
                type='password'
                focus={focus === 'password'}
                placeholder={'Password'}
                onClick={() => {
                    setFocus('password');
                    setError(null);
                }}
            />
            <LoginButton onClick={handleLogin}>Login</LoginButton>
            {error ? <ErrorMessage>Invalid username or password</ErrorMessage> : null}
        </Login>
    ) : (
        <Signup>
            <Heading>Create Account</Heading>
            <CreateAccount>
                Have one? <TextLink onClick={() => setIsLogin(true)}>Log In</TextLink>
            </CreateAccount>
            <LoginInput
                ref={signupEmailRef}
                isLogin={isLogin}
                focus={focus === 'email'}
                placeholder={'Email Address'}
                onClick={() => {
                    setFocus('email');
                    setError(null);
                }}
            />
            <LoginInput
                ref={signupPasswordRef}
                isLogin={isLogin}
                type='password'
                focus={focus === 'password'}
                placeholder={'Password'}
                onClick={() => {
                    setFocus('password');
                    setError(null);
                }}
            />
            <LoginButton onClick={handleSignup}>Create Account</LoginButton>
            {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        </Signup>
    );
}

const TextLink = styled.u`
    &:hover {
        cursor: pointer;
    }
`;

const Signup = styled.div`
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; /*centers items on the line (the x-axis by default)*/
    align-items: center; /*centers items on the cross-axis (y by default)*/
`;

const Login = styled.div`
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
    font-family: 'Avenir Next' !important;
`;

const CreateAccount = styled.h1`
    color: '#A9A9A9';
    font-size: 1rem;
    margin-top: 1rem;
    font-family: 'Avenir Next' !important;
`;

const LoginInput = styled.input<{ focus; isLogin }>`
    height: 3rem;
    width: 18rem;
    border: none;
    font-size: 1em;
    margin-top: 2rem;

    padding-left: 1rem;
    border-radius: ${(props) => (props.isLogin ? '0.3rem' : '0rem')};
    font-family: 'Avenir Next' !important;

    background-color: ${(props) => (props.focus ? '#e5e5e5' : 'transparent')};
    border-bottom: ${(props) => (props.focus ? '3px solid transparent' : '2px solid black')};
`;

const LoginButton = styled.button`
    height: 3rem;
    width: 19rem;
    color: black;
    background: #d8d8d8;
    border: none;
    font-size: 1.1rem;
    margin-top: 2rem;

    padding-left: 1rem;
    border-radius: 0.3rem;
    font-family: 'Avenir Next' !important;
`;

const ErrorMessage = styled.h1`
    margin-top: 1.5rem;
    color: #cf2e38;
    font-size: 1rem;
    font-family: 'Avenir Next' !important;
`;
