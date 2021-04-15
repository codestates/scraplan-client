import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getPlanCards } from "../../actions";
import AddPlan from "./AddPlan";
import PlanTimeline from "./PlanTimeline";
import planReducer from "../../reducers/planReducer";

interface ForAddPlanProps {
  LatLng?: number[];
  setSearchLatLng?: any;
  moveKakaoMap?: any;
  planId: number | string | undefined;
}

const PlanList = ({
  LatLng,
  setSearchLatLng,
  moveKakaoMap,
  planId,
}: ForAddPlanProps) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    planReducer: {
      planCards: { isValid, isMember, planCards },
    },
  } = state;
  const [openList, setOpenList] = useState<boolean>(true);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [isShare, setIsShare] = useState<boolean>(true);
  const [publicToggleChecked, setPublicToggleChecked] = useState<boolean>(
    false,
  );
  const [openAddRequest, setOpenAddRequest] = useState<boolean>(false);
  const [saveBtnClicked, setSaveBtnClicked] = useState<boolean>(false);
  const [dayCount, setDayCount] = useState<number[]>([1, 2, 3, 4]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [showDayList, setShowDayList] = useState<boolean>(false);

  // planpage가 기존에 있던건지, 새로 만든건지 파악 후 렌더링해주는 것
  useEffect(() => {
    // [] 으로 수정 예정
    if (planId) {
      // 수정 예정
      // fetch(`${process.env.REACT_APP_SERVER_URL}/plan-card/${planId}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     credentials: "include",
      //     authorization: `bearer ${token}`,
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((body) => {
      //     dispatch(getPlanCards(body.planCards));
      //   })
      //   .catch((err) => console.error(err));
    } else {
      // planId가 없다 = newpage에 기본값들
      dispatch(
        getPlanCards({
          planCards: [
            {
              day: 1,
              startTime: "10:00",
              endTime: "10:45",
              comment: "분위기 있는 카페1",
              theme: 2,
              coordinates: [10, 10],
              address: "서울시 강서구 ...",
            },
            {
              day: 1,
              startTime: "11:00",
              endTime: "12:45",
              comment: "분위기 있는 카페2",
              theme: 3,
              coordinates: [10, 10],
              address: "서울시 강서구 ...",
            },
          ],
        }),
      );
    }
  }, []);

  const handleOpenAddRequset = useCallback(() => {
    setOpenAddRequest(true);
  }, [openAddRequest]);

  const handleCloseAddRequest = useCallback(() => {
    setOpenAddRequest(false);
  }, [openAddRequest]);

  const handleListState = useCallback(() => {
    setOpenList(!openList);
  }, [openList]);

  const handleInputTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitle(e.target.value);
    },
    [inputTitle],
  );

  const handlePublicToggle = () => {
    setPublicToggleChecked(!publicToggleChecked);
  };

  const handleSavePlanBtn = (plan: any) => {
    dispatch(getPlanCards({ planCards: plan, isMember, isValid }));
    if (!isMember) {
      // isMember === false -> 로그인창
    } else {
      // isMember === true
      if (planId === "newplan") {
        // path가 newplan -> create
        fetch(`${process.env.REACT_APP_SERVER_URL}/plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
            authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            title: inputTitle,
            public: isShare,
            // represnetAddr:
            planCards,
          }),
        })
          .then((res) => res.json())
          .then((body) => {})
          .catch((err) => console.error(err));
      } else {
        // path가 !newplan
        if (isValid) {
          // isValid === true -> update
          fetch(`${process.env.REACT_APP_SERVER_URL}/plan`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              credentials: "include",
              authorization: `bearer ${token}`,
            },
            body: JSON.stringify({
              email,
              planId,
              title: inputTitle,
              public: isShare,
              // represnetAddr:
              planCards,
            }),
          })
            .then((res) => res.json())
            .then((body) => {})
            .catch((err) => console.error(err));
        } else {
          // isValid === false -> create
          fetch(`${process.env.REACT_APP_SERVER_URL}/plan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              credentials: "include",
              authorization: `bearer ${token}`,
            },
            body: JSON.stringify({
              email,
              title: inputTitle,
              public: isShare,
              // represnetAddr:
              planCards,
            }),
          })
            .then((res) => res.json())
            .then((body) => {})
            .catch((err) => console.error(err));
        }
      }
    }
  };

  const handleMovePrevDay = useCallback(() => {
    if (currentDay !== 1) {
      setCurrentDay(currentDay - 1);
    }
  }, [currentDay]);

  const handleMoveNestDay = () => {
    if (currentDay === dayCount.length) {
      alert("추가 할래용?");
      let addDayCount = [...dayCount].concat(dayCount.length + 1);
      setDayCount(addDayCount);
      setCurrentDay(currentDay + 1);
    } else {
      setCurrentDay(currentDay + 1);
    }
  };

  const handleDayList = () => {
    setShowDayList(true);
    alert("리스트 업!");
  };

  const handleSelectDay = (day: number) => {
    // alert("날짜 선택!");
    setCurrentDay(day + 1);
    setShowDayList(false);
  };

  // Day 별로 나누기
  // const filterPlanlistByDay = () => {
  //   console.log("확인하려는 카드들의 현재 상태", planCards);
  //   if (planCards) {
  //   }
  // };
  // filterPlanlistByDay();
  console.log("확인하려는 카드들의 현재 상태", planCards);

  // 지역 정하기 => input list 사용
  return (
    <div className="planlist">
      <AddPlan
        type="addPlan"
        open={openAddRequest}
        close={handleCloseAddRequest}
        LatLng={LatLng}
        setSearchLatLng={setSearchLatLng}
        moveKakaoMap={moveKakaoMap}
      />
      <div className="planlist__toggle" onClick={handleListState}>
        <img src="/images/prev-pink.png"></img>
      </div>
      <div className={`planlist__wrapper ${openList ? "" : "disappear"}`}>
        <div className="planlist__content">
          <div className="planlist__title">
            <input
              className="planlist__title__input"
              value={inputTitle}
              onChange={handleInputTitle}
              placeholder="제목을 입력하세요"
            />
            <p className="planlist__public-toggle__switch-text">
              {publicToggleChecked ? "🔒" : "🔓"}
            </p>
            <div className="planlist__public-toggle">
              <input
                type="checkbox"
                className="planlist__public-toggle__switch-checkbox"
                checked={publicToggleChecked}
                onChange={handlePublicToggle}
                id="switch-input"
              />
              <label
                htmlFor="switch-input"
                className="planlist__public-toggle__switch-label"
              >
                <div
                  className={`planlist__public-toggle__ball ${
                    publicToggleChecked ? "moveToRight" : ""
                  }`}
                ></div>
              </label>
            </div>
          </div>
          <span className="planlist__represent-address">
            {"시 > 군구 > 동"}
          </span>
          <div className="planlist__dailyplan">
            <div className="planlist__dailyplan__top-bar">
              <button
                className="planlist__dailyplan__top-bar__prev"
                onClick={handleMovePrevDay}
              >
                {"<"}
              </button>
              <div
                className="planlist__dailyplan__top-bar__select-day"
                onClick={handleDayList}
              >
                {`Day ${dayCount[currentDay - 1]}`}
              </div>
              {showDayList ? (
                <ul className="daylist">
                  {dayCount.map((day, idx) => {
                    return (
                      <li
                        onClick={() => handleSelectDay(idx)}
                        key={idx}
                      >{`Day ${day}`}</li>
                    );
                  })}
                </ul>
              ) : (
                <></>
              )}
              <button
                className="planlist__dailyplan__top-bar__next"
                onClick={handleMoveNestDay}
              >
                {">"}
              </button>
            </div>
            <div className="planlist__dailyplan__plancards">
              <div className="planlist__dailyplan__plancards__grid">
                {Array(48)
                  .fill(true)
                  .map((grid, idx) => {
                    return (
                      <>
                        <div onClick={handleOpenAddRequset} key={idx}>
                          <span>
                            {`${Math.floor(idx / 2)}:${
                              (idx * 30) % 60 === 0 ? "00" : "30"
                            }`}
                          </span>
                        </div>
                      </>
                    );
                  })}
              </div>
              <PlanTimeline
                saveBtnClicked={saveBtnClicked}
                setSaveBtnClicked={setSaveBtnClicked}
                handleSavePlanBtn={handleSavePlanBtn}
              />
            </div>
          </div>
          <div className="planlist__save">
            <button
              className="planlist__save__button"
              onClick={() => {
                setSaveBtnClicked(true);
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanList;
