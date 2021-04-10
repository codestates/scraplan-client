import React, { useCallback, useState } from "react";
import "./Curation.scss";

const CurationList = () => {
  const [openList, setOpenList] = useState<boolean>(false);

  const handleListState = useCallback(() => {
    setOpenList(!openList);
  }, [openList]);

  return (
    <div className="curationlist">
      <div className={`curationlist__wrapper ${openList ? "" : "disappear"}`}>
        <div className="curationlist__content">
          <div className="curationlist__content__title">큐레이션 찾기</div>
          <div className="curationlist__content__order-by">
            대충 시간정렬하기
          </div>
          <ul className="curationlist__content__cards"></ul>
        </div>
      </div>
      <div className="curationlist__toggle" onClick={handleListState}>
        <img src="/images/next-pink.png"></img>
      </div>
    </div>
  );
};

export default CurationList;
