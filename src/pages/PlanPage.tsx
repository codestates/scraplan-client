import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import Navbar from "../components/UI/Navbar";
import CurationList from "../components/Curation/CurationList";
import PlanList from "../components/Plan/PlanList";
require("dotenv").config();

declare global {
  interface Window {
    kakao: any;
  }
}

const PlanPage = () => {
  const planState = useSelector((state: RootState) => state.planReducer);
  const { themeList } = planState;

  const [LatLng, setLatLng] = useState<number[]>([33.450701, 126.570667]);
  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [map, setMap] = useState<any>("");

  useEffect(() => {
    window.kakao.maps.load(() => {
      loadKakaoMap();
    });
  }, []);

  useEffect(() => {}, []);

  const handleChangeInputKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputKeyword(e.target?.value);
    },
    [inputKeyword],
  );

  const loadKakaoMap = () => {
    let container = document.getElementById("planpage__map");
    let options = {
      center: new window.kakao.maps.LatLng(LatLng[0], LatLng[1]),
      level: 3,
    };
    var map = new window.kakao.maps.Map(container, options);
    setMap(map);
  };

  const moveKakaoMap = (lat: number, lng: number) => {
    var moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    setLatLng([lat, lng]);
  };

  const handleFilterByTheme = (): void => {};

  const handleSearchByKeyword = (): void => {
    fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${inputKeyword}`,
      {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_RESTAPI_KEY}`,
        },
      },
    )
      .then((res) => res.json())
      .then((body) => {
        moveKakaoMap(body.documents[0].y, body.documents[0].x);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="planpage">
      <Navbar />
      <CurationList />
      <PlanList />
      <div className="planpage__layout">
        <div className="planpage__layout__options">
          <button className="planpage__layout__options__option">👀</button>
          <span className="planpage__layout__options__option-desc">
            내일정만 보기
          </span>
          <button className="planpage__layout__options__option">✚</button>
          <span className="planpage__layout__options__option-desc-second">
            큐레이션 추가신청
          </span>
          <button className="planpage__layout__options__theme">테마</button>
          <div className="planpage__layout__options__theme-list">
            <div className={`planpage__layout__options__theme-list__inner`}>
              {["🍽", "☕️", "🎬", "🚴🏻", "🏔", "🤔"].map((theme) => {
                return (
                  <button
                    className="planpage__layout__options__theme-list__inner__item"
                    onClick={handleFilterByTheme}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={"planpage__layout__search-bar"}>
          <input
            type="text"
            placeholder="지역 검색"
            value={inputKeyword}
            onChange={handleChangeInputKeyword}
          ></input>
          <button onClick={handleSearchByKeyword}>🔍</button>
        </div>
      </div>
      <div id="planpage__map"></div>
    </div>
  );
};

export default PlanPage;
