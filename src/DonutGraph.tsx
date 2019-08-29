import React, { useState, useEffect } from 'react';
import { Donut } from 'britecharts-react';

import { monthDays } from './Calendar';

export default function DonutGraph({ goal, completedDays }) {
    const [daysCompletedThisMonth, setDaysCompletedThisMonth] = useState(null);

    const [donutData, setDonutData] = useState([]);

    // TODO -- MENTION THAT ALL THIS BIS IS FOR THE CURRENT MONTH.

    useEffect(() => {
        const today = new Date();
        const curMonth = today.getMonth() + 1;
        const totalDays = new Date(2019, curMonth, 0).getDate();

        let totalCompleted = 0;

        if (completedDays && completedDays[goal]) {
            completedDays[goal].forEach((day) => {
                if (+day.date.substring(1, 2) == curMonth) {
                    totalCompleted++;
                }
            });
        }

        const newData = [
            {
                quantity: totalCompleted,
                percentage: ((totalCompleted / totalDays) * 100).toFixed(0),
                name: 'Done',
                id: 1
            },
            {
                quantity: totalDays - totalCompleted,
                percentage: (((totalDays - totalCompleted) / totalDays) * 100).toFixed(0),
                name: 'Not Done',
                id: 2
            }
        ];

        setDonutData(newData);

        console.log('COMPLETED: ', totalCompleted, totalDays - totalCompleted, totalDays);
    }, [goal]);

    const logMouseOver = () => console.log('Mouse Over');

    return (
        <Donut
            data={donutData}
            customMouseOver={logMouseOver}
            externalRadius={100}
            internalRadius={47}
            highlightSliceById={1}
        />
    );
}