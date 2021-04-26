import { useEffect, useRef, useState } from "react";
type TutorialProps = {
  open: boolean;
  close: () => void;
};

const Tutorial = (props: TutorialProps) => {
  const { open, close } = props;
  const slideTutorial = useRef<HTMLUListElement>(null);
  const [tutorialIdx, setTutorialIdx] = useState<number>(3);
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }, [open]);

  useEffect(() => {
    // slideTutorial.current?.style.setProperty(
    //   "transition",
    //   "all 1s ease-in-out",
    //   "important",
    // );
    slideTutorial.current?.style.setProperty(
      "transform",
      `translateX(${100 - tutorialIdx * 20}%)`,
      "important",
    );
  }, [tutorialIdx]);

  const handleMoveToPrev = () => {
    setTutorialIdx(tutorialIdx - 1);
  };
  const handleMoveToNext = () => {
    setTutorialIdx(tutorialIdx + 1);
  };

  return (
    <div className={`tutorial ${open ? "show" : ""}`}>
      {open ? (
        <>
          <div className="tutorial__outsider" onClick={close}></div>
          <div className="tutorial__wrapper">
            <button className="tutorial__close-btn" onClick={close}>
              &times;
            </button>
            {tutorialIdx > 3 ? (
              <button className="tutorial__prev-btn" onClick={handleMoveToPrev}>
                <img src="/images/prev-pink.png" alt="" />
              </button>
            ) : (
              <></>
            )}
            {tutorialIdx < 7 ? (
              <button
                className="tutorial__next-btn"
                onClick={tutorialIdx < 7 ? handleMoveToNext : close}
              >
                <img src="/images/next-pink.png" alt="" />
              </button>
            ) : (
              <></>
            )}
            <div className="tutorial__img">
              <ul className="tutorial__img-list" ref={slideTutorial}>
                <li className="tutorial__img-item">
                  <img src="/images/tutorial/tutorial1.png" alt="" />
                </li>
                <li className="tutorial__img-item">
                  <img src="/images/tutorial/tutorial2.png" alt="" />
                </li>
                <li className="tutorial__img-item">
                  <img src="/images/tutorial/tutorial3.png" alt="" />
                </li>
                <li className="tutorial__img-item">
                  <img src="/images/tutorial/tutorial4.png" alt="" />
                </li>
                <li className="tutorial__img-item tip">
                  <img src="/images/tutorial/tutorial5.png" alt="" />
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Tutorial;
