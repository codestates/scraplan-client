import React, { useEffect, useState } from "react";

interface TimeProps {
  startTime?: string;
  endTime?: string;
}

const SetTime = ({ startTime, endTime }: TimeProps) => {
  const [currentTime, setCurrentTime] = useState<string>("1:00");
  const [isSelectTime, setIsSelectTime] = useState<boolean>(false);

  useEffect(() => {
    if (startTime && endTime) {
      setCurrentTime(getTimeFromProps("10:30", "11:15"));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setIsSelectTime(false);
    });
  }, [isSelectTime]);

  const getTimeFromProps = (startTime: string, endTime: string) => {
    const numStartTime = startTime.replace(":", "");
    const numEndTime = endTime.replace(":", "");
    let period;
    if (Number(numEndTime[2]) - Number(numStartTime[2]) < 0) {
      period = Number(numEndTime) - 40 - Number(numStartTime);
    } else {
      period = Number(numEndTime) - Number(numStartTime);
    }
    const hour = Math.floor(period / 100);
    const minute = period - hour * 100;
    if (hour > 0) {
      return `${hour}:${minute}`;
    } else {
      return `0:${minute}`;
    }
  };

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
    </div>
  );
};

export default SetTime;
