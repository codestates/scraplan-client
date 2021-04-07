export type State = {
  user: {
    token: string;
    email: string;
    nickname: string;
  };
  googleToken: string;
  plans: any;
  planCards: any;
  curations: any;
  curationCards: any;
  curationRequests: any;
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
  planCards: {},
  // Curation
  curations: {},
  curationCards: {},
  curationRequests: {},
};
