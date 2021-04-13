import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import userReducer from "./userReducer";
import planReducer from "./planReducer";
import curationReducer from "./curationReducer";
import notificationReducer from "./notificationReducer";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: [
    "userReducer",
    "planReducer",
    "curationReducer",
    "notificationReducer",
  ],
};

const rootReducer = combineReducers({
  userReducer,
  planReducer,
  curationReducer,
  notificationReducer,
});

export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
