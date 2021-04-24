import React, { useState, useEffect, useCallback } from "react";
import PlanSummary from "../components/Plan/PlanSummary";
import Navbar from "../components/UI/Navbar";
import Signin from "../components/User/Signin";
import Modal from "../components/UI/Modal";
import mapdata from "../data/mapdata.json";
import { RootState } from "../reducers";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPlans, getCurationsRequests } from "../actions";

const FeedPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userReducer);

  const [planList, setPlanList] = useState<any>([
    {
      id: 0,
      title: "2박3일 울산여행",
      desc: "여행을 떠나보세요!",
      writer: "guest",
      dayCount: 3,
      representAddr: "울산광역시",
    },
  ]);

  const [planFetching, setPlanFetching] = useState<boolean>(false);
  const [scrollPlanPage, setScrollPlanPage] = useState<number>(1);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");

  const [SignInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [SignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);

  const [inputAddrSi, setInputAddrSi] = useState<string>("선택");
  const [inputAddrGun, setInputAddrGun] = useState<string>("선택");
  const [inputAddrGu, setInputAddrGu] = useState<string>("선택");

  const [toggleSi, setToggleSi] = useState<boolean>(true);
  const [toggleGun, setToggleGun] = useState<boolean>(true);
  const [toggleGu, setToggleGu] = useState<boolean>(true);

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
    handleGetAllPlans();
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

  useEffect(() => {
    window.addEventListener("scroll", handlePlanScroll);
    return () => {
      window.removeEventListener("scroll", handlePlanScroll);
    };
  });

  const handlePlanScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight && planFetching) {
      fetchMorePlanList();
    }
  };

  const fetchMorePlanList = () => {
    if (scrollPlanPage > 0) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/plans/${scrollPlanPage}?writer=${nickname}&email=${email}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            credentials: "include",
          },
        },
      )
        .then((res) => res.json())
        .then((body) => {
          if (body.plans.length === 0) {
            setScrollPlanPage(0);
            setPlanFetching(false);
          } else {
            dispatch(getPlans([...planList, ...body.plans]));
            setPlanList([...planList, ...body.plans]);
            setScrollPlanPage(scrollPlanPage + 1);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleGetAllPlans = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/plans/${1}`, {
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
        setPlanFetching(true);
        setScrollPlanPage(scrollPlanPage + 1);
      })
      .catch((err) => console.error(err));
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
    setInputAddrSi(si);
    setInputAddrGun("선택");
    setInputAddrGu("선택");
  };

  const handleInputAddrGun = (gun: string): void => {
    setInputAddrGun(gun);
    setInputAddrGu("선택");
  };

  const handleInputAddrGu = (gu: string): void => {
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
        `${
          process.env.REACT_APP_SERVER_URL
        }/plans/${1}/?min-day=${inputDaycountMin}&max-day=${inputDaycountMax}&addr=${encodeURIComponent(
          addr,
        )}`,
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
  const handleCreateMyPlan = () => {
    history.push("/planpage/newplan");
  };

  useEffect(() => {
    animation().init();
  });

  const animation = () => {
    let items: any, winH: number;

    const initModule = () => {
      items = document.querySelectorAll(".plansummary");
      winH = window.innerHeight;
      _addEventHandlers();
    };

    const _addEventHandlers = () => {
      window.addEventListener("scroll", _checkPosition);
      window.addEventListener("load", _checkPosition);
      window.addEventListener("resize", initModule);
    };

    const _checkPosition = () => {
      for (let i = 0; i < items.length; i++) {
        let posFromTop = items[i].getBoundingClientRect().top;
        if (winH > posFromTop) {
          items[i].classList.add("fade-in");
        }
      }
    };
    return {
      init: initModule,
    };
  };

  return (
    <>
      <Navbar currentPage="/feedpage" />
      <Modal
        modalType={"alertModal"}
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
      />
      <div className="feedpage">
        <div className="feedpage__banner">
          <div className="feedpage__banner__wrapper"></div>
          <img
            className="feedpage__banner-img"
            src="/images/feed-banner.gif"
            alt=""
          />
          <p className="feedpage__banner-text">
            다른 사람들은 <br />
            어떤 하루를 보낼까요?
          </p>
          <button
            className="feedpage__banner__btn"
            onClick={handleCreateMyPlan}
          >
            <p>나만의 일정 만들기</p>
            <img src="/images/next-pink.png" alt="" />
          </button>
        </div>
        <div className="feedpage__title">
          <p className="feedpage__title-text">일정 구경하기</p>
        </div>
        <div className="feedpage__contents__search-bar">
          <div className="feedpage__contents__search-bar-address">
            <p>대표지역</p>
            <div className="feedpage__contents__search-bar-address-all">
              <span className="feedpage__contents__search-bar-address-si">
                <p>{inputAddrSi}</p>
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
                  <span className="feedpage__contents__search-bar-address-gun">
                    <span>{inputAddrGun}</span>
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
                  <span className={`feedpage__contents__search-bar-address-gu`}>
                    <span>{inputAddrGu}</span>
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
              className="feedpage__contents__search-bar-address__reset-btn"
              onClick={handleAddrReset}
            >
              초기화
            </button>
          </div>
          <div className="feedpage__contents__search-bar-daycount">
            <p>기간</p>
            <h6>최소</h6>
            <input
              type="number"
              min={1}
              max={7}
              value={inputDaycountMin}
              onChange={handleChangeDaycountMin}
            />
            <h6 className="feedpage__contents__search-bar-daycount-max-title">
              최대
            </h6>
            <input
              className="feedpage__contents__search-bar-daycount-max"
              type="number"
              min={1}
              max={7}
              value={inputDaycountMax}
              onChange={handleChangeDaycountMax}
            />
            <button
              className="feedpage__contents__search-bar-search-btn"
              onClick={handleGetPlansByFilter}
            >
              검색하기
            </button>
          </div>
        </div>
        <div className="feedpage__contents__plans">
          {planList.map((plan: any, idx: number) => {
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
    </>
  );
};

export default FeedPage;
