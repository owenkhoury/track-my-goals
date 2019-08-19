import React from 'react';
import styled from 'styled-components';

export default function BarGraph({ goal, completedDays }) {
    return (
        <Container>
            <h4>Completed days: Meditate 15 minutes</h4>
            <Divider />
            <SubContainer>
                <Text>2 Weeks ago </Text>
                <Bar days={1} />
            </SubContainer>
            <Divider />
            <SubContainer>
                <Text>Last Week </Text>
                <Bar days={5} />
            </SubContainer>
            <Divider />
            <SubContainer>
                <Text>This Week </Text>
                <Bar days={2} />
            </SubContainer>
        </Container>
    );
}

const Text = styled.div`
    width: 6rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
`;

const SubContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
`;

const Divider = styled.div`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`;

const Bar = styled.div<{ days }>`
    width: ${(props) => (props.days ? `${props.days * 3}rem` : '1rem')};
    height: 2rem;
    margin-left: 1rem;
    background-color: blue;
`;
