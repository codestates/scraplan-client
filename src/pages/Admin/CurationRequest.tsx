import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  getCurationsRequests,
  getCurationsRequestsResolved,
} from "../../actions";
import "./Admin.scss";
import CurationAdminRequestItem from "../../components/Curation/CurationAdminRequestItem";

const CurationRequest = ({ setMenu }: any) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    curationReducer: { curationRequests },
  } = state;

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  // const [filteredRequests, setFilteredRequests] = useState(curationRequests);

  const [curationsRequestsList, setCurationsRequestsList] = useState<any>([]);
  const [
    curationsRequestsFetching,
    setcurationsRequestsFetching,
  ] = useState<boolean>(false);
  const [
    scrollcurationsRequestsPage,
    setScrollcurationsRequestsPage,
  ] = useState<number>(1);

  useEffect(() => {
    getAllCurationRequests();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

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
        setCurationsRequestsList(body.curationRequests);
        setcurationsRequestsFetching(true);
        setScrollcurationsRequestsPage(scrollcurationsRequestsPage + 1);
      })
      .catch((err) => console.error(err));
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight && curationsRequestsFetching) {
      fetchMoreCurationRequestsList();
    }
  };

  const fetchMoreCurationRequestsList = () => {
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/curation-requests/${email}/?isAdmin=${true}&pagenation=${scrollcurationsRequestsPage}`,
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
        if (body.curationRequests.length === 0) {
          setScrollcurationsRequestsPage(0);
          setcurationsRequestsFetching(false);
        } else {
          dispatch(
            getCurationsRequests([
              ...curationsRequestsList,
              ...body.curationRequests,
            ]),
          );
          setCurationsRequestsList([
            ...curationsRequestsList,
            ...body.curationRequests,
          ]);
          setScrollcurationsRequestsPage(scrollcurationsRequestsPage + 1);
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
          {curationsRequestsList &&
            curationsRequestsList.length > 0 &&
            curationsRequestsList.map((item: any) => {
              return (
                <CurationAdminRequestItem
                  item={item}
                  handleRequestUpdate={handleRequestUpdate}
                  handleRequestResolved={handleRequestResolved}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default CurationRequest;
