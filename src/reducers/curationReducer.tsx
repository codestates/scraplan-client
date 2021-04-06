import {
  GET_CURATIONS,
  GET_CURATION_CARDS,
  GET_CURATION_REQUESTS,
} from "../actions/index";
import { initialState, State } from "./initialState";
import { Action } from "../actions/index";

const curationReducer = (
  state: State = initialState,
  action: Action
): State => {
  switch (action.type) {
    case GET_CURATIONS:
      return Object.assign({}, state, {
        curations: action.payload.data,
      });

    case GET_CURATION_CARDS:
      return Object.assign({}, state, {
        curationCards: action.payload.data,
      });
    case GET_CURATION_REQUESTS:
      return Object.assign({}, state, {
        curationRequests: action.payload.data,
      });
    default:
      return state;
  }
};

export default curationReducer;
