import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getPlanCards } from "../../actions";
import RGL, { WidthProvider } from "react-grid-layout";
import SetTime from "../UI/SetTime";
import SetTheme from "../UI/SetTheme";
import "./PlanTimeline.scss";
import "./Plan.scss";

const ReactGridLayout = WidthProvider(RGL);

const PlanTimeline = ({
  saveBtnClicked,
  setSaveBtnClicked,
  handleSavePlanBtn,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    userReducer: {
      user: { token, email, nickname },
    },
    planReducer: {
      planCards: { isValid, isMember, planCards },
    },
  } = state;

  const [layoutState, setLayoutState] = useState({ layout: [] });
  const [planCardsList, setPlanCardsList] = useState([]);

  useEffect(() => {
    setLayoutState(generateLayout());
    setPlanCardsList(planCards);
  }, []);

  useEffect(() => {
    if (saveBtnClicked) {
      handleSaveBtn();
      setSaveBtnClicked(false);
    }
  }, [saveBtnClicked]);

  useEffect(() => {
    if (planCardsList) {
      let newPlanCardsList = planCardsList.map((plan, idx) => {
        let startHour = Math.floor(layoutState[idx].y / 4);
        let startMin =
          (layoutState[idx].y % 4) * 15 === 0
            ? "00"
            : (layoutState[idx].y % 4) * 15;

        let endHour = Math.floor((layoutState[idx].y + layoutState[idx].h) / 4);
        let endMin =
          ((layoutState[idx].y + layoutState[idx].h) % 4) * 15 === 0
            ? "00"
            : ((layoutState[idx].y + layoutState[idx].h) % 4) * 15;

        let newPlan = Object.assign({}, plan, {
          startTime: startHour + ":" + startMin,
          endTime: endHour + ":" + endMin,
        });
        return newPlan;
      });
      if (newPlanCardsList.length !== 0) {
        setPlanCardsList(newPlanCardsList);
      }
    }
  }, [layoutState]);
  console.log(planCards);

  useEffect(() => {
    setLayoutState(generateLayout());
    setPlanCardsList(planCards);
  }, [planCards]);

  const generateLayout = () => {
    return (planCards || []).map((plancard, idx) => {
      const { startTime, endTime } = plancard;
      const startHour = Number(startTime.split(":")[0]);
      const startMin = Number(startTime.split(":")[1]);
      const endHour = Number(endTime.split(":")[0]);
      const endMin = Number(endTime.split(":")[1]);
      return {
        w: 1,
        x: 0,
        h: endHour * 4 + endMin / 15 - startHour * 4 - startMin / 15, // 높이
        y: startHour * 4 + startMin / 15, // 위치
        i: idx.toString(),
        moved: false,
        static: false,
      };
    });
  };

  const onLayoutChange = (layout) => {
    setLayoutState(layout);
  };

  const handleSaveBtn = () => {
    if (planCardsList) {
      // 변경된 layout을 -> 새 일정으로 등록! (setPlanCardsList)
      let newPlanCardsList = planCardsList.map((plan, idx) => {
        // console.log("plan", plan);
        // console.log("layout", layoutState[idx]);

        // y,h -> startTime, endTime 변환
        let startHour = Math.floor(layoutState[idx].y / 4);
        let startMin =
          (layoutState[idx].y % 4) * 15 === 0
            ? "00"
            : (layoutState[idx].y % 4) * 15;

        let endHour = Math.floor((layoutState[idx].y + layoutState[idx].h) / 4);
        let endMin =
          ((layoutState[idx].y + layoutState[idx].h) % 4) * 15 === 0
            ? "00"
            : ((layoutState[idx].y + layoutState[idx].h) % 4) * 15;

        let newPlan = Object.assign({}, plan, {
          startTime: startHour + ":" + startMin,
          endTime: endHour + ":" + endMin,
        });
        return newPlan;
      });
      setPlanCardsList(newPlanCardsList);
      handleSavePlanBtn(newPlanCardsList);
      dispatch(getPlanCards({ planCards: newPlanCardsList }));
    }
  };

  // console.log("layoutState", layoutState);
  // console.log("newPlanCardsList", planCardsList);

  return (
    <ReactGridLayout
      id="plantimeline"
      layout={layoutState}
      onLayoutChange={onLayoutChange}
      {...{
        isDraggable: true,
        isResizable: true,
        items: (planCardsList || []).length,
        rowHeight: 28,
        cols: 1,
        rows: 96,
        compactType: null,
        preventCollision: true,
        transformScale: 1,
        width: 240,
      }}
    >
      {planCardsList &&
        planCardsList.map((plancard, idx) => {
          const {
            day,
            startTime,
            endTime,
            comment,
            theme,
            coordinates,
            address,
          } = plancard;

          const handleChangeTheme = (themeIndex, cardIdx) => {
            planCardsList[cardIdx].theme = themeIndex;
          };

          const handleDeletePlancard = (e, cardIdx) => {
            setPlanCardsList(
              planCardsList.filter((card, idx) => {
                return idx !== cardIdx;
              }),
            );
            setLayoutState(
              layoutState.filter((_, idx) => {
                return idx !== cardIdx;
              }),
            );
          };

          return (
            <div className="plancard" key={idx}>
              <SetTheme
                themeIndex={theme}
                giveThemeIndexToParent={(themeIndex) =>
                  handleChangeTheme(themeIndex, idx)
                }
              />
              <SetTime
                startTime={startTime}
                endTime={endTime}
                readonly={true}
              />
              <div className="plancard__title">{comment}</div>
              <button
                className="plancard__delete-btn"
                onClick={(e) => handleDeletePlancard(e, idx)}
              >
                ⓧ
              </button>
            </div>
          );
        })}
    </ReactGridLayout>
  );
};
export default PlanTimeline;
