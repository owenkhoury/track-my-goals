import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGoal, logout, loadCompletedDays } from "./utils";
import { useAppState } from "./app-state";
import { GoalsSelectedMap } from "./MockDB";
import { db } from "./fire";
import Calendar from "./Calendar";
import useAuth from "./useAuth";

// NOTE -- I HAVE A MAPPING OF GOAL NAMES TO DOCUMENT IDS. USE
// THESE IDS TO UPDATE THEIR COMPLETED DAYS.

export default function GoalsList() {
  const { auth } = useAuth();

  const [{}, dispatch] = useAppState();

  // This is the goal that is currently typed into the new goal input.
  const [newGoal, setNewGoal] = useState("");

  // The list of the existing goals.
  const [goals, setGoals] = useState(["asdfasd"]);

  // The currently selected goal.
  const [selected, setSelected] = useState("asdfasd");

  // Tracks the month that was last viewed for each of the goals.
  // const [goalToMonthMap, setGoalToMonthMap] = useState({});

  // map of each goal to the dates that have been selected
  const [goalToDatesCompleted, setGoalToDatesCompleted] = useState({});

  // useEffect(() => {
  //   console.log(goalToMonthMap);
  //   console.log(selected);
  //   console.log(
  //     "IS IT TRUE? ",
  //     selected,
  //     goalToMonthMap,
  //     selected ? goalToMonthMap[selected] : "not found"
  //   );
  // });

  // CREATE AND UPDATE THE MAPPING OF GOAL -> LAST VIEWED MONTH.
  // useEffect(() => {
  //   let curMap = goalToMonthMap;

  //   goals.forEach(goal => {
  //     if (!curMap[goal]) {
  //       const today = new Date();
  //       curMap[goal] = today.getMonth() + 1;
  //     }
  //   });
  //   setGoalToMonthMap(curMap);
  // }, [goals, goalToMonthMap]);

  useEffect(() => {
    console.log("LOADED COMPLETED DAYS: ", goalToDatesCompleted);
  });

  // LOAD THE EXISTING GOALS INTO STATE.
  useEffect(() => {
    const fetchGoals = db
      .collection("goals")
      .where("uid", "==", auth.uid)
      .get()
      .then(snapshot => {
        const existingGoals = [];
        snapshot.docs.forEach(doc => {
          existingGoals.push(doc.data().goal);
        });

        setSelected(existingGoals[0]);
        setGoals(existingGoals);
      });

    return () => fetchGoals();
  }, []);

  // LOAD THE COMPLETED DAYS INTO STATE.
  useEffect(() => {
    const fetchCompletedDays = db
      .collection(`daysCompleted-${auth.uid}`)
      .get()
      .then(snapshot => {
        const datesCompleted = [];

        snapshot.docs.forEach(doc => {
          const goal = doc.data().goal;
          const date = doc.data().date;

          datesCompleted.push({ goal: goal, date: date });
        });

        console.log("here, ", datesCompleted);

        const datesCompletedMap = {};

        datesCompleted.forEach(data => {
          if (data.goal in datesCompletedMap) {
            console.log("yo: ", datesCompletedMap, data.goal);
            datesCompletedMap[data.goal].push(data.date);
          } else {
            datesCompletedMap[data.goal] = [data.date];
          }
        });

        setGoalToDatesCompleted(datesCompletedMap);
      });

    return () => fetchCompletedDays();
  }, []);

  // Pull the goals from state and set the first one as selected.

  // await loadGoals();

  // // Make this call inside of here and save it into local state.
  // await loadCompletedDays(auth.uid);

  // console.log("MOUNT: ", goalToDatesCompleted);

  /**
   * Pull in the existing habits from the database that have the
   * logged in user's uid.
   */
  // async function loadGoals() {
  //   db.collection("goals")
  //     .where("uid", "==", auth.uid)
  //     .get()
  //     .then(snapshot => {
  //       const existingGoals = [];

  //       snapshot.docs.forEach(doc => {
  //         const goal = doc.data().goal;
  //         existingGoals.push(goal);
  //       });

  //       // First render have first goal selected.
  //       setSelected(existingGoals[0]);
  //       setGoals(existingGoals);
  //     });
  // }

  //   async function loadCompletedDays() {
  //     await db
  //       .collection(`daysCompleted-${auth.uid}`)
  //       .get()
  //       .then(snapshot => {
  //         const datesCompleted = [];

  //         snapshot.docs.forEach(doc => {
  //           const goal = doc.data().goal;
  //           const date = doc.data().date;

  //           datesCompleted.push({ goal: goal, date: date });
  //         });

  //         // setGoalToDatesCompleted(datesCompleted);

  //         return datesCompleted;
  //       });
  //   }

  //   loadGoals();
  //   const datesCompleted = loadCompletedDays();

  //   console.log("DATES COMPLETED: ", datesCompleted);
  // }, []);

  // Whenver a goal is added. Add a mappping of that goal to the current month.
  // As the user looks to different months on different goals, that will be saved
  // in state.

  // TODO UPDATE THE goalToMonthMap state whenever the month is changed for
  // a given goal.

  // function initMonthMap() {
  //   let curMap = goalToMonthMap;
  //   const today = new Date();

  //   goals.forEach(goal => {
  //     curMap[goal] = today.getMonth() + 1;
  //   });

  //   setGoalToMonthMap(curMap);
  // }

  // TODO -- AT THE TIME OF LOADING, SHIT IS ASYNC, CANT SORT IT HERE. PUSH IT ALL INTO AN ARRAY OF OBJECTS,
  // THEN SORT IT OUT AFTERWARD.
  async function loadCompletedDays() {
    db.collection(`daysCompleted-${auth.uid}`)
      .get()
      .then(snapshot => {
        const datesCompleted = [];

        snapshot.docs.forEach(doc => {
          const goal = doc.data().goal;
          const date = doc.data().date;

          datesCompleted.push({ goal: goal, date: date });
        });

        setGoalToDatesCompleted(datesCompleted);

        console.log("goalToDatesCompleted: ", datesCompleted);
      });
  }

  // function handleMonthChange(monthNum) {
  //   let monthMapping = goalToMonthMap;
  //   monthMapping[selected] = monthNum;

  //   console.log("monthMapping: ", monthMapping);

  //   return monthMapping;
  // }

  return (
    <OverallContainer>
      <GoalListContainer>
        <Button onClick={logout}>yo yo yo</Button>

        <Input type="text" onChange={e => setNewGoal(e.target.value)} />
        <Button
          onClick={() => {
            if (newGoal.length > 0 && !goals.includes(newGoal)) {
              createGoal({
                uid: auth.uid,
                goal: newGoal
              });
              dispatch({ type: "GOAL_ADDED", newGoal });
              setNewGoal("");
              setGoals([...goals, newGoal]);
            }
          }}
        >
          Add goal
        </Button>

        {goals.map((goal, idx) => {
          return (
            <ListRow
              style={goals[idx + 1] ? null : { borderWidth: "5px" }} // Check if it's the last goal in the list.
              selected={goal === selected}
              onClick={() => {
                setSelected(goal);
                // forceUpdate();
                const selectedDays = GoalsSelectedMap[goal];
                // Not hooked to firebase yet. Just mocking the backend
                dispatch({ type: "SELECTED_DAYS_LOADED", selectedDays });
              }}
            >
              {" "}
              {goal}
            </ListRow>
          );
        })}
      </GoalListContainer>

      {/* TODO -- THIS CONDITION STOPPED GETTING SET TO TRUE */}
      <Calendar
        curGoal={selected}
        completedDays={
          goalToDatesCompleted[selected] ? goalToDatesCompleted[selected] : []
        }
        startingMonth={6}
      />
    </OverallContainer>
  );
}

const Button = styled.button`
  display: inline-block;
  color: #5cc7ff;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #5cc7ff;
  border-radius: 3px;
  display: inline-block;
`;

const GoalListContainer = styled.div`
  flex-basis: "33.3%";
  max-width: "33.3%";
  padding-right: 10em;
  padding-left: 6em;
  padding-top: 6em;
`;

const OverallContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: white;
  background: black;
  border: none;
  border-radius: 3px;
`;

const ListRow = styled.div`
  height: 50px;
  width: 300px;
  border-width: 5px 5px 0px 5px;
  border-color: #ff6030;
  padding-top: 20px;
  border-style: solid;

  background-color: ${props => (props.selected ? "#FFE16D" : "white")};
`;
