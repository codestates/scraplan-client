import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { signIn } from "../../actions";
import Modal from "../UI/Modal";
import "./Curation.scss";

type CurationRequestItemProps = {
  id: number;
  title: string;
  requester: string;
  coordinates: [];
  address: string;
  requestComment: string;
  requestTheme: number;
  status: number;
};

const CurationRequestItem = ({ props }: any) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userReducer);
  const statusCode = ["대기중", "처리중", "승인완료", "요청취소"];
  //0, 1, 2, 3 -> pending, processing, resolved, rejected
  const {
    id,
    title,
    requester,
    coordinates,
    address,
    requestComment,
    requestTheme,
    status,
  } = props;
  const {
    user: { token, email, nickname },
  } = userState;

  const [showmore, setShowmore] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleShowmoreBtn = (): void => {
    setShowmore(!showmore);
  };

  const handleCurationRequestCancelBtn = (): void => {
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
        status: 3,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        switch (body.message) {
          case "successfully updated status":
            setModalComment("요청이 정상 처리되었습니다. 👏🏻");
            setOpenModal(true);
            break;
          case "Expired token":
          case "Invalid token":
          case "Expired token or Not matched inform":
            dispatch(signIn("", email, ""));
            break;
          default:
            setModalComment("정보가 부족합니다 😨");
            setOpenModal(true);
            break;
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Modal
        modalType="alertModal"
        open={openModal}
        close={() => setOpenModal(false)}
        comment={modalComment}
      />
      <div className="mypage__contents__req-table__item">
        <div className="mypage__contents__req-table__item__details">
          <div
            className="mypage__contents__req-table__item__details__texts"
            onClick={handleShowmoreBtn}
          >
            <p>31232</p>
            <p>
              <span className="mypage__contents__req-table__item__details__texts-status">
                {statusCode[status]}
              </span>
            </p>
            <p>{title}</p>
          </div>
          <div className="mypage__contents__req-table__item__details__btns">
            <button
              onClick={handleShowmoreBtn}
              className="mypage__contents__req-table__item__details__btns-showmore"
            >
              {showmore ? "접기" : "더보기"}
            </button>
            {status === 3 ? (
              <button
                className="mypage__contents__req-table__item__details__btns-cancel"
                onClick={handleCurationRequestCancelBtn}
              >
                취소
              </button>
            ) : (
              <button className="mypage__contents__req-table__item__details__btns-limited">
                취소불가
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className={`mypage__contents__req-table__item-showmore ${
          showmore ? "" : "hidden"
        }`}
      >
        <div className="mypage__contents__req-table__item-showmore__text">
          <h4>위치</h4>
          <p>{address}</p>
        </div>
        <div className="mypage__contents__req-table__item-showmore__text">
          <h4>설명</h4>
          <p>{requestComment}</p>
        </div>
      </div>
    </>
  );
};

export default CurationRequestItem;
