import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

export default function MultiSelectSquare(color) {
    const [isHovered, toggleHover] = useState(false);

    return (
        <Fragment>
            <Square
                onMouseEnter={() => toggleHover(!isHovered)}
                onMouseLeave={() => toggleHover(!isHovered)}
                color={color.color}>
                {isHovered && color.goal ? <DropDown>{color.goal}</DropDown> : null}
            </Square>
        </Fragment>
    );
}

const Square = styled.div<{ color }>`
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${(props) => props.color};
    border-radius: 2px;
    border: 0.5px solid black;
    margin: 0.1rem;
`;

const DropDown = styled.div`
    position: relative;
    width: 4rem;
    height: 2.5rem;
    z-index: 50;
    background-color: black;
    color: white;
    text-align: center;
    vertical-align: middle;
    line-height: 2.5rem;
    margin-top: 1.7rem;
    border-radius: 2.5px;
`;
