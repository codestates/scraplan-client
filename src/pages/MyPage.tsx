import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../reducers";
import { getPlans, getCurationsRequests } from "../actions";
import Navbar from "../components/UI/Navbar";
import PlanSummary from "../components/Plan/PlanSummary";
import mapdata from "../data/mapdata.json";
import CurationRequestItem from "../components/Curation/CurationRequestItem";

const MyPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userReducer);
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
  ]);

  const [curationsRequestsList, setCurationsRequestsList] = useState([
    {
      id: 0,
      title: "서울 여행",
      requester: "tester",
      cordinates: [10, 10],
      address: "서울시 강남구 -",
      requestComment: "이 장소에 대해 추가해주세요~! ",
      requestTheme: 3,
      status: 1,
    },
    {
      id: 1,
      title: "서울 여행",
      requester: "tester",
      cordinates: [10, 10],
      address: "서울시 성동구 마장동",
      requestComment: "이 장소에 대해 추가해주세요~! ",
      requestTheme: 3,
      status: 3,
    },
  ]);

  const [inputAddrSi, setInputAddrSi] = useState<string>("");
  const [inputAddrGun, setInputAddrGun] = useState<string>("");
  const [inputAddrGu, setInputAddrGu] = useState<string>("");
  const [inputAddrDong, setInputAddrDong] = useState<string>("");
  const [inputDaycountMin, setInputDaycountMin] = useState<string>("1");
  const [inputDaycountMax, setInputDaycountMax] = useState<string>("1");

  const [addrList, setAddrList] = useState<any>(mapdata || {});
  const [addrListSi, setAddrListSi] = useState<string[]>([""]);
  const [addrListGun, setAddrListGun] = useState<string[]>([""]);
  const [addrListGu, setAddrListGu] = useState<string[]>([""]);
  const [addrListDong, setAddrListDong] = useState<string[]>([""]);

  const {
    user: { token, email, nickname },
  } = userState;

  useEffect(() => {
    setAddrList(mapdata);
    setAddrListSi(Object.keys(mapdata));
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
    if (inputAddrSi !== "" && addrList[inputAddrSi]) {
      setAddrListGun(Object.keys(addrList[inputAddrSi]));
    }
  }, [inputAddrSi]);

  useEffect(() => {
    if (
      inputAddrSi !== "" &&
      addrList[inputAddrSi] &&
      addrList[inputAddrSi][inputAddrGun]
    ) {
      setAddrListGu(Object.keys(addrList[inputAddrSi][inputAddrGun]));
    }
  }, [inputAddrGun]);

  useEffect(() => {
    if (
      inputAddrSi !== "" &&
      (inputAddrGun !== "" || inputAddrGu !== "") &&
      addrList[inputAddrSi] &&
      addrList[inputAddrSi][inputAddrGun] &&
      addrList[inputAddrSi][inputAddrGun][inputAddrGu]
    ) {
      setAddrListDong(addrList[inputAddrSi][inputAddrGun][inputAddrGu]);
    }
  }, [inputAddrGu]);

  const handleMenuBtn = (menu: string): void => {
    setCurMenu(menu);
  };

  const handleChangeAddrSi = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputAddrSi(e.target?.value);
    },
    [inputAddrSi],
  );
  const handleChangeAddrGun = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputAddrGun(e.target?.value);
    },
    [inputAddrGun],
  );
  const handleChangeAddrGu = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputAddrGu(e.target?.value);
    },
    [inputAddrGu],
  );

  const handleChangeAddrDong = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputAddrDong(e.target?.value);
    },
    [inputAddrDong],
  );

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
  const handleAddrReset = (): void => {
    setInputAddrSi("");
    setInputAddrGun("");
    setInputAddrGu("");
    setInputAddrDong("");
  };

  const handleGetPlansByFilter = () => {
    if (Number(inputDaycountMin) > Number(inputDaycountMax)) {
      // modal 로 수정할 예정
      alert("최소값이 최대값보다 작아야합니다.");
    } else {
      const addr =
        inputAddrSi +
        (inputAddrGun === "-" ? "" : inputAddrGun) +
        (inputAddrGu === "-" ? "" : inputAddrGu) +
        inputAddrDong;
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
      <Navbar />
      <div className="mypage">
        <div className="mypage__header">
          <div className="mypage__header__title">마이페이지</div>
          <p className="mypage__header__nickname">{nickname}</p>
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
                <p>지역</p>
                <div className="mypage__contents__search-bar-address-si">
                  <h6>시/도</h6>
                  <input
                    list="existSi"
                    value={inputAddrSi}
                    onChange={handleChangeAddrSi}
                  ></input>
                  <datalist id="existSi">
                    {addrListSi.map((si, idx) => {
                      return (
                        <option key={idx} value={si}>
                          {si}
                        </option>
                      );
                    })}
                  </datalist>
                  <div className="mypage__contents__search-bar-address-gun"></div>
                  <h6>군</h6>
                  <input
                    list="existGun"
                    value={inputAddrGun}
                    onChange={handleChangeAddrGun}
                  ></input>
                  <datalist id="existGun">
                    {addrListGun.map((gun, idx) => {
                      return (
                        <option key={idx} value={gun}>
                          {gun}
                        </option>
                      );
                    })}
                  </datalist>
                </div>
                <div className="mypage__contents__search-bar-address-gu">
                  <h6>구</h6>
                  <input
                    list="existGu"
                    value={inputAddrGu}
                    onChange={handleChangeAddrGu}
                  ></input>
                  <datalist id="existGu">
                    {addrListGu.map((gu, idx) => {
                      return (
                        <option key={idx} value={gu}>
                          {gu}
                        </option>
                      );
                    })}
                  </datalist>
                  <h6>동/읍/면</h6>
                  <input
                    list="existDong"
                    value={inputAddrDong}
                    onChange={handleChangeAddrDong}
                  ></input>
                  <datalist id="existDong">
                    {addrListDong.map((dong, idx) => {
                      return (
                        <option key={idx} value={dong}>
                          {dong}
                        </option>
                      );
                    })}
                  </datalist>
                  <button
                    className="mypage__contents__search-bar-address__reset-btn"
                    onClick={handleAddrReset}
                  >
                    초기화
                  </button>
                </div>
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
                <h6>최대</h6>
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
              {planList.map((plan) => {
                return (
                  <PlanSummary
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
              {curationsRequestsList.map((item) => {
                return <CurationRequestItem props={item} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default MyPage;
