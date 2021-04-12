import React, { useCallback, useState } from "react";
import PlanTimeline from "./PlanTimeline";

const PlanList = () => {
  const [openList, setOpenList] = useState<boolean>(true);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [isShare, setIsShaer] = useState<boolean>(true);
  const [publicToggleChecked, setPublicToggleChecked] = useState<boolean>(
    false,
  );

  const handleListState = useCallback(() => {
    setOpenList(!openList);
  }, [openList]);

  const handleInputTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputTitle(e.target?.value);
    },
    [inputTitle],
  );

  const handlePublicToggle = () => {
    setPublicToggleChecked(!publicToggleChecked);
  };

  // 지역 정하기 => input list 사용
  return (
    <div className="planlist">
      <div className="planlist__toggle" onClick={handleListState}>
        <img src="/images/prev-pink.png"></img>
      </div>
      <div className={`planlist__wrapper ${openList ? "" : "disappear"}`}>
        <div className="planlist__content">
          <div className="planlist__title">
            <input
              className="planlist__title__input"
              value={inputTitle}
              onChange={handleInputTitle}
              placeholder="제목을 입력하세요"
            />
            <p className="planlist__public-toggle__switch-text">
              {publicToggleChecked ? "🔒" : "🔓"}
            </p>
            <div className="planlist__public-toggle">
              <input
                type="checkbox"
                className="planlist__public-toggle__switch-checkbox"
                checked={publicToggleChecked}
                onChange={handlePublicToggle}
                id="switch-input"
              />

              <label
                htmlFor="switch-input"
                className="planlist__public-toggle__switch-label"
              >
                <div
                  className={`planlist__public-toggle__ball ${
                    publicToggleChecked ? "moveToRight" : ""
                  }`}
                ></div>
              </label>
            </div>
          </div>
          <span className="planlist__represent-address">
            {"시 > 군구 > 동"}
          </span>
          <div className="planlist__dailyplan">
            <div className="planlist__dailyplan__top-bar">
              <button className="planlist__dailyplan__top-bar__prev">
                {"<"}
              </button>
              {/* <input>Day</input> */}
              <div className="planlist__dailyplan__top-bar__select-day">
                Day1
              </div>
              <button className="planlist__dailyplan__top-bar__next">
                {">"}
              </button>
            </div>
            <div className="planlist__dailyplan__plancards">
              <div className="planlist__dailyplan__plancards__grid">
                {Array(48)
                  .fill(true)
                  .map((grid, idx) => {
                    return (
                      <div>
                        <span>{`${Math.floor(idx / 2)}:${
                          (idx * 30) % 60 === 0 ? "00" : "30"
                        }`}</span>
                      </div>
                    );
                  })}
              </div>
              <PlanTimeline />
            </div>
          </div>
          <div className="planlist__save">
            <button className="planlist__save__button">저장하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanList;
