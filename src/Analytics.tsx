import React, { useState } from 'react';
import styled from 'styled-components';
import BarGraph from './BarGraph';
import CommonlyDoneWith from './CommonlyDoneWith';

export default function Analytics({}) {
    return (
        <Container>
            <Row>Row 1</Row>
            <Row> Row 2</Row>
            <Row> Row 3</Row>
        </Container>
    );
}

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* position: relative;
    width: 100%;
    height: 100%; */

    flex: 1;

    background-color: grey;
    border: 1px solid black;
`;

const Container = styled.div`
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 22rem;
    margin-top: 1rem;
    overflow: hidden; */

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;

    flex: 1;

    margin-left: 24rem;
    overflow: hidden;
`;
