import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { useHistory } from "react-router-dom";
import { signOut, getGoogleToken, signIn } from "../../actions";

import Signin from "../User/Signin";
import Signup from "../User/Signup";
import "./UI.scss";
import Modal from "./Modal";
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

  // 여기부터
  const [inputNicknameModal, setInputNicknameModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [modalComment, setModalComment] = useState<string>("");

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const handleSignUpWithGoogle = () => {
    setModalComment("사용하실 닉네임을 입력해주세요.");
    setModalType("inputModal");
    handleModalOpen();
  };
  const handleAcceptActionToModal = () => {
    if (window.location.hash !== "") {
      const googleData = decodeURIComponent(window.location.hash).split("&");

      let newHashData = "";
      for (const el of googleData) {
        const parsedData = el.split("=");
        if (
          (parsedData[0] === "#state" || parsedData[0] === "state") &&
          parsedData[1].indexOf("signup") > -1
        ) {
          //state 변경
          newHashData += `${parsedData[0]}=signup/${inputNicknameModal}&`;
        } else newHashData += el + "&";
      }
      window.location.hash = newHashData.slice(0, newHashData.length - 2);
    } else {
      handleGoogleSign(`${currentPage}`, `signup/${inputNicknameModal}`);
    }
  };
  // 여기까지 작성
  useEffect(() => {
    const googleSignIn = (hashData: string) => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/google-sign/in`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ hashData }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.accessToken) {
            dispatch(signIn(body.accessToken, body.email, body.nickname));
            history.push(`${currentPage}`);
            return;
          } else {
            history.push(`${currentPage}`);
            return;
          }
        })
        .catch((err) => {
          console.error(err);
          history.push(`${currentPage}`);
          return;
        });
    };

    if (window.location.hash !== "") {
      const hashData = window.location.hash;
      let nickname = "";
      let state = "";
      const googleData = decodeURI(window.location.href)
        .split("#")[1]
        .split("&");
      for (const query of googleData) {
        const splited = query.split("=");
        if (splited[0] === "state") {
          state = splited[1].slice(0, 6);
          nickname = splited[1].slice(7);
        }
      }

      if (state === "signup") {
        fetch(`${process.env.REACT_APP_SERVER_URL}/google-sign/up`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({
            nickname,
            hashData: window.location.hash,
          }),
        })
          .then((res) => res.json())
          .then((body) => {
            if (body.message === "Successfully signedup") {
              closeSignUpModal();
              googleSignIn(hashData);
              return;
            } else if (body.message === "Already exists email") {
              history.push(`${currentPage}`);
              handleSignupBtn();
              setModalComment("사용중인 이메일입니다.");
              setModalType("alertModal");
              handleModalOpen();
              return;
            } else if (body.message === "Already exists nickname") {
              handleSignupBtn();
              setModalComment("사용중인 닉네임입니다.");
              setModalType("inputModal");
              handleModalOpen();
              return;
            } else {
              history.push(`${currentPage}`);
              handleSignupBtn();
              setModalComment("오류가 발생했습니다.");
              setModalType("alertModal");
              handleModalOpen();
              return;
            }
          })
          .catch((err) => console.error(err));
      } else if (state === "signin") {
        googleSignIn(hashData);
      } else {
        history.push(`${currentPage}`);
        return;
      }
    }
  }, [window.location.hash]);

  useEffect(() => {
    if (token.length === 0 && email.length !== 0) {
      dispatch(signOut());
      setModalComment("접속 시간이 초과되었습니다.다시 로그인 해주세요.");
      setModalType("alertModal");
      handleModalOpen();
    }
  }, [token]);

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
      state: state,
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
      <Modal
        modalType={modalType}
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
        handleAcceptAction={handleAcceptActionToModal}
        handleInputAction={setInputNicknameModal}
      />
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
        handleSignUpWithGoogle={handleSignUpWithGoogle}
      />
      <div className="navbar">
        <div className="navbar__logo" onClick={handleMainPageBtn}>
          <img src="/images/logo.png" alt="" />
        </div>
        <div className="navbar__btns">
          <button
            className="navbar__btns__first"
            onClick={token.length === 0 ? handleSigninBtn : handleMyPageBtn}
          >
            {token.length === 0 ? "로그인" : "마이페이지"}
          </button>
          <button
            className="navbar__btns__second"
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
