import React from 'react';
import styled from 'styled-components';

export default function GoalRow({
    index,
    goal,
    goals,
    goalsToDelete,
    colorMap,
    selectedGoals,
    creationDateMap,
    handleGoalSelected,
    updateSelected,
    handleGoalRemoved,
    readyToDelete
}) {
    return (
        <ListRow
            selected={selectedGoals.includes(goal)}
            checked={
                (document.getElementById(goal) as HTMLInputElement) &&
                (document.getElementById(goal) as HTMLInputElement).checked
            }
            colorMap={colorMap}
            goal={goal}
            toDelete={goalsToDelete.includes(goal)}
            onClick={() => {
                if (goals.includes(goal)) {
                    if (selectedGoals) {
                        selectedGoals.forEach((element) => {
                            if (document.getElementById(element) as HTMLInputElement) {
                                (document.getElementById(element) as HTMLInputElement).checked = false;
                            }
                        });
                    }
                    // Set as selected and check this rows checkbox, remove the previously selected from the selectedList.
                    handleGoalSelected(goal, selectedGoals);
                    updateSelected(goal);

                    (document.getElementById(goal) as HTMLInputElement).checked = true;
                }
            }}>
            <ListRowLeft>
                <Circle color={colorMap && colorMap[goal] ? colorMap[goal] : 'red'} className='dot' />
                <ListRowInfo>
                    <Goal>{goal}</Goal>
                    <StartDate>{creationDateMap[goal]}</StartDate>
                </ListRowInfo>
            </ListRowLeft>
            <ListRowRight>
                <Checkbox>
                    <input
                        id={goal}
                        type='checkbox'
                        defaultChecked={index === 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            let checkbox = document.getElementById(goal) as HTMLInputElement;

                            if (checkbox.checked) {
                                handleGoalSelected(goal);
                            } else if (selectedGoals.length === 1) {
                                e.preventDefault();
                            } else {
                                handleGoalRemoved(goal);
                            }
                        }}
                    />
                </Checkbox>{' '}
                <DeleteButton
                    onClick={(e) => {
                        e.stopPropagation();
                        readyToDelete(goal);
                    }}>
                    {' '}
                    <DeleteIcon className='glyphicon glyphicon-trash' />
                </DeleteButton>
            </ListRowRight>
        </ListRow>
    );
}

interface ListRowProps {
    selected: boolean;
    checked: boolean;
    colorMap: Object;
    goal: string;
    toDelete: boolean; // check if this row is in deleting state (user clicked delete button but waiting for confirmation / cancellation).
}

const ListRow = styled.div<ListRowProps>`
    display: flex;
    direction: ltr;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    vertical-align: middle;
    line-height: 2.5rem;
    height: 4.2rem;
    margin-bottom: 1rem;
    width: 19.5rem;
    border-radius: 0.3rem;
    border: 1px solid #888888;
    background-color: ${(props) => (props.toDelete ? 'red' : '#464e50')};
    padding-left: 0.5rem;
    color: white;
    margin-left: 0.5rem;
    font-family: 'Space Mono' !important;

    filter: ${(props) => (props.selected ? 'brightness(100%)' : 'brightness(65%)')};
    &:hover {
        /* background-color: ${(props) => (props.colorMap && props.goal ? props.colorMap[props.goal] : '#d8d8d8')}; */
        filter: ${(props) => (props.selected ? 'brightness(100%)' : 'brightness(50%)')};
    }
`;

const DeleteButton = styled.button`
    background-color: rgba(0, 0, 0, 0);
    border: none;
`;

const DeleteIcon = styled.i`
    padding-right: 0.5rem;
    &:hover {
        filter: brightness(85%);
        color: red;
    }
`;

const ListRowInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding-left: 0.75rem;
`;

const Circle = styled.span<{ color }>`
    height: 2.5rem;
    width: 2.5rem;
    background-color: ${(props) => props.color};
    border-radius: 50%;
    border: 0.04rem solid black;
`;

const Goal = styled.div`
    color: white;
    font-size: 1rem;
    font-family: 'Space Mono' !important;
    overflow: auto;
    height: 29px;
    margin-bottom: 0;
    overflow-y: hidden; // hide vertical
    overflow-x: hidden;
`;

const StartDate = styled.div`
    color: '#A9A9A9';
    font-size: 0.6rem;
    font-family: 'Space Mono' !important;
    overflow-y: hidden; // hide vertical
    overflow-x: hidden;
    height: 25px;
    padding-bottom: 0.6rem;
`;

const ListRowLeft = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const ListRowRight = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
`;

const Checkbox = styled.label`
    margin-right: 0rem;
    width: 3rem;
`;
