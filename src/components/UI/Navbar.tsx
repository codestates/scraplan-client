import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { useHistory } from "react-router-dom";
import { signOut, getGoogleToken } from "../../actions";
import Signin from "../User/Signin";
import Signup from "../User/Signup";
import "./UI.scss";
require("dotenv").config();

const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state: RootState) => state.userReducer);
  const {
    user: { token, email },
  } = userState;

  const [SignInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [SignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);

  const handleMainPageBtn = () => {
    history.push("/");
  };
  const handleSigninBtn = () => {
    // signin Modal
  };
  const handleSignupBtn = () => {
    // signup Modal
  };
  const handleMyPageBtn = () => {
    history.push("/mypage");
  };
  const handleSignoutBtn = () => {
    dispatch(signOut());
    dispatch(getGoogleToken(""));
    history.push("/");
    //   return fetch(`${process.env.REACT_APP_SERVER_URL}/sign/out`, {
    //     method: "PUT",
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       credentials: "include",
    //     },
    //     body: JSON.stringify({
    //       email,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => data)
    //     .catch((err) => console.error(err));
    // };
  };

  return (
    <div className="navbar">
      <div className="navbar__logo" onClick={handleMainPageBtn}>
        <img src="/images/logo.png" alt="" />
      </div>
      <div className="navbar__btns">
        <button
          onClick={token.length === 0 ? handleSigninBtn : handleMyPageBtn}
        >
          {token.length === 0 ? "로그인" : "마이페이지"}
        </button>
        <button
          onClick={token.length === 0 ? handleSignupBtn : handleSignoutBtn}
        >
          {token.length === 0 ? "회원가입" : "로그아웃"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
