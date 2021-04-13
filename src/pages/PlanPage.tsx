import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers";
import Navbar from "../components/UI/Navbar";
import CurationList from "../components/Curation/CurationList";
import PlanList from "../components/Plan/PlanList";
import { getCurationCards } from "../actions";
import Modal from "../components/UI/Modal";
import AddPlan from "../components/Plan/AddPlan";
require("dotenv").config();

declare global {
  interface Window {
    kakao: any;
  }
}

const PlanPage = () => {
  const planState = useSelector((state: RootState) => state.planReducer);
  const { themeList } = planState;
  const dispatch = useDispatch();

  const [LatLng, setLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);
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
  const [curationId, setCurationId] = useState<number>();

  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [keywordList, setKeywordList] = useState<any>([]);

  const [searchLatLng, setSearchLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [modalComment, setModalComment] = useState<string>("");
  const [openAddRequest, setOpenAddRequest] = useState<boolean>(false);

  const handleOpenAddRequset = () => {
    setOpenAddRequest(true);
  };

  const handleCloseAddRequest = () => {
    setOpenAddRequest(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    window.kakao.maps.load(() => {
      loadKakaoMap();
    });
  }, []);

  // marker request
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

  // keyword request
  useEffect(() => {
    handleSearchKeywordKaKao();
  }, [inputKeyword]);

  const handleSearchKeywordKaKao = () => {
    if (inputKeyword !== "") {
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
  };

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
    moveKakaoMap(searchLatLng[0], searchLatLng[1]);
    setKeywordList([]);
    setInputKeyword("");
  };

  const handleEnterSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchByKeyword();
    }
  };

  const handleEscKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setKeywordList([]);
      setInputKeyword("");
    }
  };

  const handleClickKeywordList = (addr: string) => {
    fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${addr}&y=${LatLng[0]}&x=${LatLng[1]}&sort=distance`,
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
      })
      .catch((err) => console.log(err));
    setInputKeyword("");
    setKeywordList([]);
  };

  //
  const handleClickMarker = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-cards/${curationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body) {
          dispatch(getCurationCards(body));
        } else {
          setModalComment("데이터가 없습니다.");
          setModalType("alertModal");
          handleModalOpen();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="planpage">
      <Navbar />
      <CurationList />
      <PlanList />
      <Modal
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
        modalType={modalType}
      />
      <AddPlan
        open={openAddRequest}
        close={handleCloseAddRequest}
        type="requestCuration"
      />
      <div className="planpage__layout">
        <div className="planpage__layout__options">
          <button className="planpage__layout__options__option">👀</button>
          <span className="planpage__layout__options__option-desc">
            내일정만 보기
          </span>
          <button
            className="planpage__layout__options__option"
            onClick={handleOpenAddRequset}
          >
            ✚
          </button>
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
        <div className="planpage__layout__search-bar__wrapper">
          <div className="planpage__layout__search-bar">
            <input
              type="text"
              placeholder="지역 검색"
              value={inputKeyword}
              onChange={handleChangeInputKeyword}
              onKeyPress={handleEnterSearch}
              onKeyDown={handleEscKey}
            ></input>
            <button onClick={handleSearchByKeyword}>🔍</button>
          </div>
          {keywordList.length !== 0 ? (
            <ul>
              {keywordList.map((addr: any, idx: number) => {
                return (
                  <li
                    key={idx}
                    onClick={() => handleClickKeywordList(addr.address_name)}
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
      </div>
      <div id="planpage__map"></div>
    </div>
  );
};

export default PlanPage;
