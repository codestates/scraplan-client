import React, { useCallback, useEffect, useState } from "react";

interface TimeProps {
  startTime?: string;
  endTime?: string;
  giveTimeToParent?: (period: string) => void;
  readonly?: boolean;
}

const SetTime = ({
  startTime,
  endTime,
  giveTimeToParent,
  readonly,
}: TimeProps) => {
  const [currentTime, setCurrentTime] = useState<string>("1:00");
  const [isSelectTime, setIsSelectTime] = useState<boolean>(false);

  useEffect(() => {
    if (startTime && endTime) {
      setCurrentTime(getTimeFromProps(startTime, endTime));
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setIsSelectTime(false);
    });
  }, [isSelectTime]);
  // 추가할때가 아닌 서버로 부터 받은 startTime, endTime이 존재할 경우 사이 시간을 구하는 함수
  const getTimeFromProps = useCallback(
    (startTime: string, endTime: string) => {
      let period =
        Number(endTime.split(":")[0]) * 60 +
        Number(endTime.split(":")[1]) -
        (Number(startTime.split(":")[0]) * 60 +
          Number(startTime.split(":")[1]));
      let periodMin = period % 60;
      let periodHour = Math.floor(period / 60);
      return `${periodHour}:${periodMin === 0 ? "00" : periodMin}`;
    },
    [startTime, endTime],
  );

  // 0:15 ~ 6:00 까지 리스트
  const selectTimeList = () => {
    let x = 0;
    let y = 0;
    const timeList = [];
    while (x < 6) {
      if (y === 45) {
        x++;
        y = 0;
        timeList.push(`${x}:00`);
      } else {
        y += 15;
        timeList.push(`${x}:${y}`);
      }
    }
    return timeList;
  };

  const handleInputTime = (time: string): void => {
    if (giveTimeToParent) {
      giveTimeToParent(time);
    }
    setIsSelectTime(false);
    setCurrentTime(time);
  };

  return (
    <div className="set-time">
      <div
        className="set-time__text"
        onClick={() => setIsSelectTime(!isSelectTime)}
      >
        <div className="set-time__text__currentTime">{currentTime}</div>
        <div className="set-time__text__unit">H</div>
      </div>
      {readonly ? (
        <></>
      ) : (
        <div
          className={`${isSelectTime ? "" : "hidden"} set-time__input-wrapper `}
        >
          {isSelectTime ? (
            <ul className={`${isSelectTime ? "" : "hidden"}`}>
              {selectTimeList().map((time, idx) => {
                return (
                  <li
                    className={`${isSelectTime ? "" : "hidden"}`}
                    key={idx}
                    value={time}
                    onClick={() => handleInputTime(time)}
                  >
                    {time}
                  </li>
                );
              })}
            </ul>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default SetTime;
