import React, { Fragment } from 'react';
import styled from 'styled-components';

export default function CommonlyDoneWith({}) {
    return (
        <Container>
            <div>Most commonly done with: Cooking</div>
            <Square />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Square = styled.div`
    width: 8rem;
    height: 8rem;
    background-color: #99e897;
`;
