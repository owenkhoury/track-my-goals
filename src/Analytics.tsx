import React from 'react';
import styled from 'styled-components';
import BarGraph from './BarGraph';

import { animated, useSpring } from 'react-spring';

export default function Analytics({}) {
    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <Container style={animatedProps}>
            <StackedRowsContainer>
                <Row style={{ paddingTop: '2rem' }}>
                    <BarGraph goal={null} completedDays={null} />
                    <BarGraph goal={null} completedDays={null} />
                </Row>
                <Row style={{ paddingBottom: '10rem' }}>
                    <BarGraph goal={null} completedDays={null} />
                    <BarGraph goal={null} completedDays={null} />
                </Row>
            </StackedRowsContainer>
        </Container>
    );
}

const Container = styled(animated.div)`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;

    height: 100%;

    overflow: hidden;
`;

const StackedRowsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: space-evenly;
    height: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 50%;
`;
