/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { signIn } from "../../actions";
import "./User.scss";

type SigninProps = {
  open: boolean;
  close: () => void;
  handleGoogleSign: (reqPage: string, state: string) => void;
  currentPage?: string;
};

const Signin = (props: SigninProps) => {
  const { open, close, handleGoogleSign, currentPage } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const refEmail = useRef<HTMLInputElement | null>(null);
  const refPassword = useRef<HTMLInputElement | null>(null);

  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [denyMessage, setDenyMessage] = useState<string>("");

  useEffect(() => {
    if (window.location.hash !== "") {
      const state = window.location.hash.slice(7, 13);
      if (state === "signin") {
        fetch(`${process.env.REACT_APP_SERVER_URL}/google-sign/in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({ data: window.location.hash }),
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
          });
      } else {
        history.push(`${currentPage}`);
        return;
      }
    }
  });

  useEffect(() => {
    refEmail.current?.focus();
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleCloseBtn();
    });
  }, [open]);

  const handleKeyPressEnter = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      refPassword.current?.focus();
      if (e.currentTarget.classList[1] === "inputpassword") handleSignIn();
    }
  };

  const handleChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputEmail(e.target?.value);
    },
    [inputEmail],
  );

  const handleChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputPassword(e.target?.value);
    },
    [inputPassword],
  );

  const handleCloseBtn = (): void => {
    setInputEmail("");
    setInputPassword("");
    setDenyMessage("");
    close();
  };

  const handleSignIn = () => {
    if (inputEmail === "") {
      refEmail.current?.focus();
      setDenyMessage("이메일을 입력하세요");
      return;
    }
    if (inputPassword === "") {
      refPassword.current?.focus();
      setDenyMessage("비밀번호를 입력하세요");
      return;
    }
    return fetch(`${process.env.REACT_APP_SERVER_URL}/sign/in`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        email: inputEmail,
        password: inputPassword,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.accessToken) {
          dispatch(signIn(body.accessToken, inputEmail, ""));
          handleCloseBtn();
        } else {
          setDenyMessage("이메일과 비밀번호를 다시 확인해주세요");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleFindEmail = (): void => {
    setDenyMessage("개발중인 기능입니다");
  };
  const handleFindPassword = (): void => {
    setDenyMessage("개발중인 기능입니다");
  };

  return (
    <div className={`signin ${open ? "show" : ""}`}>
      {open ? (
        <>
          <div className="signin__outsider" onClick={handleCloseBtn}></div>
          <div className="signin__wrapper">
            <button className="signin__close-btn" onClick={handleCloseBtn}>
              &times;
            </button>
            <div className="signin__form">
              <div className="signin__form__title">로그인</div>
              <ul className="signin__form__list">
                <li className="signin__form__item">
                  <p className="signin__form__item__label">E-MAIL</p>
                  <input
                    type="text"
                    className="signin__form__item__input inputemail"
                    placeholder="Email"
                    value={inputEmail}
                    required
                    onChange={handleChangeEmail}
                    onKeyPress={handleKeyPressEnter}
                    ref={refEmail}
                  />
                </li>
                <li className="signin__form__item">
                  <p className="signin__form__item__label">비밀번호</p>
                  <input
                    type="password"
                    className="signin__form__item__input inputpassword"
                    placeholder="Password"
                    value={inputPassword}
                    required
                    onChange={handleChangePassword}
                    onKeyPress={handleKeyPressEnter}
                    ref={refPassword}
                  />
                </li>
              </ul>
              <p className="signin__form__deny-message">{denyMessage}</p>
              <button
                className="signin__form__submit-btn"
                onClick={handleSignIn}
                onKeyPress={handleKeyPressEnter}
              >
                로그인
              </button>
              <button
                className="signin__form__google-btn"
                onClick={() => handleGoogleSign(`${currentPage}`, "signin")}
              >
                Google
              </button>
              <div className="signin__form__find-btns">
                <button onClick={handleFindEmail}>이메일 찾기</button>
                <button onClick={handleFindPassword}>비밀번호 찾기</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Signin;
