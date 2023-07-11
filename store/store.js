import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThink from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import axios from "axios";

const userInitialState = {};
const SIGN_OUT = "SIGN_OUT";

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case SIGN_OUT: {
      return {};
    }
    default:
      return state;
  }
}

const allReducers = combineReducers({
  user: userReducer,
});

// Log out
export function signOut() {
  return async (dispatch) => {
    try {
      const res = await axios.post("/logout");
      if (res.status === 200) {
        dispatch({
          type: SIGN_OUT,
        });
      } else {
        console.log("sign out failed", es);
      }
    } catch (err) {}
  };
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThink))
  );

  return store;
}
