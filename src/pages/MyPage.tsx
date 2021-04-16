import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../reducers";
import { userInfo, getPlans, getCurationsRequests } from "../actions";
import Navbar from "../components/UI/Navbar";
import Modal from "../components/UI/Modal";
import PlanSummary from "../components/Plan/PlanSummary";
import mapdata from "../data/mapdata.json";
import CurationRequestItem from "../components/Curation/CurationRequestItem";

const MyPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userReducer);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");

  const [userNickname, setUserNickname] = useState<string>("");

  const [curMenu, setCurMenu] = useState<string>("myPlans");
  const [planList, setPlanList] = useState([
    {
      id: 0,
      title: "2박3일 울산여행",
      desc: "여행을 떠나보세요!",
      writer: "guest",
      dayCount: 3,
      representAddr: "울산광역시",
    },
    {
      id: 0,
      title: "2박3일 울산여행",
      desc: "여행을 떠나보세요!",
      writer: "jooing",
      dayCount: 3,
      representAddr: "울산광역시",
    },
  ]);

  const [curationsRequestsList, setCurationsRequestsList] = useState([
    {
      id: 0,
      title: "서울 여행",
      requester: "tester",
      coordinates: [10, 10],
      address: "서울시 강남구 -",
      requestComment: "이 장소에 대해 추가해주세요~! ",
      requestTheme: 3,
      status: 0,
    },
    {
      id: 1,
      title: "마장동 소고기 투어",
      requester: "tester",
      coordinates: [10, 10],
      address: "서울시 성동구 마장동",
      requestComment: "소고기는 마장동에서!",
      requestTheme: 3,
      status: 3,
    },
  ]);

  const [inputAddrSi, setInputAddrSi] = useState<string>("선택");
  const [inputAddrGun, setInputAddrGun] = useState<string>("선택");
  const [inputAddrGu, setInputAddrGu] = useState<string>("선택");

  const [toggleSi, setToggleSi] = useState<boolean>(false);
  const [toggleGun, setToggleGun] = useState<boolean>(false);
  const [toggleGu, setToggleGu] = useState<boolean>(false);

  const [inputDaycountMin, setInputDaycountMin] = useState<string>("1");
  const [inputDaycountMax, setInputDaycountMax] = useState<string>("1");

  const [addrList, setAddrList] = useState<any>(mapdata || {});
  const [addrListSi, setAddrListSi] = useState<string[] | undefined>();
  const [addrListGun, setAddrListGun] = useState<string[] | undefined>();
  const [addrListGu, setAddrListGu] = useState<string[] | undefined>();

  const {
    user: { token, email, nickname },
  } = userState;

  useEffect(() => {
    setAddrList(mapdata);
    setAddrListSi(Object.keys(mapdata));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/info/${email}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.isValid) {
          dispatch(userInfo(token, body.email, body.nickname));
          setUserNickname(body.nickname);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/plans?writer-email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        dispatch(getPlans(body.plans));
        setPlanList(body.plans);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-requests/${email}`, {
      method: "GET",
      headers: {
        authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        dispatch(getCurationsRequests(body.curationRequests));
        setCurationsRequestsList(body.curationRequests);
      })
      .catch((err) => console.error(err));
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

  const handleMenuBtn = (menu: string): void => {
    setCurMenu(menu);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChangeDaycountMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputDaycountMin(e.target?.value);
    },
    [inputDaycountMin],
  );
  const handleChangeDaycountMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputDaycountMax(e.target?.value);
    },
    [inputDaycountMax],
  );

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

  const handleGetPlansByFilter = () => {
    if (Number(inputDaycountMin) > Number(inputDaycountMax)) {
      setModalComment("최소값이 최대값보다 작아야합니다.");
      handleModalOpen();
    } else {
      const addr =
        (inputAddrSi === "선택" ? "" : inputAddrSi) +
        " " +
        (inputAddrGun === "선택" ? "" : inputAddrGun) +
        " " +
        (inputAddrGu === "선택" ? "" : inputAddrGu);
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/plans?writer-email=${email}&min-day=${inputDaycountMin}&max-day=${inputDaycountMax}&addr=${addr}`,
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
          dispatch(getPlans(body.plans));
          setPlanList(body.plans);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Navbar currentPage="/mypage" />
      <Modal
        modalType={"alertModal"}
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
      />
      <div className="mypage">
        <div className="mypage__header">
          <div className="mypage__header__title">마이페이지</div>
          <p className="mypage__header__nickname">{userNickname}</p>
          <p className="mypage__header__email">
            {email === "" ? "guest@scraplan.com" : email}
          </p>
          <button
            className="mypage__header__edit-btn"
            onClick={() => {
              history.push("/edituserinfo");
            }}
          >
            <span>내 정보</span>
            <img src="/images/user.png" alt="" />
          </button>
        </div>
        <div className="mypage__menus">
          <button onClick={() => handleMenuBtn("myPlans")}>내 일정 관리</button>
          <button onClick={() => handleMenuBtn("myCurationRequest")}>
            큐레이션 요청
          </button>
        </div>
        {curMenu === "myPlans" ? (
          <div className="mypage__contents">
            <div className="mypage__contents__title">
              <p className="mypage__contents__title-text">내 일정 관리하기</p>
              <button
                className="mypage__contents__title__feedpage-btn"
                onClick={() => {
                  history.push("/feedpage");
                }}
              >
                <span>다른 일정 구경하기</span>
                <img src="/images/next.png" alt="" />
              </button>
            </div>
            <div className="mypage__contents__search-bar">
              <div className="mypage__contents__search-bar-address">
                <p>대표지역</p>
                <div className="mypage__contents__search-bar-address-all">
                  <span className="mypage__contents__search-bar-address-si">
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
                      <span className="mypage__contents__search-bar-address-gun">
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
                        className={`mypage__contents__search-bar-address-gu`}
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
                </div>
                <button
                  className="mypage__contents__search-bar-address__reset-btn"
                  onClick={handleAddrReset}
                >
                  초기화
                </button>
              </div>
              <div className="mypage__contents__search-bar-daycount">
                <p>기간</p>
                <h6>최소</h6>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={inputDaycountMin}
                  onChange={handleChangeDaycountMin}
                />
                <h6 className="mypage__contents__search-bar-daycount-max-title">
                  최대
                </h6>
                <input
                  className="mypage__contents__search-bar-daycount-max"
                  type="number"
                  min={1}
                  max={7}
                  value={inputDaycountMax}
                  onChange={handleChangeDaycountMax}
                />
                <button
                  className="mypage__contents__search-bar-search-btn"
                  onClick={handleGetPlansByFilter}
                >
                  검색하기
                </button>
              </div>
            </div>
            <div className="mypage__contents__plans">
              <div
                className="mypage__contents__plans__add-plan"
                onClick={() => {
                  history.push("/planpage");
                }}
              >
                <img src="/images/add.png" alt="" />
                <p>일정 만들기</p>
              </div>
              {planList.map((plan, idx) => {
                return (
                  <PlanSummary
                    key={idx}
                    id={plan.id}
                    title={plan.title}
                    desc={plan.desc}
                    writer={plan.writer}
                    dayCount={plan.dayCount}
                    representAddr={plan.representAddr}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mypage__contents">
            <div className="mypage__contents__title">
              <p className="mypage__contents__title-text">큐레이션 요청 확인</p>
            </div>
            <div className="mypage__contents__notice-img">
              <img src="" alt="" />
            </div>
            <div className="mypage__contents__req-table">
              <div className="mypage__contents__req-table__top-bar">
                <p>요청번호</p>
                <p>상태</p>
                <p>제목</p>
              </div>
              {curationsRequestsList.map((item, idx) => {
                return <CurationRequestItem key={idx} props={item} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default MyPage;
