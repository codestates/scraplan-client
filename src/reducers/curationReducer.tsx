import {
  GET_CURATIONS,
  GET_CURATION_CARDS,
  GET_CURATION_REQUESTS,
  GET_CURATION_REQUESTS_RESOLVED,
} from "../actions/index";
import { initialState, State } from "./initialState";
import { Action } from "../actions/index";

const curationReducer = (
  state: State = initialState,
  action: Action,
): State => {
  switch (action.type) {
    case GET_CURATIONS:
      return Object.assign({}, state, {
        curations: action.payload.data,
      });
    case GET_CURATION_CARDS:
      return Object.assign({}, state, {
        curationCards: {
          origin: action.payload.data,
          sortByAvgTime: action.payload.data.sort(
            (a: { avgTime: number }, b: { avgTime: number }) => {
              if (a.avgTime > b.avgTime) {
                return 1;
              }
              if (a.avgTime < b.avgTime) {
                return -1;
              }
              // a must be equal to b
              return 0;
            },
          ),
        },
      });
    case GET_CURATION_REQUESTS:
      return Object.assign({}, state, {
        curationRequests: action.payload.data,
      });
    case GET_CURATION_REQUESTS_RESOLVED:
      return Object.assign({}, state, {
        curationRequestsResolved: action.payload.data,
      });
    default:
      return state;
  }
};

export default curationReducer;
