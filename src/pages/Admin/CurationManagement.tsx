import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getCurationCards, getCurationsRequestsResolved } from "../../actions";
import CurationList from "../../components/Curation/CurationList";
import {
  uploadScraplanThumbnail,
  deleteFile,
} from "../../aws_controller/aws_controller";
import "./Admin.scss";

declare global {
  interface Window {
    kakao: any;
  }
}

const CurationManagement = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    planReducer: {
      planCards: { isValid, isMember, planCards },
    },
    curationReducer,
  } = state;

  const [mode, setMode] = useState<string>("create");
  const [openList, setOpenList] = useState<boolean>(false);

  const [LatLng, setLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);
  const [map, setMap] = useState<any>({});
  const [mapLevel, setMapLevel] = useState<number>(5);
  const [mapBounds, setMapBounds] = useState<any>();
  const [markerList, setMarkerList] = useState<any>([]);

  const [keywordList, setKeywordList] = useState<any>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchLatLng, setSearchLatLng] = useState<number[]>([
    37.5139795454969,
    127.048963363388,
  ]);

  const [inputCurationId, setInputCurationId] = useState<number | undefined>(
    undefined,
  );
  const [inputCurationCardId, setInputCurationCardId] = useState<
    number | undefined
  >(undefined);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [inputDesc, setInputDesc] = useState<string>("");
  const [inputPhoto, setInputPhoto] = useState<string>("");
  const [inputTime, setInputTime] = useState<string>("");
  const [inputTheme, setInputTheme] = useState<number>(0);

  const [curationResolved, setCurationResolved] = useState<any>({});

  useEffect(() => {
    if (curationReducer.curationRequestsResolved) {
      const {
        id,
        requester,
        coordinates,
        address,
        requestTitle,
        requestComment,
        requestTheme,
        status,
      } = curationReducer.curationRequestsResolved;
      setCurationResolved(curationReducer.curationRequestsResolved);
      setInputTitle(requestTitle);
      setInputKeyword(address);
      setInputDesc(requestComment);
      setInputTheme(requestTheme);
    }
    dispatch(getCurationsRequestsResolved({}));
    setSearchMode(false);
  }, []);

  useEffect(() => {
    window.kakao.maps.load(() => {
      loadKakaoMap();
    });
  }, []);

  useEffect(() => {
    makeMarker();
  }, [markerList]);

  useEffect(() => {
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/curations?coordinates=${encodeURIComponent(JSON.stringify(mapBounds))}`,
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

  useEffect(() => {
    setSearchMode(true);
    handleSearchKeywordKaKao();
  }, [inputKeyword]);

  const makeMarker = () => {
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

      ((marker, curationId, curationAddr) => {
        window.kakao.maps.event.addListener(marker, "click", () => {
          handleClickMarker(curationId, curationAddr);
        });
      })(marker, markerList[i].id, markerList[i].address);
      marker.setMap(map);
    }
  };

  const loadKakaoMap = () => {
    let container = document.getElementById("curation-management__map");
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
      setLatLng([Number(latlng.getLat()), Number(latlng.getLng())]);
      let bounds = map.getBounds();
      setMapBounds([
        [bounds.qa, bounds.pa],
        [bounds.ha, bounds.oa],
      ]);
      makeMarker();
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
    makeMarker();
  };

  const moveKakaoMap = (lat: number, lng: number) => {
    var moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    setLatLng([Number(lat), Number(lng)]);
  };

  const handleClickMarker = (curationId: number, curationAddr: string) => {
    setInputCurationId(curationId);
    setInputKeyword(curationAddr);
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

  const handleChangeInputKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputKeyword(e.target?.value);
    },
    [inputKeyword],
  );

  const handleSearchKeywordKaKao = () => {
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
          setSearchLatLng([
            Number(body.documents[0].y),
            Number(body.documents[0].x),
          ]);
        })
        .catch((err) => console.log(err));
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
    setSearchMode(false);
    setKeywordList([]);
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

  const handleAddToEdit = (props: any, e: Event) => {
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
    setInputCurationCardId(curationCardId);
    setInputTitle(title);
    setInputDesc(detail);
    setInputPhoto(photo);
    setInputTheme(theme);
    setInputTime(avgTime);
  };

  const handleChangeCurationId = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputCurationId(Number(e.target?.value));
    },
    [inputCurationId],
  );

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitle(e.target?.value);
    },
    [inputTitle],
  );

  const handleChangeDesc = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputDesc(e.target?.value);
    },
    [inputDesc],
  );

  const handleChangePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files && e.target.files.length > 0) {
    //   const tempThumbnail = await uploadScraplanThumbnail(
    //     email,
    //     e.target.files,
    //   );
    //   setInputPhoto(tempThumbnail.toString());
    // }
  };

  const handleChangeTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTime(e.target?.value);
    },
    [inputTime],
  );

  const handleChangeTheme = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTheme(Number(e.target?.value));
    },
    [inputTheme],
  );

  const handleCreateCurationCard = async () => {
    let curationId = inputCurationId;
    await fetch(`${process.env.REACT_APP_SERVER_URL}/curation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        coordinates: encodeURIComponent(JSON.stringify(LatLng)),
        address: inputKeyword,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "successfully added") {
          // 기존에 존재 X
          curationId = body.id;
        } else {
          // 기존에 존재 O
        }
      })
      .catch((err) => console.error(err));

    await fetch(`${process.env.REACT_APP_SERVER_URL}/curation-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        curationId,
        theme: inputTheme,
        title: inputTitle,
        detail: inputDesc,
        photo: "ㅁㄴㅇㄹ",
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "successfully added") {
          // Modal로 성공했다고 표시
        } else {
          // Modal로 실패했다고 표시
        }
      })
      .catch((err) => console.error(err));

    // 요청으로 들어온 경우 승인처리
    if (Object.keys(curationResolved).length !== 0) {
      const { id } = curationResolved;
      await fetch(`${process.env.REACT_APP_SERVER_URL}/curation-requests`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
          authorization: token,
        },
        body: JSON.stringify({
          email,
          id,
          status: 2,
        }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.message === "Successfully updated status") {
            // Modal - 승인 완료
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEditCurationCard = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-card`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        curationCardId: inputCurationCardId,
        theme: inputTheme,
        title: inputTitle,
        detail: inputDesc,
        photo: inputPhoto,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "successfully edited") {
          // Modal로 성공했다고 표시
        } else {
          // Modal로 실패했다고 표시
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteCurationCard = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-card`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        curationCardId: inputCurationCardId,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "successfully deleted") {
          // Modal로 성공했다고 표시
          deleteFile(`${email}/${inputPhoto}`);
        } else {
          // Modal로 실패했다고 표시
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteCuration = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        id: inputCurationId,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "successfully deleted") {
          // Modal로 성공했다고 표시
        } else {
          // Modal로 실패했다고 표시
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="curation-management">
      <div id="curation-management__map"></div>
      {mode === "edit" ? (
        <CurationList
          addEventFunc={handleAddToEdit}
          openList={openList}
          setOpenList={setOpenList}
        />
      ) : (
        <></>
      )}
      <div className="curation-management__edit">
        <div className="curation-management__edit__menu">
          <p
            className={`${mode === "create" ? "selected" : ""}`}
            onClick={() => setMode("create")}
          >
            큐레이션 카드 등록
          </p>
          <p
            className={`${mode === "edit" ? "selected" : ""}`}
            onClick={() => setMode("edit")}
          >
            큐레이션 카드 수정
          </p>
        </div>
        <ul className="curation-management__edit-form">
          <li className="curation-management__edit-form__item">
            <p>큐레이션(마커) ID</p>
            <input
              type="text"
              placeholder="큐레이션(마커) ID"
              value={inputCurationId}
              onChange={handleChangeCurationId}
            />
            <button className="marker-del-btn" onClick={handleDeleteCuration}>
              {" "}
              마커삭제{" "}
            </button>
          </li>
          <li className="curation-management__edit-form__item">
            <p>큐레이션 카드 ID</p>
            <input
              type="text"
              placeholder="큐레이션카드 ID"
              value={inputCurationCardId}
              onChange={handleChangeCurationId}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>제목</p>
            <input
              type="text"
              placeholder="제목"
              value={inputTitle}
              onChange={handleChangeTitle}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>주소</p>
            <div className="curation-management__search-bar__wrapper">
              <div className="curation-management__search-bar">
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
          </li>
          <li className="curation-management__edit-form__item">
            <p>좌표</p>
            <input
              type="text"
              placeholder="좌표값 (read only)"
              value={LatLng.toString()}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>상세정보</p>
            <input
              type="text"
              placeholder="상세정보"
              value={inputDesc}
              onChange={handleChangeDesc}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>사진</p>
            <input
              id="curation-card-photo"
              type="file"
              onChange={handleChangePhoto}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>예상시간</p>
            <input
              type="text"
              placeholder="예상시간"
              value={inputTime}
              onChange={handleChangeTime}
            />
          </li>
          <li className="curation-management__edit-form__item">
            <p>테마</p>
            <input
              type="number"
              placeholder="테마번호"
              value={inputTheme}
              onChange={handleChangeTheme}
              min={0}
              max={5}
            />
          </li>
          <span>0:🍽, 1:☕️, 2:🕹, 3:🚴🏻, 4:🚗, 5:🤔</span>
        </ul>
        <div className="curation-management__edit-form__btns">
          <button
            className="curation-management__edit-form__btn"
            onClick={
              mode === "create"
                ? handleCreateCurationCard
                : handleEditCurationCard
            }
          >
            {mode === "create" ? "등록하기" : "수정하기"}
          </button>
          {mode === "create" ? (
            <></>
          ) : (
            <button
              className="curation-management__edit-form__del-btn"
              onClick={handleDeleteCurationCard}
            >
              삭제하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurationManagement;
