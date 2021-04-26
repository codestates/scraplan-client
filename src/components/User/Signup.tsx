import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { signIn } from "../../actions";
import Modal from "../UI/Modal";

type SignupProps = {
  open: boolean;
  close: () => void;
  handleGoogleSign: (reqPage: string, state: string) => void;
  currentPage?: string;
  handleSignUpWithGoogle?: any;
};

const Signup = (props: SignupProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    open,
    close,
    handleGoogleSign,
    currentPage,
    handleSignUpWithGoogle,
  } = props;
  const refEmail = useRef<HTMLInputElement | null>(null);
  const refEmailCert = useRef<HTMLInputElement | null>(null);
  const refNickname = useRef<HTMLInputElement | null>(null);
  const refPassword = useRef<HTMLInputElement | null>(null);
  const refPasswordCheck = useRef<HTMLInputElement | null>(null);

  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputEmailCert, setInputEmailCert] = useState<string>("");
  const [inputNickname, setInputNickname] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPasswordCheck, setInputPasswordCheck] = useState<string>("");
  const [denyMessage, setDenyMessage] = useState<string>("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    refEmail.current?.focus();
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleCloseBtn();
    });
  }, [open]);
  const handleMoveToNickname = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      refNickname.current?.focus();
    }
  };
  const handleMoveTopassword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      refPassword.current?.focus();
    }
  };
  const handleMoveTopasswordCheck = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      refPasswordCheck.current?.focus();
    }
  };
  const handleMoveToSignUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };

  const handleChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputEmail(e.target?.value);
    },
    [inputEmail],
  );
  const handleChangeEmailCert = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputEmailCert(e.target?.value);
    },
    [inputEmailCert],
  );
  const handleChangeNickname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputNickname(e.target?.value);
    },
    [inputNickname],
  );
  const handleChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputPassword(e.target?.value);
    },
    [inputPassword],
  );
  const handleChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputPasswordCheck(e.target?.value);
    },
    [inputPasswordCheck],
  );

  const handleCloseBtn = (): void => {
    setInputEmail("");
    setInputEmailCert("");
    setInputNickname("");
    setInputPassword("");
    setInputPasswordCheck("");
    setDenyMessage("");
    close();
  };

  const handleEmailCertSend = (): void => {
    alert("개발중인 기능입니다. E-mail 인증번호 입력은 하지 않아도 됩니다.");
  };

  const checkValidEmail = useCallback(
    (email) => {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email,
        )
      ) {
        return true;
      }
      setDenyMessage("유효하지 않은 이메일입니다.");
      return false;
    },
    [inputEmail, denyMessage],
  );

  const checkValidPassword = useCallback(
    (password) => {
      if (!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(password)) {
        setDenyMessage(
          "영문자 + 숫자/특수문자 조합으로 8~20자리를 사용해야 합니다.",
        );
        return false;
      }
      const check_num = password.search(/[0-9]/g);
      const check_eng = password.search(/[a-z]/gi);
      if (check_num < 0 || check_eng < 0) {
        setDenyMessage("비밀번호는 숫자와 영문자를 혼용하여야 합니다.");
        return false;
      }
      if (/(\w)\1\1\1/.test(password)) {
        setDenyMessage("비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.");
        return false;
      }
      return true;
    },
    [inputPassword, denyMessage],
  );

  const handleCheckForm = () => {
    if (inputEmail === "") {
      refEmail.current?.focus();
      setDenyMessage("E-mail을 입력하세요");
      return false;
    } else if (!checkValidEmail(inputEmail)) {
      refEmail.current?.focus();
      return false;
    }
    if (inputNickname === "") {
      refNickname.current?.focus();
      setDenyMessage("닉네임을 입력하세요");
      return false;
    }
    if (!checkValidPassword(inputPassword)) {
      refPassword.current?.focus();
      return false;
    }
    if (inputPassword !== inputPasswordCheck) {
      refPasswordCheck.current?.focus();
      setDenyMessage("비밀번호와 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const handleSignUp = () => {
    if (handleCheckForm()) {
      return fetch(`${process.env.REACT_APP_SERVER_URL}/sign/up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          email: inputEmail,
          nickname: inputNickname,
          password: inputPassword,
        }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.message === "Successfully signedUp") {
            handleCloseBtn();
            setModalComment("회원가입이 완료되었습니다.");
            handleModalOpen();
            return;
          } else if (body.message === "Already exists email") {
            refEmail.current?.focus();
            setDenyMessage("사용중인 이메일입니다.");
            return;
          } else if (body.message === "Already exists nickname") {
            refNickname.current?.focus();
            setDenyMessage("사용중인 닉네임입니다.");
            return;
          } else {
            setDenyMessage("오류가 발생했습니다.");
            return;
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Modal
        modalType="alertModal"
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
      />
      <div className={`signup ${open ? "show" : ""}`}>
        {open ? (
          <>
            <div className="signup__outsider" onClick={handleCloseBtn}></div>
            <div className="signup__wrapper">
              <button className="signup__close-btn" onClick={handleCloseBtn}>
                &times;
              </button>
              <div className="signup__form">
                <div className="signup__form__title">회원가입</div>
                <ul className="signup__form__list">
                  <li className="signup__form__list__item">
                    <p className="label">E-mail</p>
                    <input
                      className="email"
                      type="text"
                      placeholder="사용하실 E-mail을 입력해주세요."
                      value={inputEmail}
                      onChange={handleChangeEmail}
                      onKeyPress={handleMoveToNickname}
                      ref={refEmail}
                    />
                    <div className="send" onClick={handleEmailCertSend}>
                      보내기
                    </div>
                  </li>
                  <li className="signup__form__list__item">
                    <p className="label">E-mail 인증번호</p>
                    <input
                      className="emailCert"
                      type="text"
                      value={inputEmailCert}
                      onChange={handleChangeEmailCert}
                      ref={refEmailCert}
                    />
                    <div className="confirm">확인</div>
                  </li>
                  <li className="signup__form__list__item">
                    <p className="label">닉네임</p>
                    <input
                      className="nickname"
                      type="text"
                      placeholder="사용하실 닉네임을 입력해주세요."
                      value={inputNickname}
                      onChange={handleChangeNickname}
                      onKeyPress={handleMoveTopassword}
                      ref={refNickname}
                    />
                  </li>
                  <li className="signup__form__list__item">
                    <p className="label">비밀번호</p>
                    <input
                      className="password"
                      type="password"
                      placeholder="Password"
                      value={inputPassword}
                      onChange={handleChangePassword}
                      onKeyPress={handleMoveTopasswordCheck}
                      ref={refPassword}
                    />
                  </li>
                  <li className="signup__form__list__item">
                    <p className="label">비밀번호 확인</p>
                    <input
                      className="passwordcheck"
                      type="password"
                      placeholder="Password Check"
                      value={inputPasswordCheck}
                      onChange={handleChangePasswordCheck}
                      onKeyPress={handleMoveToSignUp}
                      ref={refPasswordCheck}
                    />
                  </li>
                </ul>
                <p className="signup__form__deny-message">{denyMessage}</p>
                <button
                  className="signup__form__submit-btn"
                  onClick={handleSignUp}
                >
                  회원가입
                </button>
                <button
                  className="signup__form__google-btn"
                  onClick={handleSignUpWithGoogle}
                >
                  Google
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Signup;
