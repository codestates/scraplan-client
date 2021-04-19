import React, { useState, useEffect } from "react";
import ViewCuration from "../../pages/ViewCuration";

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
  addEventFunc: any;
}

const CurationCard = ({ props, addEventFunc }: CurationCardProps) => {
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

  const [openViewCuration, setOpenViewCuration] = useState<boolean>(false);

  const handleViewCurationOpen = () => {
    setOpenViewCuration(true);
  };
  const handleViewCurationClose = () => {
    setOpenViewCuration(false);
  };

  return (
    <li className="curation-card" onClick={handleViewCurationOpen}>
      <ViewCuration
        open={openViewCuration}
        close={handleViewCurationClose}
        curationCard={props}
      />
      <div className="curation-card__info">
        <div className="curation-card__info__theme">
          <span>{`${themeList[theme]}`}</span>
        </div>
        <div className="curation-card__info__desc">
          <span className="curation-card__info__desc-title">{title}</span>
          <div className="curation-card__info__desc-summary">
            <span>{`⏱ ${avgTime === 0 ? 1 : avgTime}H`}</span>
            <span>{`피드백 ${feedbackCnt}개`}</span>
          </div>
        </div>
      </div>
      <div
        className="curation-card__add-btn"
        onClick={(e) => addEventFunc(props, e)}
      >
        ✚
      </div>
      <div className="curation-card__add-btn-desc">내일정에 추가</div>
    </li>
  );
};

export default CurationCard;
