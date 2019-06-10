import { db } from "./fire";
import { auth } from "firebase";
import { domainToASCII } from "url";

export async function loadGoals() {
  let goals = [];
  db.collection("Goals")
    .get()
    .then(unweirdify);
  return goals;
}

export async function createGoal(goalData) {
  return db.collection("goals").add({
    uid: goalData.uid,
    goal: goalData.goal,
    datesCompleted: ["06-09-2019"]
  });
}

export async function retrieveSelectedDays(goal) {
  // console.log(GoalsSelectedMap[goal], goal);
  // const selectedDays = GoalsSelectedMap[goal];
  // // Not hooked to firebase yet. Just mocking the backend
  // dispatch({ type: "SELECTED_DAYS_LOADED", selectedDays });
}

export async function signup({ email, password }) {
  try {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    await db.doc(`users/${user.uid}`).set({
      uid: user.uid
    });
  } catch (e) {
    throw e;
  }
}

export function login(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  return auth().signOut();
}

export function onAuthStateChanged(callback) {
  auth().onAuthStateChanged(callback);
}

const unweirdify = snapshot => {
  const docs = [];
  snapshot.forEach(doc => {
    docs.push({
      ...doc.data(),
      id: doc.id
    });
  });

  return docs;
};
