import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getPlanCards } from "../../actions";
import Modal from "../UI/Modal";
import SetTheme from "../UI/SetTheme";
import SetTime from "../UI/SetTime";

interface AddPlanProps {
  type: string;
  open: boolean;
  close: () => void;
  LatLng: any;
  setSearchLatLng?: any;
  moveKakaoMap?: any;
  currentDay?: number;
}

// SetTime으로 부터 startTime, endTime 추가로 계산한 기간까지 가져오는 용도
interface GetTimeInfo {
  startTime: string | undefined;
  endTime: string | undefined;
  period: string | undefined;
}

const AddPlan = ({
  type,
  open,
  close,
  LatLng,
  setSearchLatLng,
  moveKakaoMap,
  currentDay,
}: AddPlanProps) => {
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    planReducer: {
      planList: { isValid, isMember, planCards },
    },
  } = state;
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [inputDesc, setInputDesc] = useState<string>("");
  const [keywordList, setKeywordList] = useState<any>([]);

  const refTitle = useRef<HTMLInputElement>(null);
  const refDesc = useRef<HTMLTextAreaElement>(null);
  const refAddress = useRef<HTMLInputElement>(null);

  const [requestTheme, setRequestTheme] = useState<number>(0);
  const [requestTime, setRequestTime] = useState<string>("1:00");
  const [completeSearch, setCompleteSearch] = useState<boolean>(false);
  const [forRequestLatLng, setForRequestLatLng] = useState<number[]>([]);
  const [forRequestAddress, setForRequestAddress] = useState<string>("");

  useEffect(() => {
    if (inputKeyword !== "" && LatLng && !completeSearch) {
      fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${inputKeyword}&y=${LatLng[0]}&x=${LatLng[1]}&sort=distance`,
        {
          method: "GET",
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_RESTAPI_KEY}`,
          },
        },
      )
        .then((res) => res.json())
        .then((body) => {
          let newKeywordList: object[] = [];
          body.documents.map((addr: any) => {
            newKeywordList.push({
              place_name: addr.place_name,
              address_name: addr.address_name,
            });
          });
          setKeywordList(newKeywordList);
          setSearchLatLng([body.documents[0].y, body.documents[0].x]);
        })
        .catch((err) => console.log(err));
    }
  }, [inputKeyword]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleCloseBtn();
    });
  }, [open]);

  // 모달 관리
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleCloseBtn = () => {
    setInputTitle("");
    setInputKeyword("");
    setInputDesc("");
    close();
  };

  // SetTheme로 부터 테마의 인덱스를 얻는 함수
  const handleGetRequestTheme = (themeIndex: number) => {
    setRequestTheme(themeIndex);
  };
  // (Plan 추가만) SetTime로 부터 기간을 얻는 함수
  const handleGetRequestTime = (period: string) => {
    setRequestTime(period);
  };

  // 타이틀 입력 함수
  const handleInputTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitle(e.target.value);
    },
    [inputTitle],
  );
  // (Curation 요청일때만) 추가 설명
  const handleInputDesc = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputDesc(e.target.value);
    },
    [inputDesc],
  );
  // 장소 검색
  const handleInputKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (completeSearch) {
        setCompleteSearch(false);
      }
      setInputKeyword(e.target?.value);
    },
    [inputKeyword],
  );

  const handleClickKeywordList = (name: string, address: string) => {
    setCompleteSearch(true);
    setInputKeyword(name);
    setForRequestAddress(address);
    setKeywordList([]);
    fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${address}&y=${LatLng[0]}&x=${LatLng[1]}&sort=distance`,
      {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_RESTAPI_KEY}`,
        },
      },
    )
      .then((res) => res.json())
      .then((body) => {
        setSearchLatLng([body.documents[0].y, body.documents[0].x]);
        moveKakaoMap(body.documents[0].y, body.documents[0].x);
        setForRequestLatLng([body.documents[0].y, body.documents[0].x]);
      })
      .catch((err) => console.log(err));
  };
  // 제출 버튼
  const handleSubmitBtn = () => {
    // 1. plan 추가일 경우
    // 2. curation 요청일 경우
    if (inputTitle === "") {
      refTitle.current?.focus();
      return;
    }
    if (inputKeyword === "") {
      refAddress.current?.focus();
      return;
    }
    if (type === "addPlan" && currentDay) {
      let max = planCards.reduce(
        (plan: any, cur: any) => {
          return Number(cur.day) === Number(currentDay) &&
            Number(cur.endTime.split(":")[0]) * 60 +
              Number(cur.endTime.split(":")[1]) >
              Number(plan.endTime.split(":")[0]) * 60 +
                Number(plan.endTime.split(":")[1])
            ? cur
            : plan;
        },
        { day: currentDay, endTime: "10:00" },
      );

      let endMin =
        (Number(max.endTime.split(":")[1]) +
          Number(requestTime.split(":")[1])) %
        60;

      let endHour =
        Number(max.endTime.split(":")[0]) +
        Number(requestTime.split(":")[0]) +
        Math.floor(
          (Number(max.endTime.split(":")[1]) +
            Number(requestTime.split(":")[1])) /
            60,
        );
      dispatch(
        getPlanCards({
          isValid,
          isMember,
          planCards: planCards.concat({
            day: currentDay,
            startTime: max.endTime,
            endTime: endHour + ":" + endMin,
            comment: inputTitle,
            theme: requestTheme,
          }),
        }),
      );
      handleCloseBtn();
      return;
    }
    // 임시처리 - 지우기
    if (type === "requestCuration" && inputDesc === "") {
      refDesc.current?.focus();
      return;
    }
    if (type === "requestCuration") {
      return fetch(`${process.env.REACT_APP_SERVER_URL}/curation-request`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          requestTitle: inputTitle,
          email,
          coordinates: encodeURIComponent(JSON.stringify(forRequestLatLng)),
          address: forRequestAddress,
          requestComment: inputDesc,
          // 수정
          requestTheme: requestTheme,
        }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.message) {
            handleCloseBtn();
            setModalComment("요청이 정상 처리되었습니다.");
            handleModalOpen();
          } else {
            setModalComment("요청이 실패되었습니다.");
            handleModalOpen();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Modal
        modalType="alertModal"
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
      />
      {open ? (
        // <div className='addPlan'>
        <div
          className={`addPlan ${type === "requestCuration" ? "addDesc" : ""}`}
        >
          <button className="addPlan__cancle-btn" onClick={handleCloseBtn}>
            &times;
          </button>
          <div className="addPlan__wrapper">
            <div className="addPlan__select-box">
              <SetTheme giveThemeIndexToParent={handleGetRequestTheme} />
              {type === "requestCuration" ? (
                <></>
              ) : (
                <SetTime giveTimeToParent={handleGetRequestTime} />
              )}
            </div>
            <input
              type="text"
              placeholder="일정 제목을 입력해주세요."
              className="addPlan__title"
              value={inputTitle}
              onChange={handleInputTitle}
              ref={refTitle}
            ></input>
            <div className="addPlan__address">
              <img src="/images/placeholder.png" />
              <input
                type="text"
                placeholder="지역 검색"
                value={inputKeyword}
                onChange={handleInputKeyword}
                ref={refAddress}
              ></input>
              {keywordList.length !== 0 ? (
                <ul>
                  {keywordList.map((addr: any, idx: number) => {
                    return (
                      <li
                        key={idx}
                        onClick={() =>
                          handleClickKeywordList(
                            addr.place_name,
                            addr.address_name,
                          )
                        }
                      >
                        <div className="place_name">{`👉🏻  ${addr.place_name}`}</div>
                        <div className="address_name">{addr.address_name}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <></>
              )}
            </div>
            {type === "requestCuration" ? (
              <div className="addPlan__description">
                <img src="/images/like.png" />
                <textarea
                  onChange={handleInputDesc}
                  value={inputDesc}
                  placeholder="추천하시는 이유가 있나요~?"
                  ref={refDesc}
                ></textarea>
              </div>
            ) : (
              <></>
            )}
            <button className="addPlan__submit-btn" onClick={handleSubmitBtn}>
              {type === "requestCuration" ? "신청하기" : "추가하기"}
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddPlan;
