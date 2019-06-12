import { db } from "./fire";
import { auth } from "firebase";

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

export async function addCompletedDay(uid, goal, date) {
  return db.collection(`daysCompleted-${uid}`).add({
    goal: goal,
    date: date
  });
}

export async function loadCompletedDays(uid) {
  // TODO -- Upon initial load, get all of the days that have currently been selected
  // for each goal
  // Return a mapping of each goal to its list of dates completed.
  db.collection(`daysCompleted-${uid}`)
    .get()
    .then(snapshot => {
      const goalToDatesCompleted = {};

      snapshot.docs.forEach(doc => {
        const goal = doc.data().goal;
        const date = doc.data().date;

        if (goal in goalToDatesCompleted) {
          goalToDatesCompleted[goal].push(date);
        } else {
          goalToDatesCompleted[goal] = [date];
        }
      });

      console.log("goalToDatesCompleted: ", goalToDatesCompleted);
    });
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
