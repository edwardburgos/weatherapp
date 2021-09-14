import { applyMiddleware, compose, createStore } from 'redux'
//import thunkMiddleware from 'redux-thunk'
import thunk from 'redux-thunk';
import reducer from './reducers'

// export default function configureStore(prealoadedState) {
//   const middlewares = [thunkMiddleware]
//   const middlewareEnhancer = applyMiddleware(...middlewares)

//   const enhancers = [middlewareEnhancer]
//   const composedEnhancers = compose(...enhancers)

// export const store = createStore(
//     reducer,  
//     prealoadedState,
//     composedEnhancers)


 
// Note: this API requires redux@>=3.1.0
export const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

// import { combineReducers, createStore } from 'redux';
// import { demoReducer } from './demo/reducer';
// import { IDemoState } from './demo/types';

// export interface IRootState {
//     demo: IDemoState
// }

// const store = createStore<IRootState, any, any, any>(
//     combineReducers({
//         demo: demoReducer
//     }));

// export default store;