import React, { useCallback, useRef, useState } from "react";
import SetTheme from "../UI/SetTheme";
import SetTime from "../UI/SetTime";

interface AddTypeProps {
  type: string | null; // addPlan, requestCuration
  open: boolean;
  close: () => void;
}

const AddPlan = ({ type, open, close }: AddTypeProps) => {
  const [typeState, setTypeState] = useState<string>("");
  const [inputTitle, setInputTitle] = useState<string>("");
  const refTitle = useRef<HTMLInputElement>(null);

  // 저장하기 버튼 클릭했을 때 inputTitle에 아무것도 안적혀있으면 포커스
  const handleSubmitBtn = useCallback(() => {
    if (inputTitle === "") {
      refTitle.current?.focus();
    }
  }, []);

  return (
    <>
      {open ? (
        <div className="addPlan">
          <button className="addPlan__cancle-btn" onClick={close}>
            &times;
          </button>
          <div className="addPlan__wrapper">
            <div className="addPlan__select-box">
              <SetTheme />
              <SetTime />
            </div>
            <input
              type="text"
              placeholder="일정 제목을 입력해주세요."
              className="addPlan__title"
              ref={refTitle}
            ></input>
            <div className="addPlan__address">
              <img src="/images/placeholder.png" />
              <input></input>
            </div>
            <button className="addPlan__submit-btn" onClick={handleSubmitBtn}>
              추가하기
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddPlan;
