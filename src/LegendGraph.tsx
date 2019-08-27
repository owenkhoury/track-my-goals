import React from 'react';
import { Legend, Bullet } from 'britecharts-react';
export default function LegendGraph({}) {
    const legendData = [
        {
            name: 'Shiny',
            id: 1,
            quantity: 86
        }
    ];

    const fullTestData = [
        {
            ranges: [130, 160, 250],
            measures: [150, 180],
            markers: [175]
        }
    ];

    return <Bullet data={fullTestData} width={600} />;
}
