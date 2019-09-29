import React from 'react';
import styled from 'styled-components';
import BarGraph from './BarGraph';
import DonutGraph from './DonutGraph';

import { animated, useSpring } from 'react-spring';
import LegendGraph from './LegendGraph';

export default function Analytics({ goal, completedDays }) {
    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <Container style={animatedProps}>
            <StackedRowsContainer>
                <Row style={{ paddingTop: '2rem' }}>
                    <DonutGraph goal={goal} completedDays={completedDays} />
                    <BarGraph goal={goal} completedDays={completedDays} />
                </Row>
                {/* <Row style={{ paddingBottom: '10rem' }}>
                    <LegendGraph />
                </Row> */}
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

    // TODO -- ADD DIFFERENT BACKGROUND COLOR

    // background-color: #393f4d;
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
    height: 100%;
    margin-bottom: 10rem;
`;
