import React from "react";
import Navbar from "../components/UI/Navbar";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      <Navbar />
      <div className="mainpage">
        <Link to="planpage/0">
          <button>내 일정 만들기</button>
        </Link>
        <Link to={"/feedpage"}>
          <button>남의 일정 구경하기</button>
        </Link>
      </div>
    </>
  );
};

export default MainPage;
