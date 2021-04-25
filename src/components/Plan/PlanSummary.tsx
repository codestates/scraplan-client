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
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_MAP_JS_KEY);
    }
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: desc || `${nickname}님이 일정을 공유했어요!`,
        imageUrl: "http://photo.scraplan.com/asdf%40asdf.asdf%2F2.png",
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
          <div className="plansummary__contents__plan__img">
            <img
              src={`https://source.unsplash.com/random?${Math.floor(
                Math.random() * 100,
              )}/1600x900?blue,water`}
              alt=""
            />
          </div>
          <p className="plansummary__contents__plan__title">{title}</p>
          <div className="plansummary__contents__plan__info">
            <div className="plansummary__contents__plan__info-addr">
              <img src="images/pin.png" alt="" />
              <p>{representAddr.split("-").join(" ")}</p>
            </div>
            <div className="plansummary__contents__plan__info-daycount">
              <img src="/images/clock.png" alt="" />
              <p>
                {dayCount === 1
                  ? `하루일정`
                  : `${dayCount - 1 + "박"} ${dayCount}일`}
              </p>
            </div>
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
          </div>
          <div className="plansummary__contents__plan__share-btn">
            <button onClick={handleShareUrl}>URL로 공유</button>
            <button className=" kakao-link" onClick={handleShareKakao}>
              카톡으로 공유
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanSummary;
