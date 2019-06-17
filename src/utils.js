import { db } from "./fire";
import { auth } from "firebase";

export async function deleteGoal(uid, goal) {
  let existingGoal = db.collection("goals");
  existingGoal = existingGoal.where("goal", "==", goal);
  existingGoal = existingGoal.where("uid", "==", uid);

  existingGoal.get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      doc.ref.delete();
    });
  });
}

export async function createGoal(goalData) {
  return db.collection("goals").add({
    uid: goalData.uid,
    goal: goalData.goal,
    datesCompleted: []
  });
}

export async function addCompletedDay(uid, goal, date) {
  return db.collection(`daysCompleted-${uid}`).add({
    goal: goal,
    date: date
  });
}

export async function removeCompletedDay(uid, goal, date) {
  let dayCompleted = db.collection(`daysCompleted-${uid}`);
  dayCompleted = dayCompleted.where("goal", "==", goal);
  dayCompleted = dayCompleted.where("date", "==", date);

  dayCompleted.get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      doc.ref.delete();
    });
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
