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
  planCards: {
    isValid: false,
    isMember: false,
    planCards: [],
  },
  // Curation
  curations: {},
  curationCards: {
    origin: [
      {
        curationCardId: 0,
        theme: 1,
        title: "코딩하기 좋은 카페",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1.45,
        feedbackCnt: 243,
      },
      {
        curationCardId: 1,
        theme: 4,
        title: "카페 명소",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1,
        feedbackCnt: 10,
      },
      {
        curationCardId: 2,
        theme: 5,
        title: "마장동 축산물 시장",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1,
        feedbackCnt: 10,
      },
    ],
    sortByAvgTime: [
      {
        curationCardId: 1,
        theme: 4,
        title: "카페 명소",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1,
        feedbackCnt: 10,
      },
      {
        curationCardId: 2,
        theme: 5,
        title: "마장동 축산물 시장",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1,
        feedbackCnt: 10,
      },
      {
        curationCardId: 0,
        theme: 1,
        title: "코딩하기 좋은 카페",
        detail: "이 카페는 ~~~~",
        photo: "https://~~~",
        avgTime: 1.45,
        feedbackCnt: 243,
      },
    ],
  },
  curationRequests: {},
  curationRequestsResolved: {},
  themeList: ["🍽", "☕️", "🎬", "🚴🏻", "🏔", "🤔"],
  notifications: [],
};
