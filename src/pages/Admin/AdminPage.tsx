import React, { useState } from "react";
import Navbar from "../../components/UI/Navbar";
import CurationManagement from "./CurationManagement";
import "./Admin.scss";
import CurationRequest from "./CurationRequest";

const AdminPage = () => {
  const [menu, setMenu] = useState<string>("request");

  return (
    <>
      <Navbar />
      <div className="adminpage">
        <div className="adminpage__sidebar">
          <h2>Menu</h2>
          <h4
            className={`${menu === "request" ? "selected" : ""}`}
            onClick={() => {
              setMenu("request");
            }}
          >
            큐레이션 요청
          </h4>
          <h4
            className={`${menu === "management" ? "selected" : ""}`}
            onClick={() => {
              setMenu("management");
            }}
          >
            큐레이션 관리
          </h4>
        </div>
        <div className="adminpage__main">
          <p className="adminpage__main__title">
            {" "}
            {menu === "request" ? "큐레이션 요청" : "큐레이션 관리"}
          </p>
          <div className="adminpage__main__contents">
            {menu === "request" ? (
              <CurationRequest setMenu={setMenu} />
            ) : (
              <CurationManagement />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
