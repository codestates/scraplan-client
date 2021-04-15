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
    planCards: [
      {
        day: 1,
        startTime: "10:00",
        endTime: "11:00",
        comment: "분위기 있는 카페",
        theme: 2,
        coordinates: [37.55, 126.92],
        address: "장소1",
      },
      {
        day: 1,
        startTime: "11:00",
        endTime: "12:00",
        comment: "분위기 없는 카페",
        theme: 2,
        coordinates: [37.53, 126.89],
        address: "장소2",
      },
      {
        day: 2,
        startTime: "12:00",
        endTime: "13:00",
        comment: "분위기 있는 밥집",
        theme: 2,
        coordinates: [37.51, 126.87],
        address: "서울시 강서구 ...",
      },
      {
        day: 3,
        startTime: "14:00",
        endTime: "16:00",
        comment: "비밀의 장소",
        theme: 2,
        coordinates: [37.49, 126.85],
        address: "서울시 강서구 ...",
      },
    ],
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
