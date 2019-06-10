import { useEffect } from "react";
import { onAuthStateChanged } from "./utils";
import { useAppState } from "./app-state";

export default function useAuth() {
  const [{ authAttempted, auth }, dispatch] = useAppState();

  useEffect(() => {
    if (!authAttempted) {
      return onAuthStateChanged(auth => {
        if (auth) {
          const { uid } = auth;
          dispatch({
            type: "AUTH_CHANGE",
            auth: { uid }
          });
        } else {
          dispatch({ type: "AUTH_CHANGE", auth: null });
        }
      });
    }
  }, [authAttempted, dispatch]);

  return { authAttempted, auth };
}
