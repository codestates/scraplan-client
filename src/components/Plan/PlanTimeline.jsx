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
      planList: { isValid, isMember, planCards },
    },
  } = state;

  const [layoutState, setLayoutState] = useState([]);
  const [genCnt, setGenCnt] = useState(0);

  // console.log("day", day);
  // console.log("filterByDay", filterByDay);
  // console.log("layoutState", layoutState);

  // 초기 레이아웃 생성
  useEffect(() => {
    setLayoutState(generateLayout());
  }, []);

  useEffect(() => {
    if (saveBtnClicked) {
      handleSaveBtn();
      setSaveBtnClicked(false);
    }
  }, [saveBtnClicked]);

  useEffect(() => {
    // if (
    //   filterByDay &&
    //   filterByDay[day - 1] &&
    //   layoutState &&
    //   layoutState.length !== 0 &&
    //   layoutState.length === filterByDay[day - 1].length
    // ) {
    //   console.log("layout이 바뀔때마다");
    //   // 시간 변환
    //   let newPlanCardsList = layoutState.map((plan, idx) => {
    //     // let startHour = Math.floor(layoutState[idx].y / 4);
    //     // let startMin =
    //     //   (layoutState[idx].y % 4) * 15 === 0
    //     //     ? "00"
    //     //     : (layoutState[idx].y % 4) * 15;
    //     // let endHour = Math.floor((layoutState[idx].y + layoutState[idx].h) / 4);
    //     // let endMin =
    //     //   ((layoutState[idx].y + layoutState[idx].h) % 4) * 15 === 0
    //     //     ? "00"
    //     //     : ((layoutState[idx].y + layoutState[idx].h) % 4) * 15;
    //     const { startTime, endTime } = plan;
    //     const startHour = Number(startTime.split(":")[0]);
    //     const startMin = Number(startTime.split(":")[1]);
    //     const endHour = Number(endTime.split(":")[0]);
    //     const endMin = Number(endTime.split(":")[1]);
    //     let newPlan = Object.assign({}, plan, {
    //       startTime: startHour + ":" + startMin,
    //       endTime: endHour + ":" + endMin,
    //     });
    //     return newPlan;
    //   });
    //   if (
    //     filterByDay !==
    //     [
    //       ...filterByDay.slice(0, day - 1),
    //       newPlanCardsList,
    //       ...filterByDay.slice(day),
    //     ]
    //   ) {
    //     console.log("set!");
    //     setFilterByDay([
    //       ...filterByDay.slice(0, day - 1),
    //       newPlanCardsList,
    //       ...filterByDay.slice(day),
    //     ]);
    //   }
    // }
  }, [layoutState]);

  const generateLayout = () => {
    if (filterByDay[day - 1] && filterByDay[day - 1].length !== 0) {
      return filterByDay[day - 1].map((plancard, idx) => {
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
    }
  };

  const onLayoutChange = (layout) => {
    // console.log("layout", layout);
    setLayoutState(generateLayout());
    if (
      filterByDay &&
      filterByDay[day - 1] &&
      layoutState &&
      layoutState.length !== 0 &&
      layoutState.length === filterByDay[day - 1].length
    ) {
      // console.log("layout이 바뀔때마다");
      // console.log(filterByDay);
      // 시간 변환
      let newPlanCardsList = filterByDay[day - 1].map((plan, idx) => {
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
        // const { startTime, endTime } = plan;
        // const startHour = Number(startTime.split(":")[0]);
        // const startMin = Number(startTime.split(":")[1]);
        // const endHour = Number(endTime.split(":")[0]);
        // const endMin = Number(endTime.split(":")[1]);
        let newPlan = Object.assign({}, plan, {
          startTime: startHour + ":" + startMin,
          endTime: endHour + ":" + endMin,
        });
        return newPlan;
      });
      setFilterByDay([
        ...filterByDay.slice(0, day - 1),
        newPlanCardsList,
        ...filterByDay.slice(day),
      ]);
    }
  };

  // Timeline에 있는 일정들을 PlanCards 데이터로 변환
  const handleSaveBtn = () => {
    if (filterByDay[day - 1] && filterByDay[day - 1].length !== 0) {
      let newPlanCardsList = filterByDay[day - 1].map((plan, idx) => {
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
      filterByDay[day - 1] = newPlanCardsList;
      setFilterByDay([
        ...filterByDay.slice(0, day - 1),
        newPlanCardsList,
        ...filterByDay.slice(day),
      ]);
      handleSavePlanBtn();
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
        items: (filterByDay[day - 1] || []).length,
        rowHeight: 28,
        cols: 1,
        rows: 96,
        compactType: null,
        preventCollision: true,
        transformScale: 1,
        width: 240,
      }}
    >
      {filterByDay &&
        filterByDay[day - 1] &&
        filterByDay[day - 1].map((plancard, idx) => {
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
            filterByDay[day - 1][cardIdx].theme = themeIndex;
          };

          const handleDeletePlancard = (e, cardIdx) => {
            // 수정필요
            setFilterByDay(
              ...filterByDay.slice(0, day - 1),
              [
                filterByDay[day - 1].filter((card, idx) => {
                  return idx !== cardIdx;
                }),
              ],
              ...filterByDay.slice(day),
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
