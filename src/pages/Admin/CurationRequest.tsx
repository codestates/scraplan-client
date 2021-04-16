import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  getCurationsRequests,
  getCurationsRequestsResolved,
} from "../../actions";
import "./Admin.scss";

const CurationRequest = ({ setMenu }: any) => {
  const dispatch = useDispatch();
  const statusCode = ["대기중", "처리중", "승인", "미승인"];
  //0, 1, 2, 3 -> pending, processing, resolved, rejected
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    curationReducer,
  } = state;

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [curationRequests, setCurationRequests] = useState<any>([
    {
      id: 0,
      requester: "tester",
      coordinates: [10, 10],
      address: "서울시 강남구 ~~",
      requestTitle: "신청제목1",
      requestComment: "신청이유1",
      requestTheme: 2,
      status: 2,
    },
    {
      id: 1,
      requester: "tester",
      coordinates: [10, 10],
      address: "서울시 성동구 마장동",
      requestTitle: "신청제목2",
      requestComment: "신청이유2",
      requestTheme: 3,
      status: 1,
    },
  ]);
  const [filteredRequests, setFilteredRequests] = useState(curationRequests);

  useEffect(() => {
    // getAllCurationRequests();
  }, [curationRequests]);

  // 0, 1, 2, 3, 4 -> pending, processing, resolved, rejected, deleted
  // status : 0

  const getAllCurationRequests = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body) {
          dispatch(getCurationsRequests(body.curationRequests));
          setCurationRequests(body.curationRequests);
        } else {
        }
      })
      .catch((err) => console.error(err));
  };

  // status : 2
  const handleRequestResolved = (data: any) => {
    // 삭제
    dispatch(getCurationsRequestsResolved(data));
    setMenu("management");
  };

  // status : 0, 1, 3
  const handleRequestUpdate = (id: number, status: number) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-requests`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        authorization: token,
      },
      body: JSON.stringify({
        email,
        id,
        status,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "Successfully updated status") {
          // Modal - 업데이트 성공
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="curation-request">
      <div className="curation-request__menu">
        <button
          className={selectedMenu === null ? "selected" : ""}
          onClick={() => {
            setSelectedMenu(null);
          }}
        >
          전체
        </button>
        <button
          className={selectedMenu === 0 ? "selected" : ""}
          onClick={() => {
            setSelectedMenu(0);
          }}
        >
          대기중
        </button>
        <button
          className={selectedMenu === 1 ? "selected" : ""}
          onClick={() => {
            setSelectedMenu(1);
          }}
        >
          처리중
        </button>
        <button
          className={selectedMenu === 2 ? "selected" : ""}
          onClick={() => {
            setSelectedMenu(2);
          }}
        >
          승인
        </button>
        <button
          className={selectedMenu === 3 ? "selected" : ""}
          onClick={() => {
            setSelectedMenu(3);
          }}
        >
          미승인
        </button>
      </div>
      <p className="curation-request__title">조회 내역</p>
      <div className="curation-request__table">
        <div className="curation-request__table__top-bar">
          <p>상태</p>
          <p>요청번호</p>
          <p>요청자</p>
          <p>제목</p>
          <p>상태</p>
        </div>
        <ul className="curation-request__table__contents">
          {filteredRequests.length > 0 &&
            filteredRequests.map((item: any) => {
              const [showmore, setShowmore] = useState<boolean>(false);
              const {
                id,
                requester,
                coordinates,
                address,
                requestTitle,
                requestComment,
                requestTheme,
                status,
              } = item;
              return (
                <li
                  className="curation-request__table__contents__item"
                  onClick={() => setShowmore(!showmore)}
                >
                  <div className="curation-request__table__contents__item-desc">
                    <p>{status}</p>
                    <p>{id}</p>
                    <p>{requester}</p>
                    <p>{requestTitle}</p>
                    <select
                      onChange={(e) => {
                        handleRequestUpdate(id, Number(e.target.value));
                      }}
                    >
                      <option value={0}>대기중</option>
                      <option value={1}>확인중</option>
                    </select>
                  </div>
                  {showmore ? (
                    <div className="curation-request__table__contents__item-showmore">
                      <p>{`신청이유 : ${requestComment}`}</p>
                      <p>{`주소 : ${address}`}</p>
                      <div className="showmore-btns">
                        <button onClick={() => handleRequestResolved(item)}>
                          승인
                        </button>
                        <button onClick={() => handleRequestUpdate(id, 3)}>
                          거절
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default CurationRequest;
