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
  const [map, setMap] = useState<any>({});
  const [mapLevel, setMapLevel] = useState<number>(5);
  const [mapBounds, setMapBounds] = useState<object>();
  const [markerList, setMarkerList] = useState<any>([
    {
      id: 0,
      coordinates: [37.550874837441, 126.925554591431],
      address: "홍대 1",
      theme: 2,
    },
    {
      id: 1,
      coordinates: [37.54929794575741, 126.92823135760973],
      address: "홍대 2",
      theme: 0,
    },
    {
      id: 2,
      coordinates: [33.450879, 126.56994],
      address: "제주도 1",
      theme: 0,
    },
    {
      id: 3,
      coordinates: [33.451393, 126.56073],
      address: "제주도 2",
      theme: 5,
    },
    {
      id: 4,
      coordinates: [33.45, 126.56023],
      address: "제주도 3",
      theme: 3,
    },
    {
      id: 5,
      coordinates: [33.440093, 126.559],
      address: "제주도 4",
      theme: 4,
    },
    {
      id: 6,
      coordinates: [33.441393, 126.56073],
      address: "제주도 5",
      theme: 1,
    },
  ]);

  const [inputKeyword, setInputKeyword] = useState<string>("");

  useEffect(() => {
    window.kakao.maps.load(() => {
      loadKakaoMap();
    });
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/curations?coordinates=${mapBounds}`,
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
        setMarkerList(body);
      })
      .catch((err) => console.error(err));
  }, [mapBounds]);

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
      level: mapLevel,
    };
    let map = new window.kakao.maps.Map(container, options);
    setMap(map);
    let bounds = map.getBounds();
    setMapBounds([
      [bounds.qa, bounds.pa],
      [bounds.ha, bounds.oa],
    ]);

    // drag event controller
    window.kakao.maps.event.addListener(map, "dragend", () => {
      let latlng = map.getCenter();
      setLatLng([latlng.getLat(), latlng.getLng()]);
      let bounds = map.getBounds();
      setMapBounds([
        [bounds.qa, bounds.pa],
        [bounds.ha, bounds.oa],
      ]);

      for (var i = 0; i < markerList.length; i++) {
        let markerImage = new window.kakao.maps.MarkerImage(
          `/images/marker/theme${markerList[i].theme}.png`,
          new window.kakao.maps.Size(54, 58),
          { offset: new window.kakao.maps.Point(20, 58) },
        );
        let position = new window.kakao.maps.LatLng(
          markerList[i].coordinates[0],
          markerList[i].coordinates[1],
        );
        var marker = new window.kakao.maps.Marker({
          map,
          position,
          title: markerList[i].address,
          image: markerImage,
        });
        window.kakao.maps.event.addListener(marker, "click", handleClickMarker);
      }
      marker.setMap(map);
    });

    // level(zoom) event controller
    let zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      let level = map.getLevel();
      setMapLevel(level);
      let bounds = map.getBounds();
      setMapBounds([
        [bounds.qa, bounds.pa],
        [bounds.ha, bounds.oa],
      ]);
      //format => ga {ha: 126.56714657186055, qa: 33.40906146511531, oa: 126.59384131033772, pa: 33.42485772749098}
    });

    for (var i = 0; i < markerList.length; i++) {
      let markerImage = new window.kakao.maps.MarkerImage(
        `/images/marker/theme${markerList[i].theme}.png`,
        new window.kakao.maps.Size(54, 58),
        { offset: new window.kakao.maps.Point(20, 58) },
      );
      let position = new window.kakao.maps.LatLng(
        markerList[i].coordinates[0],
        markerList[i].coordinates[1],
      );
      var marker = new window.kakao.maps.Marker({
        map,
        position,
        title: markerList[i].address,
        image: markerImage,
      });
      window.kakao.maps.event.addListener(marker, "click", handleClickMarker);
    }
    marker.setMap(map);
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

  const handleClickMarker = () => {
    alert("마커클릭");
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
              {["🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"].map((theme) => {
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
