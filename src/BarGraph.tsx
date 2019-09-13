import React, { useEffect } from 'react';

import { Bar } from 'britecharts-react';
import colors from './colors';

export default function BarGraph({ goal, completedDays }) {
    const barData = [
        { name: 'This week', value: numDaysCompletedInPrevWeek(0) },
        { name: '1 week ago', value: numDaysCompletedInPrevWeek(1) },
        { name: '2 weeks ago', value: numDaysCompletedInPrevWeek(2) },
        { name: '3 weeks ago', value: numDaysCompletedInPrevWeek(3) }
    ];

    // generate an array of the last s

    function isDayInRange(date: string, startDate: string, endDate: string) {
        const dateArray = date.split('-');
        const startArray = startDate.split('-');
        const endArray = endDate.split('-');

        console.log('HERE HERE HERE: ', date, startDate, endDate);
        console.log('HERE HERE HERE: ', +dateArray[1], +startArray[1], +endArray[1]);

        // Check case for weeks that fit completely in current week.
        return (
            +dateArray[0] === +startArray[0] &&
            +dateArray[0] === +endArray[0] &&
            +dateArray[1] >= +startArray[1] &&
            +dateArray[1] <= +endArray[1]
        );
    }

    function getPreviousWeek(weeksAgo: number): { firstDay: string; lastDay: string } {
        let today: any = new Date();
        today.setDate(today.getDate() - 7 * weeksAgo);

        let curDay = String(today.getDate()).padStart(2, '0');
        let curMonth = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let year = today.getFullYear();

        // Runs 0 (Sunday) -> 6 (saturday)
        const dayOfWeek = today.getDay();

        const firstOfWeek = curMonth + '-' + String(+curDay - dayOfWeek) + '-' + year;
        const endOfWeek = curMonth + '-' + String(+curDay + (6 - dayOfWeek)) + '-' + year;

        return { firstDay: firstOfWeek, lastDay: endOfWeek };
    }

    function numDaysCompletedInPrevWeek(weeksAgo: number): number {
        if (completedDays) {
            const days = completedDays[goal];
            const range = getPreviousWeek(weeksAgo);
            let total = 0;

            days.forEach((day) => {
                // convert the date to a number
                // let date = +day.date.replace(/-/g, '');

                if (isDayInRange(day.date, range.firstDay, range.lastDay)) {
                    console.log('================', day.date, range.firstDay, range.lastDay);
                    total += 1;
                }
            });

            return total;
        }

        return 0;
    }

    return (
        <Bar
            data={barData}
            height={200}
            width={300}
            isHorizontal={true}
            margin={{ left: 100 }}
            colorSchema={colors.colorSchemas.orange}
        />
    );
}
