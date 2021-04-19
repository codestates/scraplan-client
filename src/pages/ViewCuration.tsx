import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import Feedback from "../components/Curation/Feedback";
import SetTheme from "../components/UI/SetTheme";
import SetTime from "../components/UI/SetTime";

interface ViewCurationProps {
  open: boolean;
  close: () => void;
  curationCard: {
    curationCardId: number;
    theme: number;
    title: string;
    detail: string;
    photo: string;
    avgTime: number;
    feedbackCnt: number;
  };
}

const ViewCuration = (props: ViewCurationProps) => {
  const {
    open,
    close,
    curationCard: {
      curationCardId,
      theme,
      title,
      detail,
      photo,
      avgTime,
      feedbackCnt,
    },
  } = props;
  const userState = useSelector((state: RootState) => state.userReducer);
  const themeList = ["🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"];
  const {
    user: { token, email, nickname },
  } = userState;

  const [inputFeedbackRate, setInputFeedbackRate] = useState<number>(2);
  const [inputFeedbackTimes, setInputFeedbackTimes] = useState<number>(1);
  const [inputFeedbackComment, setInputFeedbackComment] = useState<string>("");

  const [feedbackList, setFeedbackList] = useState([
    {
      curationFeedbackId: 0,
      writer: "tester",
      times: 1.15,
      comment: "편안하고 조용한 곳! 부리또도 맛있어요",
      rate: 1,
    },
    {
      curationFeedbackId: 0,
      writer: "tester",
      times: 3,
      comment: "편안하고 조용한 곳이라 또 가고싶어요",
      rate: 2,
    },
    {
      curationFeedbackId: 0,
      writer: "tester",
      times: 2,
      comment: "별로!",
      rate: 0,
    },
  ]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/curation-card-feedbacks/${curationCardId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      },
    )
      .then((res) => res.json())
      .then((body) => {
        setFeedbackList(body);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }, [open]);

  const handleChangeFeedbackComment = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputFeedbackComment(e.target?.value);
    },
    [inputFeedbackComment],
  );

  const handleCreateCurationFeedback = () => {
    console.log(
      JSON.stringify({
        email,
        curationCardId,
        times: Number(inputFeedbackTimes),
        comment: inputFeedbackComment,
        rate: inputFeedbackRate,
      }),
    );
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-card-feedback`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        email,
        curationCardId,
        times: inputFeedbackTimes,
        comment: inputFeedbackComment,
        rate: inputFeedbackRate,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/curation-card-feedbacks/${curationCardId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              credentials: "include",
            },
          },
        )
          .then((res) => res.json())
          .then((body) => {
            setFeedbackList(body);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleGetRequestTheme = (themeIndex: number) => {
    setInputFeedbackRate(themeIndex);
  };

  const handleGetRequestTime = (period: string) => {
    setInputFeedbackTimes(
      Number(period.split(":")[0]) + Number(period.split(":")[1]) / 60,
    );
  };

  const handleClickCloseBtn = (e: any) => {
    close();
  };

  return (
    <div className={`viewcuration ${open ? "show" : ""}`}>
      {open ? (
        <div>
          <div
            className="viewcuration__outsider"
            onClick={(e) => handleClickCloseBtn(e)}
          ></div>
          <div className="viewcuration__wrapper">
            <div className="viewcuration__wrapper__top-bar">
              <div className="viewcuration__wrapper__top-bar__wrapper">
                <div className="viewcuration__wrapper__top-bar__wrapper__theme">
                  <span>{themeList[theme] || themeList[0]}</span>
                </div>
                <h1>{title || "제목"}</h1>
                <h4>{avgTime || "1"} hour</h4>
              </div>
              <button
                className="viewcuration__close-btn"
                onClick={(e) => handleClickCloseBtn(e)}
              >
                &times;
              </button>
            </div>
            <div className="viewcuration__contents">
              <div className="viewcuration__contents__desc">
                <h2 className="viewcuration__contents__desc__title">
                  상세설명
                </h2>
                <div className="viewcuration__contents__desc__items">
                  <div className="viewcuration__contents__desc__items__item">
                    <img src="/images/pin.png" alt="" />
                    <p>서울시 종로구</p>
                  </div>
                  <div className="viewcuration__contents__desc__items__item">
                    <img src="/images/document.png" alt="" />
                    <span>{detail || "설명"}</span>
                  </div>
                  <div className="viewcuration__contents__desc__photo">
                    <img src={photo} alt="" />
                  </div>
                </div>
              </div>
              <div className="viewcuration__contents__feedback">
                <div className="viewcuration__contents__feedback__top-bar">
                  <p>
                    어떻게 <br />
                    생각하시나요?
                  </p>
                  <div className="viewcuration__contents__feedback__top-bar__form">
                    <SetTheme
                      type="feedback"
                      giveThemeIndexToParent={handleGetRequestTheme}
                    />
                    <SetTime giveTimeToParent={handleGetRequestTime} />
                    <input
                      type="text"
                      placeholder="피드백을 입력해주세요"
                      onChange={handleChangeFeedbackComment}
                    />
                    <button onClick={handleCreateCurationFeedback}>
                      남기기
                    </button>
                  </div>
                </div>
                <div className="viewcuration__contents__feedback__lists">
                  {feedbackList &&
                    feedbackList.map((feedback, idx) => {
                      return <Feedback key={idx} detail={feedback} />;
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ViewCuration;
