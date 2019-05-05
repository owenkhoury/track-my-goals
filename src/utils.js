import { db } from './fire'

export function fetchGoals() {
    let goals = []
    db.collection('Goals')
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                goals.push(doc.data().Goal);
            })
        })
    return goals;
}

export async function createGoal(goal) {
    return db  
        .collection('Goals')
        .add({Goal: goal })
}

