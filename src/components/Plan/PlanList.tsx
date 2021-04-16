import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getPlanCards } from "../../actions";
import AddPlan from "./AddPlan";
import PlanTimeline from "./PlanTimeline";
import planReducer from "../../reducers/planReducer";
import mapdata from "../../data/mapdata.json";

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

  const [inputAddrSi, setInputAddrSi] = useState<string>("선택");
  const [inputAddrGun, setInputAddrGun] = useState<string>("선택");
  const [inputAddrGu, setInputAddrGu] = useState<string>("선택");

  const [toggleSi, setToggleSi] = useState<boolean>(false);
  const [toggleGun, setToggleGun] = useState<boolean>(false);
  const [toggleGu, setToggleGu] = useState<boolean>(false);

  const [addrList, setAddrList] = useState<any>(mapdata || {});
  const [addrListSi, setAddrListSi] = useState<string[] | undefined>();
  const [addrListGun, setAddrListGun] = useState<string[] | undefined>();
  const [addrListGu, setAddrListGu] = useState<string[] | undefined>();
  const [dayCount, setDayCount] = useState<number[]>([1]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [showDayList, setShowDayList] = useState<boolean>(false);
  const [filterByDay, setFilterByDay] = useState<any>([]);
  // filterByDay = [[Day1의 일정], [Day2의 일정], [Day3의 일정], ...]
  // 초기값을 (데이터가 있을 경우) filterByDay.length = 총 Day count => setDayCount

  const refDaySlide = useRef<HTMLUListElement>(null);

  // console.log(planId);
  // console.log("-----------------------", planCards);
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
      //실험용
      dispatch(
        getPlanCards({
          planCards: [
            {
              day: 1,
              startTime: "10:00",
              endTime: "10:15",
              comment: "기존페이지 1-1",
              theme: 1,
              coordinates: [37.55, 126.92],
              address: "장소1",
            },
            {
              day: 1,
              startTime: "10:30",
              endTime: "10:45",
              comment: "기존페이지 1-2",
              theme: 2,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 1,
              startTime: "10:45",
              endTime: "11:00",
              comment: "기존페이지 1-3",
              theme: 3,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 1,
              startTime: "11:00",
              endTime: "11:30",
              comment: "기존페이지 1-4",
              theme: 4,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 2,
              startTime: "10:00",
              endTime: "10:15",
              comment: "기존페이지 2-1",
              theme: 1,
              coordinates: [37.55, 126.92],
              address: "장소1",
            },
            {
              day: 2,
              startTime: "10:30",
              endTime: "10:45",
              comment: "기존페이지 2-2",
              theme: 2,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 2,
              startTime: "10:45",
              endTime: "11:00",
              comment: "기존페이지 2-3",
              theme: 3,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 3,
              startTime: "10:45",
              endTime: "11:30",
              comment: "기존페이지 3-1",
              theme: 2,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
            {
              day: 4,
              startTime: "10:45",
              endTime: "11:30",
              comment: "기존페이지 4-1",
              theme: 2,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
          ],
        }),
      );
    } else {
      // planId가 없다 = newpage에 기본값들
      dispatch(
        getPlanCards({
          planCards: [
            {
              day: 1,
              startTime: "10:00",
              endTime: "10:15",
              comment: "1-1",
              theme: 1,
              coordinates: [37.55, 126.92],
              address: "장소1",
            },
            {
              day: 1,
              startTime: "10:30",
              endTime: "11:00",
              comment: "1-2",
              theme: 2,
              coordinates: [37.53, 126.89],
              address: "장소2",
            },
          ],
        }),
      );
    }
  }, [planId]);

  useEffect(() => {
    const dayfilter = (arr: any) => {
      let result: any = [];
      for (let i = 0; i < arr.length; i++) {
        if (result.length < arr[i].day) {
          result.push([]);
        }
      }
      for (let j = 0; j < arr.length; j++) {
        result[arr[j].day - 1].push(arr[j]);
      }
      return result;
    };

    const makeDayCountArray = (arr: any) => {
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        result.push(i + 1);
      }
      return result;
    };
    // Day별로 분류된 Planlist
    const filter = dayfilter(planCards);
    // dayCount 초기값
    const initialDayCount = makeDayCountArray(filter);

    setFilterByDay(filter);
    setDayCount(initialDayCount);
  }, [planCards]);

  useEffect(() => {
    setAddrList(mapdata);
    setAddrListSi(Object.keys(mapdata));
  }, []);

  useEffect(() => {
    if (inputAddrSi !== "선택" && addrList[inputAddrSi]) {
      setAddrListGun(Object.keys(addrList[inputAddrSi]));
    }
  }, [inputAddrSi]);

  useEffect(() => {
    if (
      inputAddrSi !== "선택" &&
      addrList[inputAddrSi] &&
      inputAddrGun !== "선택" &&
      addrList[inputAddrSi][inputAddrGun] &&
      Object.keys(addrList[inputAddrSi][inputAddrGun]).length !== 0
    ) {
      setAddrListGu(addrList[inputAddrSi][inputAddrGun]);
    }
  }, [inputAddrGun]);

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

  const handleSavePlanBtn = () => {
    let finalPlanlist = filterByDay.flat();
    console.log(finalPlanlist);
    dispatch(getPlanCards({ planCards: finalPlanlist, isMember, isValid }));
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
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            title: inputTitle,
            public: isShare,
            represnetAddr:
              (inputAddrSi === "선택" ? "" : inputAddrSi) +
              " " +
              (inputAddrGun === "선택" ? "" : inputAddrGun) +
              " " +
              (inputAddrGu === "선택" ? "" : inputAddrGu),
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
              authorization: `Bearer ${token}`,
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
              authorization: `Bearer ${token}`,
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

  const handleInputAddrSi = (si: string): void => {
    setToggleSi(false);
    setInputAddrSi(si);
    setInputAddrGun("선택");
    setInputAddrGu("선택");
  };

  const handleInputAddrGun = (gun: string): void => {
    setToggleGun(false);
    setInputAddrGun(gun);
    setInputAddrGu("선택");
  };

  const handleInputAddrGu = (gu: string): void => {
    setToggleGu(false);
    setInputAddrGu(gu);
  };

  const handleAddrReset = (): void => {
    setInputAddrSi("선택");
    setInputAddrGun("선택");
    setInputAddrGu("선택");
  };
  useEffect(() => {
    refDaySlide.current?.style.setProperty(
      "transition",
      "all 1s ease-in-out",
      "important",
    );
    refDaySlide.current?.style.setProperty(
      "transform",
      `translateX(-${currentDay - 1}00%)`,
      "important",
    );
    console.log("현재 날짜", currentDay);
    console.log("이동중");
  }, [currentDay]);

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
      setFilterByDay([...filterByDay].concat([[]]));
      setCurrentDay(currentDay + 1);
    } else {
      setCurrentDay(currentDay + 1);
    }
  };

  // day는 그대로 입력하면 됨
  // ex) day 1에 그대로 1 기입 -> filterByDay[0] = Day1의 리스트들
  const handleShowPlanlistThatDay = (day: number) => {
    console.log("어떻게 나오나?", filterByDay[day - 1]);
  };

  const handleDayList = () => {
    setShowDayList(true);
    handleShowPlanlistThatDay(1);
  };

  const handleSelectDay = (day: number) => {
    setCurrentDay(day + 1);
    handleShowPlanlistThatDay(day + 1);
    setShowDayList(false);
  };

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
        currentDay={currentDay}
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
            <div className="planlist__contents__search-bar-address">
              <p>대표지역</p>
              <div className="planlist__contents__search-bar-address-all">
                <span className="planlist__contents__search-bar-address-si">
                  <p onClick={() => setToggleSi(!toggleSi)}>{inputAddrSi}</p>
                  {toggleSi ? (
                    <ul>
                      {addrListSi &&
                        addrListSi.map((si, idx) => {
                          return (
                            <li
                              key={idx}
                              value={si}
                              onClick={() => handleInputAddrSi(si)}
                            >
                              {si}
                            </li>
                          );
                        })}
                    </ul>
                  ) : (
                    <></>
                  )}
                </span>
                {inputAddrSi === "선택" ? (
                  <></>
                ) : (
                  <>
                    <h6>{">"}</h6>
                    <span className="planlist__contents__search-bar-address-gun">
                      <span onClick={() => setToggleGun(!toggleGun)}>
                        {inputAddrGun}
                      </span>
                      {toggleGun ? (
                        <ul>
                          {addrListGun &&
                            addrListGun.map((gun, idx) => {
                              return (
                                <li
                                  key={idx}
                                  value={gun}
                                  onClick={() => handleInputAddrGun(gun)}
                                >
                                  {gun}
                                </li>
                              );
                            })}
                        </ul>
                      ) : (
                        <></>
                      )}
                    </span>
                  </>
                )}

                {inputAddrGun === "선택" ? (
                  <></>
                ) : (
                  <>
                    <h6>{">"}</h6>
                    <span
                      className={`planlist__contents__search-bar-address-gu`}
                    >
                      <span onClick={() => setToggleGu(!toggleGu)}>
                        {inputAddrGu}
                      </span>
                      {toggleGu ? (
                        <ul>
                          {addrListGu &&
                            addrListGu.map((gu, idx) => {
                              return (
                                <li
                                  key={idx}
                                  value={gu}
                                  onClick={() => handleInputAddrGu(gu)}
                                >
                                  {gu}
                                </li>
                              );
                            })}
                        </ul>
                      ) : (
                        <></>
                      )}
                    </span>
                  </>
                )}
                {/* <button
                  className="planlist__contents__search-bar-address__reset-btn"
                  onClick={handleAddrReset}
                >
                  초기화
                </button> */}
              </div>
            </div>
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
              <ul className="plancards-by-day" ref={refDaySlide}>
                {dayCount.map((day, idx) => {
                  return (
                    <li className="oneday" key={idx + 1}>
                      <PlanTimeline
                        day={idx + 1}
                        saveBtnClicked={saveBtnClicked}
                        setSaveBtnClicked={setSaveBtnClicked}
                        handleSavePlanBtn={handleSavePlanBtn}
                        filterByDay={filterByDay}
                        setFilterByDay={setFilterByDay}
                        oneDayPlanList={filterByDay[idx]}
                      />
                    </li>
                  );
                })}
              </ul>
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
