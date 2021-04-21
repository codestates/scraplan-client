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
  const statusCode = ["대기중", "처리중", "승인완료", "미승인"];
  //0, 1, 2, 3 -> pending, processing, resolved, rejected
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    curationReducer: { curationRequests },
  } = state;

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [filteredRequests, setFilteredRequests] = useState(curationRequests);

  useEffect(() => {
    getAllCurationRequests();
  }, []);

  const getAllCurationRequests = () => {
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/curation-requests/${email}/?isAdmin=${true}&pagenation=${1}`,
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
        dispatch(getCurationsRequests(body.curationRequests));
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
    fetch(`${process.env.REACT_APP_SERVER_URL}/curation-request`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
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
          <p>상태변경</p>
        </div>
        <ul className="curation-request__table__contents">
          {curationRequests &&
            curationRequests.length > 0 &&
            curationRequests.map((item: any) => {
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
                    <p>{statusCode[status]}</p>
                    <p>{id}</p>
                    <p>{requester}</p>
                    <p>{requestTitle}</p>
                    <select
                      onChange={(e) => {
                        handleRequestUpdate(id, Number(e.target.value));
                      }}
                    >
                      <option value={0} selected={status === 0 ? true : false}>
                        대기중
                      </option>
                      <option value={1} selected={status !== 0 ? true : false}>
                        확인중
                      </option>
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
