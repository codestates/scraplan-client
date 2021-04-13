import { ENQUEUE_NOTIFICATION, DEQUEUE_NOTIFICATION } from "../actions/index";
import { initialState, State } from "./initialState";
import { Action } from "../actions";

const notificationReducer = (
  state: State = initialState,
  action: Action,
): State => {
  switch (action.type) {
    case ENQUEUE_NOTIFICATION:
      return Object.assign({}, state, {
        notifications: [...state.notifications, action.payload],
      });
    case DEQUEUE_NOTIFICATION:
      return Object.assign({}, state, {
        notifications: state.notifications.slice(1),
      });
    default:
      return state;
  }
};

export default notificationReducer;
