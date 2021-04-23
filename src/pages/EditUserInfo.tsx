import React, { useCallback, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGoogleToken, userEditInfo, withdraw } from "../actions";
import Navbar from "../components/UI/Navbar";
import Modal from "../components/UI/Modal";
import { RootState } from "../reducers";

const EditUserInfo = () => {
  const userState = useSelector((state: RootState) => state.userReducer);
  const {
    user: { token, email, nickname },
    googleToken,
  } = userState;
  const dispatch = useDispatch();
  const history = useHistory();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalComment, setModalComment] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [inputNickname, setInputNickname] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPasswordCheck, setInputPasswordCheck] = useState<string>("");
  const [inputWithdrawal, setInputWithdrawal] = useState<string>("");
  const [editDenyMessage, setEditDenyMessage] = useState<string>("");
  const [withdrawalDenyMessage, setWithdrawalDenyMessage] = useState<string>(
    "",
  );
  const [withdrawalHidden, setWithdrawalHidden] = useState<boolean>(true);
  const [acceptActionType, setAcceptActionType] = useState<string>("");
  const refEmail = useRef<HTMLInputElement>(null);
  const refNickName = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);
  const refPasswordCheck = useRef<HTMLInputElement>(null);
  const refWithdrawal = useRef<HTMLInputElement>(null);

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChangeNickname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputNickname(e.target.value);
    },
    [inputNickname],
  );
  const handleChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputPassword(e.target.value);
    },
    [inputPassword],
  );
  const handleChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputPasswordCheck(e.target.value);
    },
    [inputPasswordCheck],
  );
  const handleChangeWithdrwal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputWithdrawal(e.target.value);
    },
    [inputWithdrawal],
  );
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

  // 유효성 검사
  const checkValidPassword = useCallback(
    (password) => {
      if (!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(password)) {
        setEditDenyMessage(
          "영문자 + 숫자/특수문자 조합으로 8~20자리를 사용해야 합니다.",
        );
        return false;
      }
      const check_num = password.search(/[0-9]/g);
      const check_eng = password.search(/[a-z]/gi);
      if (check_num < 0 || check_eng < 0) {
        setEditDenyMessage("비밀번호는 숫자와 영문자를 혼용하여야 합니다.");
        return false;
      }
      if (/(\w)\1\1\1/.test(password)) {
        setEditDenyMessage(
          "비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.",
        );
        return false;
      }
      return true;
    },
    [inputPassword, editDenyMessage],
  );

  const handleCompleteInput = (): boolean => {
    if (!checkValidPassword(inputPassword)) {
      refPassword.current?.focus();
      return false;
    } else if (checkValidPassword(inputPassword)) {
    }
    if (inputPasswordCheck !== inputPassword) {
      refPasswordCheck.current?.focus();
      setEditDenyMessage("비밀번호를 다시 확인해주세요");
      return false;
    }
    return true;
  };

  // 회원정보 수정
  const handleUserEditInfo = () => {
    // 비밀번호 조건이 만족 시 요청되는 것
    if (googleToken.length > 1) {
      setAcceptActionType("edit");
      setModalType("yesNoModal");
      setModalComment("회원정보를 수정하시겠습니까?");
      handleModalOpen();
    } else if (handleCompleteInput()) {
      setAcceptActionType("edit");
      setModalType("yesNoModal");
      setModalComment("회원정보를 수정하시겠습니까?");
      handleModalOpen();
    }
  };
  // 수정 - 모달창에서 예를 눌렀을 때 실행되는 함수
  const handleAcceptUserEditInfo = () => {
    handleModalClose();
    let body;
    if (googleToken.length > 1) {
      body = JSON.stringify({
        email,
        nickname: inputNickname,
      });
    } else {
      body = JSON.stringify({
        email,
        nickname: inputNickname,
        password: inputPassword,
      });
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/edit-info`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body,
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.accessToken) {
          setInputPassword("");
          setInputPasswordCheck("");
          dispatch(userEditInfo(body.accessToken, email, inputNickname));
          setModalType("alertModal");
          setModalComment("회원 정보 변경이 완료되었습니다.");
          handleModalOpen();
          setTimeout(() => {
            history.push("/mypage");
          }, 1000);
        } else if (body.message === "Insufficient info") {
          setEditDenyMessage("정보를 입력해주세요.");
        } else if (body.message === "Password is wrong!") {
          refPassword.current?.focus();
          setEditDenyMessage("비밀번호가 틀렸습니다.");
        } else if (body.message === "Expired token" || "Invalid token") {
          refPassword.current?.focus();
          setEditDenyMessage("재 로그인 후 신청해주세요.");
        } else if (body.message === "Already exists nickname") {
          refNickName.current?.focus();
          setEditDenyMessage("존재하는 닉네임입니다.");
        }
      })
      .catch((err) => console.log(err));
  };
  // 회원 탈퇴
  const handleWithDrawal = () => {
    // 서버에 요청 후 비밀번호를 비교해서 같으면 탈퇴 가능
    if (withdrawalHidden && googleToken.length <= 1) {
      setWithdrawalHidden(false);
      return;
    }
    if (inputWithdrawal === "" && googleToken.length <= 1) {
      setWithdrawalDenyMessage("비밀번호를 입력해주세요.");
      return;
    }
    setWithdrawalDenyMessage("");
    setModalType("yesNoModal");
    setModalComment("정말 탈퇴하시겠습니까?");
    setAcceptActionType("withdrawal");
    handleModalOpen();
    return;
  };
  // 탈퇴 - 모달창에서 예를 눌렀을 때 실행되는 함수
  const handleAcceptWithdrawal = () => {
    handleModalClose();
    let body;
    let api;
    if (googleToken.length > 1) {
      body = JSON.stringify({
        email,
        hashData: googleToken,
      });
      api = "/google-sign/withdraw";
    } else {
      body = JSON.stringify({
        email,
        password: inputWithdrawal,
      });
      api = "/sign/withdraw";
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}${api}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body,
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "Successfully processed") {
          dispatch(withdraw());
          dispatch(getGoogleToken(""));
          setModalType("alertModal");
          setModalComment("탈퇴가 완료되었습니다.");
          handleModalOpen();
          setTimeout(() => {
            history.push("/");
          }, 1000);
        } else if (body.message === "Insufficient info") {
          refWithdrawal.current?.focus();
          setWithdrawalDenyMessage("정보가 부족합니다.");
        } else if (body.message === "Password is wrong!") {
          refWithdrawal.current?.focus();
          setWithdrawalDenyMessage("비밀번호가 틀렸습니다.");
        } else if (body.message === "Expired token" || "Invalid token") {
          refWithdrawal.current?.focus();
          setWithdrawalDenyMessage("재 로그인 후 신청해주세요.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar currentPage="/edituserinfo" />
      <Modal
        modalType={modalType}
        open={openModal}
        close={handleModalClose}
        comment={modalComment}
        handleAcceptAction={
          acceptActionType === "withdrawal"
            ? handleAcceptWithdrawal
            : acceptActionType === "edit"
            ? handleAcceptUserEditInfo
            : () => {}
        }
      />
      <div className="edit-userinfo">
        <div className="edit-userinfo__title">계정 설정</div>
        <div className="edit-userinfo__message">
          <p>E-mail은 변경이 불가능합니다.</p>
          <p>닉네임을 입력하지 않을 시, 유지됩니다.</p>
        </div>
        <div className="edit-userinfo__wrapper">
          <div className="edit-userinfo__form">
            <p className="edit-userinfo__form__edit-title">기본 정보</p>
            <ul className="edit-userinfo__form__list">
              <li className="edit-userinfo__form__item">
                <p className="edit-userinfo__form__item__label">E-mail</p>
                <input
                  className="edit-userinfo__form__item__input-email"
                  type="text"
                  placeholder={email}
                  ref={refEmail}
                  readOnly
                />
              </li>
              <li className="edit-userinfo__form__item">
                <p className="edit-userinfo__form__item__label">닉네임</p>
                <input
                  className="edit-userinfo__form__item__input-nickname"
                  type="text"
                  placeholder={nickname}
                  value={inputNickname}
                  onChange={handleChangeNickname}
                  ref={refNickName}
                  onKeyPress={handleMoveTopassword}
                />
              </li>
              {googleToken.length > 1 ? (
                <></>
              ) : (
                <>
                  <li className="edit-userinfo__form__item">
                    <p className="edit-userinfo__form__item__label">
                      새 비밀번호
                    </p>
                    <input
                      className="edit-userinfo__form__item__input-password"
                      type="password"
                      placeholder="변경할 비밀번호를 입력해주세요."
                      value={inputPassword}
                      onChange={handleChangePassword}
                      ref={refPassword}
                      onKeyPress={handleMoveTopasswordCheck}
                    />
                  </li>
                  <li className="edit-userinfo__form__item">
                    <p className="edit-userinfo__form__item__label">
                      비밀번호 확인
                    </p>
                    <input
                      className="edit-userinfo__form__item__input-passwordcheck"
                      type="password"
                      placeholder="비밀번호 확인"
                      value={inputPasswordCheck}
                      onChange={handleChangePasswordCheck}
                      ref={refPasswordCheck}
                    />
                  </li>
                </>
              )}
              <div className="edit-userinfo__form__list__deny-message">
                {editDenyMessage}
              </div>
            </ul>
            <div className="edit-userinfo__submit">
              <button
                className="edit-userinfo__submit__edit-btn"
                onClick={handleUserEditInfo}
              >
                수정 하기
              </button>
            </div>
          </div>
          <div className="edit-userinfo__form__withdrawal">
            <p className="edit-userinfo__form__withdrawal-title">계정 변경</p>
            <p className="edit-userinfo__form__withdrawal-message">
              탈퇴를 할 시, 복구가 불가능합니다.
            </p>
            {googleToken.length > 1 ? (
              <></>
            ) : (
              <div
                className={
                  !withdrawalHidden
                    ? "edit-userinfo__form__withdrawal__form"
                    : "hidden"
                }
              >
                <p>비밀번호</p>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={inputWithdrawal}
                  onChange={handleChangeWithdrwal}
                  ref={refWithdrawal}
                />
              </div>
            )}
            <div className="edit-userinfo__form__withdrawal__submit">
              <button
                className="edit-userinfo__form__withdrawal__submit__withdrawal-btn"
                onClick={handleWithDrawal}
              >
                회원 탈퇴
              </button>
            </div>
            <div className="edit-userinfo__form__withdrawal__deny-message">
              {withdrawalDenyMessage}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserInfo;
