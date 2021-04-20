export type State = {
  user: {
    token: string;
    email: string;
    nickname: string;
  };
  googleToken: string;
  plans: any;
  planList: {
    isValid: boolean;
    isMember: boolean;
    planCards: any;
  };
  planCardsByDay: any;
  curations: any;
  curationCards: any;
  curationRequests: any;
  curationRequestsResolved: any;
  themeList: string[];
  notifications: string[];
};

export const initialState: State = {
  // User
  user: {
    token: "",
    email: "",
    nickname: "guest",
  },
  googleToken: "",
  // Plan
  plans: {},
  planList: {
    isValid: false,
    isMember: false,
    planCards: [],
  },
  planCardsByDay: [],
  // Curation
  curations: {},
  curationCards: {
    origin: [],
    sortByAvgTime: [],
  },
  curationRequests: {},
  curationRequestsResolved: {},
  themeList: ["🍽", "☕️", "🎬", "🚴🏻", "🏔", "🤔"],
  notifications: [],
};
