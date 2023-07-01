import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThink from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  count: 0,
};

const ADD = "ADD";

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      return { count: state.count + (action.num || 1) };
    default:
      return state;
  }
}

const allReducers = combineReducers({
  counter: counterReducer,
});

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        counter: initialState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThink))
  );

  return store;
}
