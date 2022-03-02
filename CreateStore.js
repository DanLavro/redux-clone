export function createStore(reducer, enhancer) {
  if (enhancer !== undefined) {
    return enhancer(createStore)(reducer);
  }

  let state = reducer(undefined, { type: 'qwerty' });
  const subscribers = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    subscribers.forEach((func) => func());
  }

  function subscribe(func) {
    subscribers.push(func);
    return () => {
      const index = subscribers.indexOf(func);
      subscribers.splice(index, 1);
    };
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export function dummyEnhancer(createStore) {
  return function (reducer) {
    const patchedStore = createStore(reducer);
    const { dispatch } = patchedStore;
    patchedStore.dispatch = (action) => {
      console.log('----', action);
      return dispatch(action);
    };
    return patchedStore;
  };
}

export function applyMiddleware(middleware) {
  return function dummyEnhancer(createStore) {
    return function (reducer) {
      const patchedStore = createStore(reducer);
      const { dispatch, getState } = patchedStore;
      const storeApi = { dispatch, getState };
      patchedStore.dispatch = (action) => {
        return middleware[0](storeApi)(dispatch)(action);
      };
      return patchedStore;
    };
  };
}
