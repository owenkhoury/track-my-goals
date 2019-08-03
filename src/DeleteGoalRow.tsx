import React from 'react';
import styled from 'styled-components';

export default function DeleteGoalRow({ goal, index, undoDelete, confirmDelete }) {
    return (
        <NewListRow onClick={() => undoDelete}>
            <b style={{ paddingLeft: '1rem' }}>Delete goal?</b>
            {/* <b style={{ paddingLeft: '.2rem' }}>{goal}?</b> */}
            <div>
                <i
                    className='glyphicon glyphicon-remove'
                    style={{ paddingLeft: '4rem' }}
                    onClick={() => undoDelete()}
                />
                <i
                    className='glyphicon glyphicon-trash'
                    style={{ paddingLeft: '2rem', paddingRight: '1rem' }}
                    onClick={() => confirmDelete(goal, index)}
                />
            </div>
        </NewListRow>
    );
}

const NewListRow = styled.div`
    display: flex;
    direction: ltr;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    vertical-align: middle;
    line-height: 2.5rem;
    height: 5rem !important;
    margin-bottom: 2rem;
    width: 19.5rem;
    border-radius: 0.3rem;
    border: 1px solid #565656;

    background-color: #ff3a22;

    padding-left: 0.5rem;
    color: white;
    margin-left: 0.5rem;
    font-family: 'Avenir Next' !important;
`;
