import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { notify } from "../../actions";
import { RootState } from "../../reducers";
import Modal from "../UI/Modal";
import "./Plan.scss";

declare global {
  interface Window {
    Kakao: any;
  }
}

type PlanSummaryProps = {
  id: number;
  title: string;
  desc: string;
  writer: string;
  dayCount: number;
  representAddr: string;
  handleGetAllPlans?: any;
};

const PlanSummary = (props: PlanSummaryProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    id,
    title,
    desc,
    writer,
    dayCount,
    representAddr,
    handleGetAllPlans,
  } = props;
  const userState = useSelector((state: RootState) => state.userReducer);
  const {
    user: { token, email, nickname },
  } = userState;

  const [toggleShareBtn, setToggleShareBtn] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleToggleShareBtn = () => {
    setToggleShareBtn(!toggleShareBtn);
  };

  const handleClickShowmore = () => {
    history.push({
      pathname: `/planpage/${id}`,
      state: {
        title,
        desc,
        representAddr,
      },
    });
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleShareKakao = () => {
    window.Kakao.init(process.env.REACT_APP_KAKAO_MAP_JS_KEY);
    window.Kakao.isInitialized();
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: desc,
        imageUrl:
          "http://mud-kage.kakao.co.kr/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
        link: {
          mobileWebUrl: `${process.env.REACT_APP_CLIENT_URL}/planpage/${id}`,
          androidExecParams: "test",
        },
      },
      buttons: [
        {
          title: "scraplan에서 보기",
          link: {
            mobileWebUrl: `${process.env.REACT_APP_CLIENT_URL}/planpage/${id}`,
          },
        },
      ],
    });
  };

  const handleShareUrl = () => {
    let dummy = document.createElement("input");
    let text = process.env.REACT_APP_CLIENT_URL + `/planpage/${id}`;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    dispatch(notify(`클립보드 복사 완료 🙌🏻`));
  };

  const handleDeletePlan = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/plan`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        email,
        planId: id,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        handleModalClose();
        if (handleGetAllPlans) {
          handleGetAllPlans();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Modal
        modalType={"yesNoModal"}
        open={openModal}
        close={handleModalClose}
        comment={"일정을 삭제하시겠어요?"}
        handleAcceptAction={handleDeletePlan}
      />
      <div className="plansummary">
        <div className="plansummary__contents__plan">
          <span className="plansummary__contents__plan__title">{title}</span>
          <p className="plansummary__contents__plan__info">
            {dayCount === 1
              ? `${representAddr}   |   하루일정`
              : `${representAddr}   |   ${dayCount - 1 + "박"} ${dayCount}일`}
          </p>
          <span className="plansummary__contents__plan__description">
            {desc}
          </span>
          <div className="plansummary__contents__plan__showmore">
            <img src="/images/next.png" alt="" />
            <p
              className="plansummary__contents__plan__showmore-text"
              onClick={handleClickShowmore}
            >
              일정보러가기
            </p>
          </div>
          <div className="plansummary__contents__plan-hover">
            {nickname === writer ? (
              <button
                className="plansummary__contents__plan-hover__cancel-btn"
                onClick={handleModalOpen}
              >
                &times;
              </button>
            ) : (
              <></>
            )}

            <button
              className="plansummary__contents__plan-hover__share-btn"
              onClick={handleToggleShareBtn}
            >
              <img src="images/share.png" alt=""></img>
              <div
                className={`plansummary__share-btn__list ${
                  toggleShareBtn ? "" : "hidden"
                }`}
              >
                <button className="kakao-link" onClick={handleShareKakao}>
                  카톡으로 공유하기
                </button>
                <button onClick={handleShareUrl}>URL로 공유하기</button>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanSummary;
