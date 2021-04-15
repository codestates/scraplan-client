import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { useHistory } from "react-router-dom";
import { signOut, getGoogleToken } from "../../actions";

import Signin from "../User/Signin";
import Signup from "../User/Signup";
import "./UI.scss";
require("dotenv").config();

interface NavbarProps {
  currentPage?: string;
}

const Navbar = (props: NavbarProps) => {
  const { currentPage } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state: RootState) => state.userReducer);
  const {
    user: { token, email },
  } = userState;

  const [SignInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [SignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);

  const closeSignInModal = () => {
    setSignInModalOpen(false);
  };

  const closeSignUpModal = () => {
    setSignUpModalOpen(false);
  };

  const handleMainPageBtn = () => {
    history.push("/");
  };
  const handleSigninBtn = () => {
    setSignInModalOpen(true);
  };
  const handleSignupBtn = () => {
    setSignUpModalOpen(true);
  };
  const handleMyPageBtn = () => {
    history.push("/mypage");
  };
  const handleSignoutBtn = () => {
    dispatch(signOut());
    dispatch(getGoogleToken(""));
    history.push("/");
    return fetch(`${process.env.REACT_APP_SERVER_URL}/sign/out`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  };

  const handleGoogleSign = (currentPage: string, state: string): void => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params: { [key: string]: string | any } = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: `${process.env.REACT_APP_CLIENT_URL}${currentPage}`,
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      include_granted_scopes: "true",
      state,
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <Signin
        open={SignInModalOpen}
        close={closeSignInModal}
        handleGoogleSign={handleGoogleSign}
        currentPage={currentPage}
      />
      <Signup
        open={SignUpModalOpen}
        close={closeSignUpModal}
        handleGoogleSign={handleGoogleSign}
        currentPage={currentPage}
      />
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
    </>
  );
};

export default Navbar;
