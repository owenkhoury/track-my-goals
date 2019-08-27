import React from 'react';

import { Bar } from 'britecharts-react';
import colors from './colors';

export default function BarGraph({ goal, completedDays }) {
    const barData = [
        { name: 'This week', value: 2 },
        { name: '1 week ago', value: 5 },
        { name: '2 weeks ago', value: 4 },
        { name: '3 weeks ago', value: 3 }
    ];

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
