import { db } from "./fire";
import { auth } from "firebase";

export async function removeDaysCompleted(uid, goal) {
  // let daysCompletedCollection = db.collection("daysCompleted-" + uid);

  let daysCompletedCollection = db
    .collection("completed")
    .doc(uid)
    .collection("daysCompleted");

  let daysToDelete = daysCompletedCollection.where("goal", "==", goal);

  daysToDelete.get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      doc.ref.delete();
    });
  });
}

export async function deleteGoal(uid, goal) {
  // let existingGoal = db.collection(`goals-${uid}`);
  let existingGoal = db
    .collection(`goals`)
    .doc(uid)
    .collection("userGoals");

  existingGoal = existingGoal.where("goal", "==", goal);
  existingGoal = existingGoal.where("uid", "==", uid);

  existingGoal.get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      doc.ref.delete();
    });
  });
}

// TODO -- ADD A HEX COLOR FIELD TO THE GOAL COLLECTION. ALSO PUT THE AUTH UID ON THE COLLECTION NAME
export async function createGoal(uid, goal, color) {
  console.log("createGoal:", color);

  return db
    .collection(`goals`)
    .doc(uid)
    .collection("userGoals")
    .add({
      uid: uid,
      goal: goal,
      color: color,
      created: +new Date() // Timestamp of creation
    });

  // return db.collection(`goals-${uid}`).add({
  //   uid: uid,
  //   goal: goal,
  //   color: color,
  //   created: +new Date() // Timestamp of creation
  // });
}

// TODO -- UPDATE HOW I STORE AND GET COMPLETED DAYS.

export async function addCompletedDay(uid, goal, date) {
  console.log("addCompletedDay", date);

  return db
    .collection("completed")
    .doc(uid)
    .collection("daysCompleted")
    .add({
      goal: goal,
      date: date
    });

  // return db.collection(`daysCompleted-${uid}`).add({
  //   goal: goal,
  //   date: date
  // });
}

export async function removeCompletedDay(uid, goal, date) {
  // let dayCompleted = db.collection(`daysCompleted-${uid}`);

  let daysCompleted = db
    .collection("completed")
    .doc(uid)
    .collection("daysCompleted");

  daysCompleted = daysCompleted.where("goal", "==", goal);
  daysCompleted = daysCompleted.where("date", "==", date);

  daysCompleted.get().then(snapshot => {
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
