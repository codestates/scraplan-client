import { GET_PLANS, GET_PLAN_CARDS } from '../actions/index';
import { initialState, State } from './initialState';
import { Action } from '../actions/index';

const planReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case GET_PLANS:
      return Object.assign({}, state, {
        plans: action.payload.data,
      });

    case GET_PLAN_CARDS:
      return Object.assign({}, state, {
        planCards: action.payload.data,
      });
    default:
      return state;
  }
};

export default planReducer;
