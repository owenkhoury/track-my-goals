const initialState = { 
    authAttempted: false, 
    auth: null, 
    user: null, 
    goals: ["Workout", "Meditate", "Eat Healthy"] 
}

const appStateReducer = (state, action) => {
  switch (action.type) {
    case "GOAL_ADDED": {
        console.log('INSIDE REDUCER', action.newGoal, state);
        // IDK IF THIS IS RIGHT. LET'S SEE
      return { ...state, goals: [...state.goals, action.newGoal] }
    }
    default:
      return state
  }
}

export { initialState }
export default appStateReducer