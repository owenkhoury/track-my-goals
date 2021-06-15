import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Donut } from 'britecharts-react';

export default function DonutGraph({ goal, completedDays }) {
    const [donutData, setDonutData] = useState([]);

    useEffect(() => {
        const today = new Date();
        const curMonth = today.getMonth() + 1;
        const dayOfMonth = today.getDate();
        const totalDays = new Date(2021, curMonth, 0).getDate();

        let totalCompleted = 0;
        if (completedDays && completedDays[goal]) {
            completedDays[goal].forEach((day) => {
                const isDayInMonth: boolean = +day.date.substring(0, 2) === curMonth;
                const isDayInPast: boolean = +day.date.substring(3, 5) <= dayOfMonth;

                if (day.date && isDayInMonth && isDayInPast) {
                    totalCompleted++;

                    console.log('donut graph: ', +day.date.substring(3, 5), dayOfMonth);
                }
            });
        }

        const newData = [
            {
                quantity: totalCompleted,
                percentage: ((totalCompleted / dayOfMonth) * 100).toFixed(0),
                name: 'Completed',
                color: 'white',
                id: 1
            },
            {
                quantity: dayOfMonth - totalCompleted,
                percentage: (((dayOfMonth - totalCompleted) / dayOfMonth) * 100).toFixed(0),
                name: 'Missed',
                id: 2
            }
        ];

        setDonutData(newData);
    }, [goal]);

    const logMouseOver = () => console.log('Mouse Over');

    return (
        <Container>
            <Title>Progress so far this month</Title>
            <Donut
                data={donutData}
                customMouseOver={logMouseOver}
                externalRadius={150}
                internalRadius={75}
                highlightSliceById={1}
            />
        </Container>
    );
}

export const Title = styled.div`
    margin-bottom: 3rem;
    font-size: 1.5rem;
    font-family: 'Space Mono';
    color: white;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
