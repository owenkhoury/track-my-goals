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

    // TODO -- SEE IF THESE ARE BEING USED AT ALL.
    // case "GOALS_LOADED": {
    //   console.log("LOADING GOALS: ", action.goals, action.goals[0]);
    //   return { ...state };
    // }
    // case "GOAL_ADDED": {
    //   // IDK IF THIS IS RIGHT. LET'S SEE
    //   return { ...state, goals: [...state.goals, action.newGoal] };
    // }
    // case "SELECTED_DAYS_LOADED": {
    //   return { ...state, selectedDays: action.selectedDays };
    // }
    // case "DAY_SELECTED": {
    //   // HAVEN'T TESTED THIS LOGIC. PROBABLY NEEDS WORK.
    //   const updatedDays = state.selectedDays;

    //   // Make this a set instead of a list. Don't want duplicate days.
    //   updatedDays[action.goal] = [
    //     ...updatedDays[action.goal],
    //     action.selectedDay
    //   ];
    //   return { ...state, selectedDays: updatedDays };
    // }

    default:
      return state;
  }
};

export { initialState };
export default appStateReducer;
