import { retrieveSelectedDays } from "./utils";

const initialState = {
  authAttempted: false,
  auth: null,
  user: null,
  goals: ["Workout", "Meditate", "Eat Healthy"],
  selectedGoal: 0,

  // This is the new state I'm adding so that the calendar can dynamically load
  // the selected days for each component

  // Should probably just load this once on the first page load. And store it
  // all in local memory.

  // MAKE THIS A MAP OF GOALS TO DAYS SELECTED;
  selectedDays: {
    workout: []
  }
};

const appStateReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_CHANGE": {
      return { ...state, auth: action.auth, authAttempted: true };
    }
    case "LOAD_USER": {
      return { ...state, user: action.user };
    }

    default:
      return state;
  }
};

export { initialState };
export default appStateReducer;
