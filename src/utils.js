import { db } from "./fire";
import { GoalsSelectedMap } from "./MockDB";
import { useAppState } from "./app-state";

// export async function loadGoals() {
//   let goals = [];
//   db.collection("Goals")
//     .get()
//     .then(snapshot => {
//       snapshot.docs.forEach(doc => {
//         goals.push(doc.data().goal);
//       });
//     });
//   return goals;
// }

export async function createGoal(goal) {
  return db.collection("Goals").add({ goal: goal });
}

export async function retrieveSelectedDays(goal) {
  // console.log(GoalsSelectedMap[goal], goal);
  // const selectedDays = GoalsSelectedMap[goal];
  // // Not hooked to firebase yet. Just mocking the backend
  // dispatch({ type: "SELECTED_DAYS_LOADED", selectedDays });
}
