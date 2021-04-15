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
        h: endHour * 4 + endMin / 15 - startHour * 4 + startMin / 15, // 높이
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
      // console.log("new", newPlan);
    });
    setPlanCardsList(newPlanCardsList);
    handleSavePlanBtn(newPlanCardsList);
    dispatch(getPlanCards(newPlanCardsList));
    console.log(newPlanCardsList);
  };

  // console.log("layoutState", layoutState);

  return (
    <ReactGridLayout
      id="plantimeline"
      layout={layoutState}
      onLayoutChange={onLayoutChange}
      {...{
        isDraggable: true,
        isResizable: true,
        items: planCardsList.length,
        rowHeight: 28,
        cols: 1,
        rows: 96,
        compactType: null,
        preventCollision: true,
        transformScale: 1,
        width: 240,
      }}
    >
      {planCardsList.map((plancard, idx) => {
        const {
          day,
          startTime,
          endTime,
          comment,
          theme,
          coordinates,
          address,
        } = plancard;
        return (
          <div className="plancard" key={idx}>
            <SetTheme />
            <SetTime />
            <div className="plancard__title">{comment}</div>
            <button className="plancard__delete-btn">ⓧ</button>
          </div>
        );
      })}
    </ReactGridLayout>
  );
};
export default PlanTimeline;
