import React, { useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';
import useAuth from './useAuth';
import GoalsList from './GoalList';
import Calendar from './Calendar';
import { db } from './fire';
import HeaderBar from './HeaderBar';
import { GOAL_COLORS, completedDay } from './constants/AppConstants';
import Notes from './Notes';
import { addCompletedDay, removeCompletedDay, updateNotesForCompletedDay } from './utils';

import { useSpring, animated } from 'react-spring';
import BarGraph from './BarGraph';
import Analytics from './Analytics';

// TODO -- I'M NOT CLEARING OUT MY LOCAL TRACK OF COMPLETED DAYS WHEN A GOAL GETS DELETED.

export default function LoggedIn() {
    const { auth } = useAuth();

    const [selectedGoals, setSelectedGoals] = useState([]);

    // Color mapping. Goal --> Hex Color
    const [colorMap, setColorMap] = useState({});

    // The list of the existing goals.
    const [existingGoals, setExistingGoals] = useState([]);

    // The currently selectedGoal goal.
    const [selectedGoal, setSelected] = useState('');

    // Mapping of each goal to the days that are completed (selectedGoal).
    // The old state of the mapping at the time of the app being loaded
    // const [oldCompletedDays, setOldCompletedDays] = useState({});

    // Mapping of each goal to the days that are completed (selectedGoal).
    // the new state of the mapping as the user makes new selections.
    const [completedDays, setNewCompletedDays] = useState({});

    const [curMonth, setCurMonth] = useState(null);

    const [goalCreationDateMap, setGoalCreationDateMap] = useState({});

    // Track which completed day we are currently writing notes for.
    const [selectedDayForNotes, setSelectedDayForNotes] = useState(null);

    // Track if we're on the analytics page or the calendar page.
    const [showAnalytics, setShowAnalytics] = useState(false);

    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    const addHandler = (handler) => window.addEventListener('beforeunload', handler);
    const removeHandler = (handler) => window.removeEventListener('beforeunload', handler);

    useEffect(() => {
        console.log('\n');
        console.log('===================== LOGGED IN STATE =========================');
        console.log('selectedGoals: ', selectedGoals);
        console.log('completedDays:  ', completedDays);
        console.log('selectedDayForNotes: ', selectedDayForNotes);
        console.log('colorMap: ', colorMap);
        console.log('\n');
    });

    /**
     * Save completed days for last viewed goal, before the app window closes or the page is refreshed.
     */
    const useWindowUnloadEffect = (handler, callOnCleanup) => {
        const prevHandler = useRef(null);
        useEffect(() => {
            if (prevHandler.current) removeHandler(handler.current); // remove the the current event listener, if one exists
            prevHandler.current = handler;
            addHandler(handler);
            return () => {
                if (callOnCleanup) handler();
                removeHandler(handler);
            };
        }, [handler]);
    };

    // Load the current month onto the screen.
    useEffect(() => {
        const today = new Date();
        setCurMonth(today.getMonth() + 1);
    }, []);

    // Load goals and completed days on component mount (only once).
    useEffect(() => {
        fetchGoals();
        fetchCompletedDays();
    }, []);

    async function updateCurMonth(month: number) {
        setCurMonth(month);
    }

    function timeConverter(date: Date) {
        return date.toISOString().substring(0, 10);
    }

    /**
     * Pull Goal data from the firestore.
     */
    function fetchGoals() {
        db.collection('goals')
            .doc(auth.uid)
            .collection('userGoals')
            .where('uid', '==', auth.uid)
            .get()
            .then((snapshot) => {
                const existingGoals: any[] = [];
                const existingColorMap = {};
                const createdDateMap = {};
                snapshot.docs.forEach((doc) => {
                    if (doc.data().goal) {
                        existingGoals.push(doc.data().goal);
                        existingColorMap[doc.data().goal] = doc.data().color;

                        createdDateMap[doc.data().goal] = timeConverter(new Date(doc.data().created));
                    }
                });

                existingGoals.sort((a, b) => a.created - b.created);

                // Set the initially selectedGoal goal
                const selectedGoal: [string] = [selectedGoals[0]];
                setSelectedGoals(selectedGoal);
                setSelected(existingGoals[0]);
                setExistingGoals(existingGoals);
                setColorMap(existingColorMap);
                setGoalCreationDateMap(createdDateMap);

                handleGoalSelected(existingGoals[0]);
            });
    }

    /**
     * Load a mapping of each goal to its list of completed dates.
     */
    function fetchCompletedDays() {
        db.collection('completed')
            .doc(auth.uid)
            .collection('daysCompleted')
            .get()
            .then((snapshot) => {
                const datesCompleted: any[] = [];

                snapshot.docs.forEach((doc) => {
                    const goal = doc.data().goal;
                    const date = doc.data().date;
                    const notes = doc.data().notes ? doc.data().notes : '';
                    datesCompleted.push({ goal: goal, date: date, notes: notes });
                });

                const datesCompletedMap = {};
                datesCompleted.forEach((data) => {
                    if (data.goal in datesCompletedMap) {
                        datesCompletedMap[data.goal].push({
                            date: data.date,
                            notes: data.notes
                        });
                    } else {
                        datesCompletedMap[data.goal] = [{ date: data.date, notes: data.notes }];
                    }
                });
                // setOldCompletedDays(JSON.parse(JSON.stringify(datesCompletedMap)));
                setNewCompletedDays(datesCompletedMap);
            });
    }

    /**
     * Returns the new hex code to use.
     * @param goal
     */
    function addToColorMap(goal: string): string {
        let nextHexColor = null;
        // Watch for null pointer exception
        const colorsInUse = Object.values(colorMap);

        console.log('add to color map:  ', colorsInUse, GOAL_COLORS);

        for (let i = 0; i < GOAL_COLORS.length; i++) {
            if (!colorsInUse.includes(GOAL_COLORS[i])) {
                nextHexColor = GOAL_COLORS[i];
                break;
            }
        }

        const updatedMap = colorMap;
        updatedMap[goal] = nextHexColor;
        setColorMap(updatedMap);

        return nextHexColor;
    }

    /**
     * TODO -- DECIDE IF I SHOULD KEEP THIS. NOT REALLY NEEDED SINCE THE
     * COLOR MAP WILL REMOVE THE DELETED GOAL'S COLOR ON REFRESH ANYWAY.
     * @param goal
     */
    function removeFromColorMap(goal: string) {
        const updatedMap = colorMap;

        console.log('remove from color map: ');

        Object.keys(updatedMap).forEach((key) => {
            console.log(key, goal);
            if (key == goal) {
                delete updatedMap[goal];
            }
        });
        setColorMap(updatedMap);
    }

    function selectAllGoals(goals) {
        setSelectedGoals(goals);
    }

    /**
     * Update the selected goals state, removing previously selected and adding newly selected goals.
     * @param goal
     * @param goalToRemove
     */
    function handleGoalSelected(goal: string, goalsToRemove?: string[]) {
        console.log('handleGoalSelected', goal, goalsToRemove);

        if (!(selectedGoals.includes(goal) && selectedGoals.length === 1)) {
            let updateSelected = selectedGoals.includes(goal) ? [...selectedGoals] : [...selectedGoals, goal];

            if (goalsToRemove) {
                updateSelected = updateSelected.filter((g) => !goalsToRemove.includes(g) || g == goal);
            }
            setSelectedGoals(updateSelected);
        }
    }

    /**
     * Remove goal from selectedGoals state.
     * @param goal
     */
    function handleGoalRemoved(goal: string) {
        if (selectedGoals.includes(goal)) {
            const filteredSelectedGoals = selectedGoals.filter((g) => {
                return g != goal;
            });

            // removeDaysCompleted(auth.uid, goal);
            // removeFromColorMap(goal);
            setSelectedGoals([...filteredSelectedGoals]);
        }
    }

    /**
     * Add this day to this goal's list of completed days.
     * @param date
     * @param goal
     */
    function handleDayCompleted(date: string, goal: string) {
        const completedDay: completedDay = {
            date: date,
            goal: goal,
            notes: ''
        };

        // Make firestore call to save completed date.
        addCompletedDay(auth.uid, completedDay);

        const update: Object = JSON.parse(JSON.stringify(completedDays));
        update[goal] = update[goal] ? [...update[goal], { date: date, notes: '' }] : [{ date: date, notes: '' }];

        setNewCompletedDays(update);
    }

    /**
     * Remove this day from this goal's list of completed days.
     * @param date
     * @param goal
     */
    function handleDayRemoved(date: string, goal: string) {
        // Make firestore call to remove completed date.
        removeCompletedDay(auth.uid, goal, date);

        const update: Object = JSON.parse(JSON.stringify(completedDays));
        update[goal] = update[goal].filter((curDate) => curDate.date !== date);
        setNewCompletedDays(update);

        setSelectedDayForNotes(null);
    }

    function updateSelected(goal: string) {
        // batchUpdateCompletedDays(selectedGoal);
        if (GoalsList) setSelected(goal);
    }

    function handleNoteSelected(date: string, goal: string) {
        let notes = null;

        if (completedDays && completedDays[goal]) {
            const day = completedDays[goal].find((e) => {
                return e.date === date;
            });

            if (day) {
                notes = day.notes;
            }
        }

        const selectedDay: completedDay = {
            date: date,
            goal: goal,
            notes: notes
        };

        setSelectedDayForNotes(selectedDay);
    }

    async function handleNoteAdded(day: completedDay) {
        // update newSelectedDays to update this selectedGoal day's notes property

        const update: Object = JSON.parse(JSON.stringify(completedDays));

        let dateIndex = update[day.goal].findIndex((obj) => obj.date == day.date);

        if (dateIndex != null && dateIndex != undefined) {
            update[day.goal][dateIndex].notes = day.notes;
            setNewCompletedDays(update);
            setSelectedDayForNotes(day);

            await updateNotesForCompletedDay(auth.uid, day);
        }
    }

    return (
        <OverallContainer style={animatedProps}>
            <HeaderBar
                curMonth={curMonth}
                updateCurMonth={updateCurMonth}
                toggleAnalytics={() => setShowAnalytics(!showAnalytics)}
            />
            <InnerRowContainer>
                <GoalsList
                    existingGoals={existingGoals}
                    colorMap={colorMap}
                    updateSelected={updateSelected}
                    addToColorMap={addToColorMap}
                    removeFromColorMap={removeFromColorMap}
                    handleGoalSelected={handleGoalSelected}
                    handleGoalRemoved={handleGoalRemoved}
                    selectedGoals={selectedGoals}
                    creationDateMap={goalCreationDateMap}
                    selectAllGoals={selectAllGoals}
                />
                <CalendarContainer>
                    {showAnalytics ? (
                        <Analytics goal={selectedGoal} completedDays={completedDays} />
                    ) : (
                        <Calendar
                            key='calendar1'
                            curMonth={curMonth}
                            curGoal={selectedGoal}
                            completedDays={completedDays}
                            colorMap={colorMap}
                            selectedGoals={selectedGoals}
                            handleDayCompleted={handleDayCompleted}
                            handleDayRemoved={handleDayRemoved}
                            handleNoteSelected={handleNoteSelected}
                            selectedDayForNotes={selectedDayForNotes}
                        />
                    )}
                </CalendarContainer>
                <Notes
                    selectedDayForNotes={selectedDayForNotes}
                    completedDays={completedDays}
                    handleNoteAdded={handleNoteAdded}
                />
            </InnerRowContainer>
        </OverallContainer>
    );
}

const OverallContainer = styled(animated.div)`
    height: 100%;
    background-color: #1c1e1f;
`;

const CalendarContainer = styled.div`
    -webkit-box-flex: 1;
    -ms-flex: 1;

    flex: 1;

    padding-right: 19rem;
    padding-left: 2rem;
`;

const InnerRowContainer = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;

    -webkit-box-pack: justify;
    -ms-flex-pack: justify;

    display: flex;
    justify-content: space-between;
    height: 100%;
`;
