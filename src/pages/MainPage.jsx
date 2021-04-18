import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/UI/Navbar";
import scrollEventListener from "../hooks/scrollEventListener";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [page, setPage] = useState(0);
  const [bottomBtn, setBottomBtn] = useState(false);

  const mainRef = useRef();
  const topRef = useRef();
  const firstRef = useRef();
  const secondRef = useRef();
  const thirdRef = useRef();
  const fourthRef = useRef();
  const fifthRef = useRef();
  const footerRef = useRef();

  // const [target, setTarget] = useState(null);
  // const [nextTarget, setNextTarget] = useState(null);

  // useEffect(() => {
  //   setTarget(firstRef.current);
  //   setNextTarget(secondRef.current);
  // }, []);

  // useEffect(() => {
  //   let observer;
  //   if (target) {
  //     observer = new IntersectionObserver(
  //       ([entry]) => {
  //         if (entry.isIntersecting) {
  //           nextTarget.scrollIntoView({
  //             behavior: "smooth",
  //           });
  //         }
  //       },
  //       { threshold: 0.5 },
  //     );
  //     observer.observe(target);
  //     // setTarget(secondRef.current);
  //   }
  //   return () => observer && observer.disconnect();
  // });

  useEffect(() => {
    let observer;
    if (topRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setBottomBtn(!bottomBtn);
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(topRef.current);
    }
    return () => observer && observer.disconnect();
  });

  useEffect(() => {
    const svg = document.getElementById("mainpage__path-move");
    const length = svg.getTotalLength();
    // 시작지점
    svg.style.strokeDasharray = length;
    // 초기설정 - 안보이게
    svg.style.strokeDashoffset = length;
    window.addEventListener("scroll", () => {
      const scrollpercent =
        (document.body.scrollTop + document.documentElement.scrollTop) /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight);
      const draw = length * scrollpercent;
      svg.style.strokeDashoffset = length + draw;
    });
  }, []);

  return (
    <>
      <Navbar currentPage="/" />
      <div className="mainpage">
        <svg
          className="mainpage__path"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1171.12 4898.51"
        >
          <g id="레이어_2" data-name="레이어 2">
            <g id="레이어_1-2" data-name="레이어 1">
              <path
                d="M201.83,4897.28a495.74,495.74,0,0,0-42-109c-31.34-59.29-57.07-78.41-84-128,0,0-31.83-58.63-44.1-148-21.21-154.44,60.65-381.85,234.16-486.06,139.14-83.56,277.52-52.21,291.71-118,10.2-47.29-50.34-115.57-82.35-108-27.26,6.43-45.61,70.62-26.79,89,22.4,21.89,107.16-11.77,150.81-72.27,29.69-41.15,33.25-84.31,35.23-108.25,0,0,4-108.46-70.45-210-42.32-57.74-67.29-46.84-93.27-89-53.34-86.6-24.19-239.24,59.54-324,88.16-89.29,175.84-41.55,288.73-113,105.55-66.81,198.21-203.9,189.52-346-7.54-123.3-89.41-205.44-155.78-272-170.44-171-427.68-311.12-507-241-24,21.19-37.7,66.84-24.3,81.5,15.52,17,75.86,1.61,86.81-28.5,14.91-41-67-92.87-158.75-184-92.48-91.92-214.5-213.2-217.3-340-3.3-149.54,159.16-304.41,316.52-361,226.49-81.5,439-18.13,459.4-89,8.58-29.72-20.19-75.76-43.16-76.51-23.16-.76-52.62,44.09-45.15,76.51,12.4,53.78,130.79,92.06,216.31,70,158.55-40.89,278.12-298.89,210.84-471.55C1100.5,671.54,976.11,622,730.75,524.32,503.8,434,422.56,447.2,283.25,354.3c-124.4-83-199.75-165.57-244.08-259a543,543,0,0,1-34.34-94"
                style={{
                  fill: "none",
                  stroke: "#f5b2b9",
                  strokeMiterlimit: 10,
                  strokeWidth: "10px",
                  opacity: 0.2,
                }}
              />
              <path
                id="mainpage__path-move"
                d="M201.83,4897.28a495.74,495.74,0,0,0-42-109c-31.34-59.29-57.07-78.41-84-128,0,0-31.83-58.63-44.1-148-21.21-154.44,60.65-381.85,234.16-486.06,139.14-83.56,277.52-52.21,291.71-118,10.2-47.29-50.34-115.57-82.35-108-27.26,6.43-45.61,70.62-26.79,89,22.4,21.89,107.16-11.77,150.81-72.27,29.69-41.15,33.25-84.31,35.23-108.25,0,0,4-108.46-70.45-210-42.32-57.74-67.29-46.84-93.27-89-53.34-86.6-24.19-239.24,59.54-324,88.16-89.29,175.84-41.55,288.73-113,105.55-66.81,198.21-203.9,189.52-346-7.54-123.3-89.41-205.44-155.78-272-170.44-171-427.68-311.12-507-241-24,21.19-37.7,66.84-24.3,81.5,15.52,17,75.86,1.61,86.81-28.5,14.91-41-67-92.87-158.75-184-92.48-91.92-214.5-213.2-217.3-340-3.3-149.54,159.16-304.41,316.52-361,226.49-81.5,439-18.13,459.4-89,8.58-29.72-20.19-75.76-43.16-76.51-23.16-.76-52.62,44.09-45.15,76.51,12.4,53.78,130.79,92.06,216.31,70,158.55-40.89,278.12-298.89,210.84-471.55C1100.5,671.54,976.11,622,730.75,524.32,503.8,434,422.56,447.2,283.25,354.3c-124.4-83-199.75-165.57-244.08-259a543,543,0,0,1-34.34-94"
                style={{
                  fill: "none",
                  stroke: "#f5b2b9",
                  strokeMiterlimit: 10,
                  strokeWidth: "10px",
                  opacity: 0.7,
                }}
              />
            </g>
          </g>
        </svg>
        {/* <svg
          className="mainpage__path"
          id="mainpage__path-move"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1171.12 4898.51"
        >
          <g id="레이어_2" data-name="레이어 2">
            <g id="레이어_1-2" data-name="레이어 1">
             
            </g>
          </g>
        </svg> */}
        <button className={`bottom-btn ${bottomBtn ? "fixToBottom" : ""}`}>
          일정 만들러 가기
        </button>

        <button
          className="move-to-top__btn"
          onClick={() => {
            topRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <img src="/images/top.gif" alt="" />
          <p>맨위로</p>
        </button>
        <div
          className="mainpage__page"
          ref={topRef}
          onClick={() => {
            firstRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <div className="mainpage__body">
            <div className="mainpage__texts">
              <div className="mainpage__title">
                즐거운 일정을
                <br />
                만들어보세요!
              </div>
              <div className="mainpage__subtitle">
                다양한 큐레이션들을 바탕으로 <br />
                여러분만의 계획표를 만들고 공유해보세요
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step3.png"
              alt=""
            />
          </div>
        </div>
        {/* <div className="mainpage__btns">
          <button>내일정 만들기</button>
          <button>구경하기</button>
        </div> */}
        <div
          className="mainpage__page"
          ref={firstRef}
          onClick={() => {
            secondRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <div className="mainpage__body">
            <img className="left-img" src="/images/mainpage/step1.png" alt="" />
            <div className="mainpage__texts right-text">
              <div className="mainpage__step">Step 1</div>
              <div className="mainpage__title">
                일단 검색하고
                <br />
                구경하세요
              </div>
              <div className="mainpage__subtitle">
                원하는 지역을 일단 검색해보세요. <br />
                다른 사람들은 그곳에서 어떤 하루를 보낼까요?
              </div>
              <div className="mainpage__next-btn">
                <button>next</button>
              </div>
            </div>
          </div>
        </div>
        <div className="mainpage__page second-step" ref={secondRef}>
          <div className="mainpage__body">
            <div className="mainpage__texts">
              <div className="mainpage__step">Step 2</div>
              <div className="mainpage__title">
                테마, 기간별로
                <br />
                일정을 찾아요
              </div>
              <div className="mainpage__subtitle">
                6개의 테마와 15분 단위의 기간 <br />
                이거다!싶은 큐레이션을 찾아보세요. <br />
                다른 사람들의 의견은 어떨까요?
              </div>
              <div className="mainpage__next-btn">
                <button
                  onClick={() => {
                    thirdRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  next
                </button>
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step2.png"
              alt=""
            />
          </div>
        </div>
        <div className="mainpage__page third-step" ref={thirdRef}>
          <div className="mainpage__body">
            <img className="left-img" src="/images/mainpage/step3.png" alt="" />
            <div className="mainpage__texts right-text">
              <div className="mainpage__step">Step 3</div>
              <div className="mainpage__title">
                스크랩으로
                <br />
                일정을 만들어요
              </div>
              <div className="mainpage__subtitle">
                일정을 추가할 때마다 <br />
                실시간으로 경로를 눈으로 확인할 수 있어요.
              </div>
              <div className="mainpage__next-btn">
                <button
                  onClick={() => {
                    fourthRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mainpage__page fourth-step" ref={fourthRef}>
          <div className="mainpage__body">
            <div className="mainpage__texts">
              <div className="mainpage__step">Step 4</div>
              <div className="mainpage__title">
                생각나는
                <br />
                사람이 있나요?
              </div>
              <div className="mainpage__subtitle">
                내가 만든 일정을 카카오톡으로 공유해
                <br />
                친구와 함께 일정표를 볼 수 있어요.
              </div>
              <div className="mainpage__next-btn">
                <button
                  onClick={() => {
                    fifthRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  next
                </button>
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step4.png"
              alt=""
            />
          </div>
        </div>
        <div
          className="mainpage__page fifth-step"
          onClick={() => {
            footerRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
          ref={fifthRef}
        >
          <div className="mainpage__body">
            <div className="mainpage__texts left-text">
              <div className="mainpage__title">
                여러분만의
                <br />
                일정을 만들 준비가 되셨나요?
              </div>
              <div className="mainpage__subtitle">
                일정을 추가할 때마다 <br />
                실시간으로 경로를 눈으로 확인할 수 있어요.
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step5.png"
              alt=""
            />
          </div>
        </div>
        <div
          className="mainpage__footer"
          onClick={() => {
            topRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
          ref={footerRef}
        >
          {/* <img
            className="mainpage__bg-end"
            src="/images/mainpage/bg-end.jpg"
            alt=""
          /> */}
          <div className="mainpage__footer__section">
            <img src="/images/logo.png" alt="" />
          </div>
          <div className="mainpage__footer__section">
            <p>About Us</p>
            <span>Read.me</span>
            <span>Repository</span>
          </div>
          <div className="mainpage__footer__section">
            <p>Contact</p>
            <span>Juhye Kim @github</span>
            <span>Jewon Yeon @github</span>
            <span>Yubin Jang @github</span>
          </div>
        </div>

        {/* <Link to="planpage/newpage">
          <button>내 일정 만들기</button>
        </Link>
        <Link to={"/feedpage"}>
          <button>남의 일정 구경하기</button>
        </Link> */}
      </div>
    </>
  );
};

export default MainPage;
