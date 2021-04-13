import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import Modal from "../UI/Modal";
import SetTheme from "../UI/SetTheme";
import SetTime from "../UI/SetTime";

interface AddPlanProps {
  type: string;
  open: boolean;
  close: () => void;
}

// SetTime으로 부터 startTime, endTime 추가로 계산한 기간까지 가져오는 용도
interface GetTimeInfo {
  startTime: string | undefined;
  endTime: string | undefined;
  period: string | undefined;
}

const AddPlan = ({ type, open, close }: AddPlanProps) => {
  const userState = useSelector((state: RootState) => state.userReducer);
  const {
    user: { token, email, nickname },
  } = userState;
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");
  const [inputTitlePlan, setInputTitlePlan] = useState<string>("");
  const [inputTitleCuration, setInputTitleCuration] = useState<string>("");
  const [inputDescCuration, setInputDescCuration] = useState<string>("");
  const [inputKeywordPlan, setInputKeywordPlan] = useState<string>("");
  const [inputKeywordCuration, setInputKeywordCuration] = useState<string>("");
  const refTitlePlan = useRef<HTMLInputElement>(null);
  const refTitleCuration = useRef<HTMLInputElement>(null);
  const refDescCuration = useRef<HTMLTextAreaElement>(null);
  const [requestThemePlan, setRequestThemePlan] = useState<number>(0);
  const [requestThemeCuration, setRequestThemeCuration] = useState<number>(0);
  const [requestTimePlan, setRequestTimePlan] = useState<string>("0:15");

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  // Plan 추가 - SetTheme로 부터 테마의 인덱스를 얻는 함수
  const handleGetRequestThemePlan = (themeIndex: number) => {
    setRequestThemePlan(themeIndex);
  };
  // Curation 요청 - SetTheme로 부터 테마의 인덱스를 얻는 함수
  const handleGetRequestThemeCuration = (themeIndex: number) => {
    setRequestThemeCuration(themeIndex);
  };
  // Plan 추가 - SetTime로 부터 기간을 얻는 함수
  const handleGetRequestTimePlan = (period: string) => {
    setRequestTimePlan(period);
  };

  const handleInputTitlePlan = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitlePlan(e.target.value);
    },
    [inputTitlePlan],
  );

  const handleInputTitleCuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitleCuration(e.target.value);
    },
    [inputTitleCuration],
  );

  const handleInputDescCuration = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputDescCuration(e.target.value);
    },
    [inputDescCuration],
  );

  const handleInputKeywordPlan = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputKeywordPlan(e.target?.value);
    },
    [inputKeywordPlan],
  );

  const handleInputKeywordCuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputKeywordCuration(e.target?.value);
    },
    [inputKeywordCuration],
  );

  // Plan 추가하기 버튼
  const handleAddPlanSubmitBtn = useCallback(() => {
    if (inputTitlePlan === "") {
      refTitlePlan.current?.focus();
    }
  }, [inputTitlePlan]);

  // 큐레이션 요청 버튼
  const handleRequestCurationSubmitBtn = useCallback(() => {
    if (inputTitleCuration === "") {
      refTitleCuration.current?.focus();
      return;
    }
    if (inputDescCuration === "") {
      refDescCuration.current?.focus();
      return;
    }
    return fetch(`${process.env.REACT_APP_SERVER_URL}/curation-request`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        requestTitle: inputTitleCuration,
        email,
        // 수정
        coordinates: [],
        // 수정
        address: "",
        requestComment: inputDescCuration,
        // 수정
        requestTheme: requestThemeCuration,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message) {
          setInputTitleCuration("");
          setInputDescCuration("");
          close();
          setModalComment("요청이 정상 처리되었습니다.");
          handleModalOpen();
        } else {
          setInputTitleCuration("");
          setInputDescCuration("");
          close();
          setModalComment("요청이 실패되었습니다.");
          handleModalOpen();
        }
      })
      .catch((err) => console.log(err));
  }, [inputTitleCuration, inputDescCuration]);

  return (
    <>
      <Modal
        modalType="alertModal"
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
      />
      {open && type === "addPlan" ? (
        <div className="addPlan">
          <button className="addPlan__cancle-btn" onClick={close}>
            &times;
          </button>
          <div className="addPlan__wrapper">
            <div className="addPlan__select-box">
              <SetTheme giveThemeIndexToParent={handleGetRequestThemePlan} />
              <SetTime giveTimeToParent={handleGetRequestTimePlan} />
            </div>
            <input
              type="text"
              placeholder="일정 제목을 입력해주세요."
              className="addPlan__title"
              onChange={handleInputTitlePlan}
              ref={refTitlePlan}
            ></input>
            <div className="addPlan__address">
              <img src="/images/placeholder.png" />
              <input
                type="text"
                placeholder="지역 검색"
                value={inputKeywordPlan}
                onChange={handleInputKeywordPlan}
              ></input>
            </div>
            <button
              className="addPlan__submit-btn"
              onClick={handleAddPlanSubmitBtn}
            >
              추가하기
            </button>
          </div>
        </div>
      ) : open && type === "requestCuration" ? (
        <>
          <div className="addPlan-curationReq">
            <button className="addPlan-curationReq__cancle-btn" onClick={close}>
              &times;
            </button>
            <div className="addPlan-curationReq__wrapper">
              <div className="addPlan-curationReq__select-box">
                <SetTheme
                  giveThemeIndexToParent={handleGetRequestThemeCuration}
                />
              </div>
              <input
                type="text"
                placeholder="일정 제목을 입력해주세요."
                className="addPlan-curationReq__title"
                onChange={handleInputTitleCuration}
                ref={refTitleCuration}
              ></input>
              <div className="addPlan-curationReq__address">
                <img src="/images/placeholder.png" />
                <input
                  type="text"
                  placeholder="지역 검색"
                  value={inputKeywordCuration}
                  onChange={handleInputKeywordCuration}
                ></input>
              </div>
              <div className="addPlan-curationReq__description">
                <img src="/images/like.png" />
                {/* <input
                  type="text"
                  onChange={handleInputDescCuration}
                  value={inputDescCuration}
                  placeholder="추천하시는 이유가 있나요~?"
                  ref={refDescCuration}
                ></input> */}
                <textarea
                  onChange={handleInputDescCuration}
                  value={inputDescCuration}
                  placeholder="추천하시는 이유가 있나요~?"
                  ref={refDescCuration}
                ></textarea>
              </div>
              <button
                className="addPlan-curationReq__submit-btn"
                onClick={handleRequestCurationSubmitBtn}
              >
                신청하기
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddPlan;
