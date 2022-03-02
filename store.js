const {
  applyMiddleware,
  createStore,
  // dummyEnhancer,
} = require('./CreateStore');

const counterInitialState = 0;
const usersInitialState = [
  {
    id: 1,
    name: 'Qwe',
    age: 34,
  },
  {
    id: 2,
    name: 'Yyy',
    age: 22,
  },
];

const usersCountriesInitialState = {
  1: 'A',
};

function counterReducer(state = counterInitialState, action) {
  if (action.type === 'INCREMENT_COUNTER') {
    return state + (action.number ?? 1);
  }
  return state;
}

function usersReducer(state = usersInitialState, action) {
  if (action.type === 'ADD_USER') {
    return [...state, action.user];
  }
  if (action.type === 'RENAME_USER') {
    const { id, name } = action.user;
    return state.map((person) =>
      person.id === id ? { ...person, name } : person
    );
  }
  if (action.type === 'REMOVE_USER') {
    return state.filter((person) => person.id !== action.id);
  }
  if (action.type === 'CLEAR_USERS') {
    return [];
  }
  if (action.type === 'ADD_YEAR') {
    return state.map((user) => ({ ...user, age: user.age + 1 }));
  }

  return state;
}

function usersCountriesReducer(state = usersCountriesInitialState, action) {
  if (action.type === 'SET_USER_COUNTRY') {
    const { id, country } = action;
    return { ...state, [id]: country };
  }
  if (action.type === 'REMOVE_COUNTRY') {
    return Object.fromEntries(
      Object.entries(state).filter(([k]) => k !== action.id.toString())
    );
  }
  return state;
}

const reducer = combineReducersClone({
  counter: counterReducer,
  users: usersReducer,
  usersCountries: usersCountriesReducer,
});

const thunk = (storeApi) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(storeApi.dispatch, storeApi.getState);
  }
  return next(action);
};

const store = createStore(reducer, applyMiddleware(thunk));

module.exports = store;

function combineReducersClone(reducers) {
  return function (state = {}, action) {
    const stateClone = {};
    for (const key in reducers) {
      stateClone[key] = reducers[key](state[key], action);
    }
    return stateClone;
  };
}

store.subscribe(() => {
  console.log('>>>> 1');
});

store.subscribe(() => {
  console.log('>>>> 2');
});

store.dispatch({
  type: 'ADD_USER',
  user: {
    id: 5,
    name: 'Uyt',
    age: 111,
  },
});

store.dispatch({
  type: 'INCREMENT_COUNTER',
});

store.dispatch({
  type: 'RENAME_USER',
  user: {
    id: 5,
    name: 'Sam',
  },
});

store.dispatch({
  type: 'REMOVE_USER',
  id: 5,
});

store.dispatch({
  type: 'CLEAR_USERS',
});

store.dispatch({
  type: 'SET_USER_COUNTRY',
  id: 2,
  country: 'B',
});

store.dispatch({
  type: 'REMOVE_COUNTRY',
  id: 2,
});

store.dispatch({
  type: 'ADD_USER',
  user: {
    id: 5,
    name: 'Uyt',
    age: 111,
  },
});

store.dispatch({
  type: 'ADD_USER',
  user: {
    id: 4,
    name: 'Uytt',
    age: 100,
  },
});

store.dispatch({
  type: 'ADD_YEAR',
});
