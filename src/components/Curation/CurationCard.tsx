import React from "react";
import { useHistory } from "react-router-dom";

interface CurationCardProps {
  props: {
    curationCardId: number;
    theme: number;
    title: string;
    detail: string;
    photo: string;
    avgTime: number;
    feedbackCnt: number;
  };
}

const CurationCard = ({ props }: CurationCardProps) => {
  const {
    curationCardId,
    theme,
    title,
    detail,
    photo,
    avgTime,
    feedbackCnt,
  } = props;
  const themeList = ["🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"];
  const history = useHistory();
  const handleClickCurationCard = () => {
    history.push(`/viewcuration/${curationCardId}`);
  };
  return (
    <li className="curation-card" onClick={handleClickCurationCard}>
      <div className="curation-card__info">
        <div className="curation-card__info__theme">
          <span>{`${themeList[theme]}`}</span>
        </div>
        <div className="curation-card__info__desc">
          <span className="curation-card__info__desc-title">{title}</span>
          <div className="curation-card__info__desc-summary">
            <span>{`⏱ ${avgTime}H`}</span>
            <span>{`피드백 ${feedbackCnt}개`}</span>
          </div>
        </div>
      </div>
      <div className="curation-card__add-btn">✚</div>
      <div className="curation-card__add-btn-desc">내일정에 추가</div>
    </li>
  );
};

export default CurationCard;
