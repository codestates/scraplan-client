import React, { useCallback, useState } from "react";
import CurationCard from "./CurationCard";
import "./Curation.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const CurationList = () => {
  const [openList, setOpenList] = useState<boolean>(false);
  const [sortByTime, setSortByTime] = useState<boolean>(false);

  const curationState = useSelector(
    (state: RootState) => state.curationReducer,
  );
  // const { origin, sortByAvgTime } = curationState.curationCards ;
  const { origin, sortByAvgTime } = {
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
  };

  const handleListState = useCallback(() => {
    setOpenList(!openList);
  }, [openList]);
  return (
    <div className="curationlist">
      <div className={`curationlist__wrapper ${openList ? "" : "disappear"}`}>
        <div className="curationlist__content">
          <span className="curationlist__content__title">큐레이션 찾기</span>
          <span className="curationlist__content__desc">
            마음에 드는 큐레이션을 찾고, 일정에 추가해보세요!
          </span>
          <span
            className={`curationlist__content__order-by-new ${
              sortByTime ? "curationlist__content__focused" : ""
            }`}
            onClick={() => setSortByTime(false)}
          >
            최신순
          </span>
          <span
            className={`curationlist__content__order-by-time ${
              sortByTime ? "" : "curationlist__content__focused"
            }`}
            onClick={() => setSortByTime(true)}
          >
            시간순
          </span>
          <ul className="curationlist__content__cards">
            {((sortByTime ? sortByAvgTime : origin) || [""]).map(
              (
                card: {
                  curationCardId: number;
                  theme: number;
                  title: string;
                  detail: string;
                  photo: string;
                  avgTime: number;
                  feedbackCnt: number;
                },
                index: number,
              ) => {
                return <CurationCard props={card} key={index} />;
              },
            )}
          </ul>
        </div>
      </div>
      <div className="curationlist__toggle" onClick={handleListState}>
        <img src="/images/next-pink.png"></img>
      </div>
    </div>
  );
};

export default CurationList;
