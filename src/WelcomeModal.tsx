import React from 'react';
import styled from 'styled-components';

export default function WelcomeModal() {
    return <Modal>Welcome to Track My Goals</Modal>;
}

const Modal = styled.div`
    width: 100%;
    height: 100%;

    text-align: center;
    vertical-align: middle;
    line-height: 20rem;
    font-family: 'Space Mono';
    font-size: 2rem;
    color: #b2b2b2;
`;
