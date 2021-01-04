import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middlware = [thunk];

const store = createStore(
    rootReducer, initialState, process.env.NODE_ENV !== 'development' ? applyMiddleware(...middlware) : composeWithDevTools(applyMiddleware(...middlware))
);

export default store;