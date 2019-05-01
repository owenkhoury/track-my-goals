import { db } from './fire'

export async function createGoal(goal) {
    return db  
        .collection('Goals')
        .add({Goal: 'OWEN GOAL'})
}