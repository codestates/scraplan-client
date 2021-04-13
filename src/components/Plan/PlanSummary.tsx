import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { notify } from "../../actions";
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
};

const PlanSummary = (props: PlanSummaryProps) => {
  const { id, title, desc, writer, dayCount, representAddr } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const [toggleShareBtn, setToggleShareBtn] = useState<boolean>(false);

  useEffect(() => {}, []);

  const handleToggleShareBtn = () => {
    setToggleShareBtn(!toggleShareBtn);
  };

  const handleClickShowmore = () => {
    history.push(`/planpage/${id}`);
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

  return (
    <div className="plansummary">
      <div className="plansummary__contents__plan">
        <span className="plansummary__contents__plan__title">{title}</span>
        <p className="plansummary__contents__plan__info">
          {`${representAddr}   |   ${dayCount}박 ${dayCount + 1}일`}{" "}
        </p>
        <span className="plansummary__contents__plan__description">
          {desc} 여행을 떠나요
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
          <button className="plansummary__contents__plan-hover__cancel-btn">
            &times;
          </button>
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
  );
};

export default PlanSummary;
