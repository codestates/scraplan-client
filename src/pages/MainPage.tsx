import React from "react";
import Navbar from "../components/UI/Navbar";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      <Navbar currentPage="/" />
      <div className="mainpage">
        <div className="mainpage__page">
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
        <div className="mainpage__page">
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

        <div className="mainpage__page">
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
                <button>next</button>
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step2.png"
              alt=""
            />
          </div>
        </div>
        <div className="mainpage__page">
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
                <button>next</button>
              </div>
            </div>
          </div>
        </div>
        <div className="mainpage__page">
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
                <button>next</button>
              </div>
            </div>
            <img
              className="right-img"
              src="/images/mainpage/step4.png"
              alt=""
            />
          </div>
        </div>
        <div className="mainpage__page">
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
        <div className="mainpage__footer">
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
