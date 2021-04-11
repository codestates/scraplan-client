import React, { useCallback, useState } from "react";
import CurationCard from "./CurationCard";
import "./Curation.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const CurationList = () => {
  const [openList, setOpenList] = useState<boolean>(false);
  const [sortByTime, setSortByTime] = useState<boolean>(false);
  // curationcards는 리액트로
  const curationState = useSelector(
    (state: RootState) => state.curationReducer,
  );
  const { origin, sortByAvgTime } = curationState.curationCards;

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
            {(sortByTime ? sortByAvgTime : origin).map(
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
