import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers";
import Navbar from "../components/UI/Navbar";
import CurationList from "../components/Curation/CurationList";
import PlanList from "../components/Plan/PlanList";
import { getCurationCards, getPlanCards, getPlanCardsByDay } from "../actions";
import Modal from "../components/UI/Modal";
import AddPlan from "../components/Plan/AddPlan";

declare global {
  interface Window {
    kakao: any;
  }
}

const PlanPage = () => {
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    planReducer: {
      planList: { isValid, isMember, planCards, plan },
      planCardsByDay,
    },
  } = state;
  const dispatch = useDispatch();

  const [LatLng, setLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);
  const [map, setMap] = useState<any>({});
  const [mapLevel, setMapLevel] = useState<number>(5);
  const [mapBounds, setMapBounds] = useState<object>();
  const [markerList, setMarkerList] = useState<any>([]);
  const [curationId, setCurationId] = useState<number | undefined>();
  const [curationAddr, setCurationAddr] = useState<string>("");
  const [curationCoordinates, setCurationCoordinates] = useState<any>([]);
  const [planId, setPlanId] = useState<number | string | undefined>();

  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [keywordList, setKeywordList] = useState<any>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchLatLng, setSearchLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);
  const [openList, setOpenList] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [modalComment, setModalComment] = useState<string>("");
  const [openAddRequest, setOpenAddRequest] = useState<boolean>(false);
  const [viewOnlyMine, setViewOnlyMine] = useState<boolean>(false);
  const [selectTheme, setSelectTheme] = useState<number>(-1);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    setPlanId(Number(location.pathname.split("/")[2]));
  }, []);

  // v3 스크립트 동적으로 로드
  useEffect(() => {
    window.kakao.maps.load(() => {
      loadKakaoMap();
    });
    // }, [viewOnlyMine, planCardsByDay, currentDay, selectTheme, LatLng]);
  }, []);

  // marker request
  // 지도가 이동할 때 (mapBounds의 값이 변할 때)서버에 mapBounds를 보낸다.
  useEffect(() => {
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/curations?coordinates=${encodeURIComponent(
        JSON.stringify(mapBounds),
      )}&theme=${selectTheme}`,
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
  }, [mapBounds, selectTheme]);

  // keyword request
  useEffect(() => {
    setSearchMode(true);
    if (inputKeyword !== "" && searchMode) {
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

  const handleChangeInputKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputKeyword(e.target?.value);
    },
    [inputKeyword],
  );

  const moveToTheNextDay = () => {
    setCurrentDay(currentDay + 1);
  };

  const moveToThePrevDay = () => {
    setCurrentDay(currentDay - 1);
  };

  const handleOpenAddRequest = () => {
    setOpenAddRequest(true);
  };

  const handleCloseAddRequest = () => {
    setOpenAddRequest(false);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  // 큐레이션 마커 초기 실행
  useEffect(() => {
    if (!viewOnlyMine) {
      viewCurationMarker();
    }
  }, [markerList]);

  // 일정 전용 마커 초기 실행
  useEffect(() => {
    if (map && planCardsByDay.length > 0 && mapBounds) {
      if (viewOnlyMine) {
        focusMyPlan();
      }
      viewMyPlan();
    }
  }, [planCardsByDay, currentDay, viewOnlyMine]);

  useEffect(() => {
    if (map && planCardsByDay.length > 0 && mapBounds) {
      focusMyPlan();
    }
  }, [currentDay]);

  // 검색 전용 마커 초기 실행
  useEffect(() => {
    if (map && mapBounds) {
      viewSearchMarker();
    }
  }, [searchLatLng]);

  // 큐레이션 마커 제작
  const [curationMarkers, setCurationMarkers] = useState<any[]>([]);
  const viewCurationMarker = () => {
    if (myPlanMarkers.length > 0) {
      deleteMarkers();
    }
    const markers: any[] = [];
    for (var i = 0; i < markerList.length; i++) {
      let markerImage = new window.kakao.maps.MarkerImage(
        `/images/marker/theme0.png`,
        new window.kakao.maps.Size(54, 58),
        { offset: new window.kakao.maps.Point(20, 58) },
      );
      let position = new window.kakao.maps.LatLng(
        markerList[i].coordinates.coordinates[0],
        markerList[i].coordinates.coordinates[1],
      );
      let marker = new window.kakao.maps.Marker({
        map,
        position,
        title: markerList[i].address,
        image: markerImage,
      });
      ((marker, curationId, curationAddr, curationCoordinates) => {
        window.kakao.maps.event.addListener(marker, "click", () => {
          handleClickMarker(curationId, curationAddr, curationCoordinates);
        });
      })(
        marker,
        markerList[i].id,
        markerList[i].address,
        markerList[i].coordinates.coordinates,
      );
      marker.setMap(map);
      markers.push(marker);
    }
    setCurationMarkers(markers);

    // 기존 마커 제거 함수
    function deleteMarkers() {
      for (let i = 0; i < curationMarkers.length; i++) {
        curationMarkers[i].setMap(null);
      }
    }
  };
  // const viewCurationMarker = () => {
  //   for (var i = 0; i < markerList.length; i++) {
  //     let markerImage = new window.kakao.maps.MarkerImage(
  //       `/images/marker/theme0.png`,
  //       new window.kakao.maps.Size(54, 58),
  //       { offset: new window.kakao.maps.Point(20, 58) },
  //     );
  //     let position = new window.kakao.maps.LatLng(
  //       markerList[i].coordinates.coordinates[0],
  //       markerList[i].coordinates.coordinates[1],
  //     );
  //     let marker = new window.kakao.maps.Marker({
  //       map,
  //       position,
  //       title: markerList[i].address,
  //       image: markerImage,
  //     });
  //     ((marker, curationId, curationAddr, curationCoordinates) => {
  //       window.kakao.maps.event.addListener(marker, "click", () => {
  //         handleClickMarker(curationId, curationAddr, curationCoordinates);
  //       });
  //     })(
  //       marker,
  //       markerList[i].id,
  //       markerList[i].address,
  //       markerList[i].coordinates.coordinates,
  //     );
  //     marker.setMap(map);
  //   }
  // };

  // 내 일정 마커 제거 후 생성
  const [myPlanMarkers, setMyPlanMarkers] = useState<any[]>([]);
  const [myPlanOverlays, setMyPlanOverlays] = useState<any[]>([]);
  const [myPlanLinePath, setMyPlanLinePath] = useState<any>({});

  const focusMyPlan = () => {
    const dailyPlanCards = planCardsByDay[currentDay - 1];
    const sortByPlan = dailyPlanCards.sort(function (
      a: { startTime: string },
      b: { startTime: string },
    ) {
      let first =
        Number(a.startTime.split(":")[0]) * 60 +
        Number(a.startTime.split(":")[1]);
      let second =
        Number(b.startTime.split(":")[0]) * 60 +
        Number(b.startTime.split(":")[1]);
      if (first > second) {
        return 1;
      }
      if (first < second) {
        return -1;
      }
      return 0;
    });
    const myPlanBounds = new window.kakao.maps.LatLngBounds();
    for (let i = 0; i < sortByPlan.length; i++) {
      const position = new window.kakao.maps.LatLng(
        sortByPlan[i].coordinates[0],
        sortByPlan[i].coordinates[1],
      );
      // // 존재하는 마커들의 좌표를 전부 포함하는 영역 설정
      myPlanBounds.extend(position);
      map.setBounds(myPlanBounds);
      // 지도 레벨 1 증가
      const zoomOut = () => {
        const level = map.getLevel();
        map.setLevel(level + 1);
      };
      zoomOut();
    }
  };

  const viewMyPlan = () => {
    if (myPlanMarkers.length > 0) {
      deleteMarkers();
    }
    const dailyPlanCards = planCardsByDay[currentDay - 1];
    const sortByPlan = dailyPlanCards.sort(function (
      a: { startTime: string },
      b: { startTime: string },
    ) {
      let first =
        Number(a.startTime.split(":")[0]) * 60 +
        Number(a.startTime.split(":")[1]);
      let second =
        Number(b.startTime.split(":")[0]) * 60 +
        Number(b.startTime.split(":")[1]);
      if (first > second) {
        return 1;
      }
      if (first < second) {
        return -1;
      }
      return 0;
    });
    const markers: any[] = [];
    const customOverlays: any[] = [];
    const linePath: any[] = [];
    // const myPlanBounds = new window.kakao.maps.LatLngBounds();
    if (sortByPlan.length > 0) {
      for (let i = 0; i < sortByPlan.length; i++) {
        const position = new window.kakao.maps.LatLng(
          sortByPlan[i].coordinates[0],
          sortByPlan[i].coordinates[1],
        );
        // // 존재하는 마커들의 좌표를 전부 포함하는 영역 설정
        // myPlanBounds.extend(position);
        const marker = new window.kakao.maps.Marker({
          position,
        });
        const customOverlayContent = document.createElement("div");
        const innerOverlayContent = document.createElement("div");
        customOverlayContent.className = "customOverlay";
        innerOverlayContent.textContent = `${i + 1}`;
        customOverlayContent.append(innerOverlayContent);

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position,
          content: customOverlayContent,
        });

        const iwContent =
          "<div class='infoWindow'>" +
          `<div class='day'>${currentDay}일차</div>` +
          `<div class='time'>${
            sortByPlan[i].startTime.split(":")[1] === "0"
              ? `${sortByPlan[i].startTime.split(":")[0]}:00`
              : sortByPlan[i].startTime
          } ~ ${
            sortByPlan[i].endTime.split(":")[1] === "0"
              ? `${sortByPlan[i].endTime.split(":")[0]}:00`
              : sortByPlan[i].endTime
          }</div>` +
          `<div class='title'>${sortByPlan[i].comment}</div>` +
          `<div class='address'>${sortByPlan[i].address}</div>` +
          "</div>";

        // 마커에 표시할 인포윈도우를 생성합니다
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent, // 인포윈도우에 표시할 내용
        });

        customOverlayContent.addEventListener("mouseover", function () {
          infowindow.open(map, marker);
        });
        customOverlayContent.addEventListener("mouseout", function () {
          infowindow.close();
        });

        linePath.push(
          new window.kakao.maps.LatLng(
            sortByPlan[i].coordinates[0],
            sortByPlan[i].coordinates[1],
          ),
        );
        marker.setMap(map);
        markers.push(marker);
        customOverlay.setMap(map);
        customOverlays.push(customOverlay);
      }
      const polyline = new window.kakao.maps.Polyline({
        endArrow: true,
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: "blue", // 선의 색깔입니다
        strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "dashed", // 선의 스타일입니다
      });
      polyline.setMap(map);
      setMyPlanLinePath(polyline);

      // if (viewOnlyMine) {
      //   map.setBounds(myPlanBounds);
      //   // 지도 레벨 1 증가
      //   const zoomOut = () => {
      //     const level = map.getLevel();
      //     map.setLevel(level + 1);
      //   };
      //   zoomOut();
      // }
    }
    setMyPlanMarkers(markers);
    setMyPlanOverlays(customOverlays);

    // 기존 마커 제거 함수
    function deleteMarkers() {
      for (let i = 0; i < myPlanMarkers.length; i++) {
        myPlanMarkers[i].setMap(null);
        myPlanOverlays[i].setMap(null);
      }
      myPlanLinePath.setMap(null);
    }
  };

  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);
  const viewSearchMarker = () => {
    if (searchMarkers.length > 0) {
      deleteMarkers();
    }
    // 검색결과
    const markers = [];
    const position = new window.kakao.maps.LatLng(
      searchLatLng[0],
      searchLatLng[1],
    );
    const image = new window.kakao.maps.MarkerImage(
      `/images/marker/theme0.png`,
      new window.kakao.maps.Size(54, 58),
      { offset: new window.kakao.maps.Point(20, 58) },
    );
    const marker = new window.kakao.maps.Marker({
      image,
      position,
    });
    marker.setMap(map);
    markers.push(marker);
    setSearchMarkers(markers);

    function deleteMarkers() {
      for (let i = 0; i < searchMarkers.length; i++) {
        searchMarkers[i].setMap(null);
      }
    }
  };

  // 맵의 변화 (drag, zoom)가 있을 때 마다 중심좌표, 경계값을 구한다.
  const loadKakaoMap = () => {
    let container = document.getElementById("planpage__map");
    let options = {
      center: new window.kakao.maps.LatLng(LatLng[0], LatLng[1]),
      level: mapLevel,
    };

    let map = new window.kakao.maps.Map(container, options);
    setMap(map);
    // 여기까지
    let bounds = map.getBounds();
    setMapBounds([
      [bounds.qa, bounds.pa],
      [bounds.ha, bounds.oa],
    ]);

    if (!viewOnlyMine) {
      // 전체 큐레이션 보기인 경우
      // drag event controller
      window.kakao.maps.event.addListener(map, "dragend", () => {
        let latlng = map.getCenter();
        setLatLng([latlng.getLat(), latlng.getLng()]);
        let bounds = map.getBounds();
        setMapBounds([
          [bounds.qa, bounds.pa],
          [bounds.ha, bounds.oa],
        ]);
        viewCurationMarker();
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
      viewCurationMarker();
    }
  };

  // 지도 이동시키기
  const moveKakaoMap = (lat: number, lng: number) => {
    var moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    setLatLng([lat, lng]);
  };

  // 옵션과 관련된 함수들
  const handleViewOnlyMine = () => {
    // alert("내 일정만 보기");
  };

  const handleFilterByTheme = (idx: number): void => {
    setSelectTheme(idx);
  };

  const handleViewState = () => {
    if (!viewOnlyMine) {
      handleViewOnlyMine();
    }
    setViewOnlyMine(!viewOnlyMine);
  };

  const handleSearchByKeyword = (): void => {
    moveKakaoMap(searchLatLng[0], searchLatLng[1]);
    setKeywordList([]);
    setInputKeyword(inputKeyword);
  };

  const handleEnterSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchMode(false);
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
    setInputKeyword(addr);
    setKeywordList([]);
    setSearchMode(false);
  };

  const handleClickMarker = (
    curationId: number,
    curationAddr: string,
    curationCoordinates: any,
  ) => {
    setCurationAddr(curationAddr);
    setCurationCoordinates(curationCoordinates);
    setOpenList(true);
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
        }
      })
      .catch((err) => console.error(err));
  };

  // curation 에서 + 버튼 클릭시 plan으로 정보를 넘겨주는 함수
  const handleAddToPlan = (props: any, e: Event) => {
    e.stopPropagation();
    const {
      curationCardId,
      theme,
      title,
      detail,
      photo,
      avgTime,
      feedbackCnt,
    } = props;

    let max =
      planCardsByDay &&
      planCardsByDay[currentDay - 1].reduce(
        (plan: any, cur: any) => {
          return Number(cur.endTime.split(":")[0]) * 60 +
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
        Number((avgTime % 1).toFixed(2)) * 100) %
      60;
    let endHour =
      Number(max.endTime.split(":")[0]) +
      Math.floor(avgTime) +
      Math.floor(
        (Number(max.endTime.split(":")[1]) +
          Number((avgTime % 1).toFixed(2)) * 100) /
          60,
      );

    dispatch(
      getPlanCardsByDay([
        ...planCardsByDay.slice(0, currentDay - 1),
        planCardsByDay[currentDay - 1].concat({
          day: currentDay,
          startTime: max.endTime,
          endTime: endHour + ":" + endMin,
          comment: title,
          theme,
          coordinates: curationCoordinates,
          address: curationAddr,
        }),
        ...planCardsByDay.slice(currentDay),
      ]),
    );
  };

  return (
    <div className="planpage">
      <Navbar currentPage="/planpage/newplan" />
      <CurationList
        addEventFunc={handleAddToPlan}
        openList={openList}
        setOpenList={setOpenList}
        curationAddr={curationAddr}
      />
      <PlanList
        LatLng={LatLng}
        setSearchLatLng={setSearchLatLng}
        moveKakaoMap={moveKakaoMap}
        planId={planId}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        moveToTheNextDay={moveToTheNextDay}
        moveToThePrevDay={moveToThePrevDay}
      />
      <Modal
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
        modalType={modalType}
      />
      <div className="planpage__layout">
        <div className="planpage__layout__options">
          <button
            className="planpage__layout__options__option"
            onClick={handleViewState}
          >
            {viewOnlyMine ? "👀" : "🗺"}
          </button>
          <span className="planpage__layout__options__option-desc">
            {viewOnlyMine ? "전체 보러가기" : "내 일정만 보러가기"}
          </span>
          <button
            className="planpage__layout__options__option"
            onClick={handleOpenAddRequest}
          >
            ✚
          </button>
          <span className="planpage__layout__options__option-desc-second">
            큐레이션 추가신청
          </span>
          <AddPlan
            open={openAddRequest}
            close={handleCloseAddRequest}
            type="requestCuration"
            LatLng={LatLng}
            setSearchLatLng={setSearchLatLng}
            moveKakaoMap={moveKakaoMap}
          />
          <button className="planpage__layout__options__theme">
            {selectTheme === -1
              ? "테마"
              : ["🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"][selectTheme]}
          </button>
          <div className="planpage__layout__options__theme-list">
            <div className={`planpage__layout__options__theme-list__inner`}>
              {["All", "🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"].map((theme, idx) => {
                return (
                  <button
                    key={idx}
                    className="planpage__layout__options__theme-list__inner__item"
                    onClick={() => handleFilterByTheme(idx - 1)}
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
                    onClick={() => handleClickKeywordList(addr.place_name)}
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
