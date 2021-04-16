import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getPlanCards } from "../../actions";
import RGL, { WidthProvider } from "react-grid-layout";
import SetTime from "../UI/SetTime";
import SetTheme from "../UI/SetTheme";
import "./PlanTimeline.scss";
import "./Plan.scss";
import { filter } from "lodash";

const ReactGridLayout = WidthProvider(RGL);

const PlanTimeline = ({
  day,
  saveBtnClicked,
  setSaveBtnClicked,
  handleSavePlanBtn,
  filterByDay,
  setFilterByDay,
  oneDayPlanList,
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

  console.log("값의 변화들 1 planCardsList", planCardsList);
  console.log("값의 변화들 2 planCards", planCards);
  console.log("값의 변화들 3 oneDayPlanList", oneDayPlanList);

  useEffect(() => {
    console.log("첫번째 useEffect");
    setLayoutState(generateLayout());
    setPlanCardsList(oneDayPlanList);
  }, []);

  useEffect(() => {
    console.log("두번째 useEffect");
    setLayoutState(generateLayout());
    setPlanCardsList(oneDayPlanList);
  }, [oneDayPlanList, filterByDay, planCards]);

  // Day별로 필터링 하는 용도
  // Timeline에서 드래그앤드랍으로 수정할때마다 변경하는걸 알아야할듯?!
  // 그래야 다시 필터링해서 정렬이 가능..!
  useEffect(() => {
    if (saveBtnClicked) {
      handleSaveBtn();
      setSaveBtnClicked(false);
    }
  }, [saveBtnClicked]);
  // 저장버튼 클릭 시 변경 된 startTime, endTime이 저장된다.
  useEffect(() => {
    console.log("순서 2 planCardsList", planCardsList);
    console.log("순서 3 layoutState", layoutState);
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

  const generateLayout = () => {
    console.log("순서 1 oneDayPlanList", oneDayPlanList);
    return (oneDayPlanList || []).map((plancard, idx) => {
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

  // Timeline에 있는 일정들을 PlanCards 데이터로 변환
  const handleSaveBtn = () => {
    // 드래그앤 드랍할때마다 planCardsList에 저장된다.
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
        console.log("저장 시 day 및 값들", day, newPlan);
        return newPlan;
      });
      console.log("저장 시 filterByDay = 동일해야한다..!", filterByDay);
      // console.log("이 값을", newPlanCardsList);
      // console.log("여기서 갈아끼워야 함", filterByDay[day - 1]);
      filterByDay[day - 1] = newPlanCardsList;
      // console.log("이렇게 바꾸면 되나?", filterByDay[day - 1]);
      setPlanCardsList(newPlanCardsList);
      handleSavePlanBtn();
      // dispatch(getPlanCards({ planCards: newPlanCardsList }));
    }
  };

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
