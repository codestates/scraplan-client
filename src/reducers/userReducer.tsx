import {
  SIGN_IN,
  SIGN_OUT,
  USER_EDIT_INFO,
  WITHDRAW,
  GET_GOOGLE_TOKEN,
} from "../actions/index";
import { initialState, State } from "./initialState";
import { Action } from "../actions";

const userReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SIGN_IN:
      return Object.assign({}, state, {
        user: action.payload,
      });

    case SIGN_OUT:
      return Object.assign({}, state, {
        user: {
          token: "",
          email: "",
          nickname: "guest",
        },
      });

    case USER_EDIT_INFO:
      return Object.assign({}, state, {
        user: {
          token: action.payload.token,
          email: action.payload.email,
          nickname: action.payload.nickname,
        },
      });

    case WITHDRAW:
      return Object.assign({}, state, {
        user: {
          token: "",
          email: "",
          nickname: "guest",
        },
      });

    case GET_GOOGLE_TOKEN:
      return Object.assign({}, state, {
        googleToken: action.payload.data,
      });

    default:
      return state;
  }
};

export default userReducer;
