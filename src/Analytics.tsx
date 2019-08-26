import React from 'react';
import styled from 'styled-components';
import BarGraph from './BarGraph';

export default function Analytics({}) {
    return (
        <Container>
            <StackedRowsContainer>
                <Row>
                    <BarGraph goal={null} completedDays={null} />
                    <BarGraph goal={null} completedDays={null} />
                </Row>
                <Row>
                    <BarGraph goal={null} completedDays={null} />
                    <BarGraph goal={null} completedDays={null} />
                </Row>
            </StackedRowsContainer>
        </Container>
    );
}

const Container = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;

    flex: 1;

    margin-left: 24rem;
    overflow: hidden;
`;

const StackedRowsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: space-evenly;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;
