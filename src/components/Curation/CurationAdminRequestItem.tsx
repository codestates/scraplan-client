import { useState } from "react";

const CurationAdminRequestItem = ({
  item,
  handleRequestUpdate,
  handleRequestResolved,
}: any) => {
  const [showmore, setShowmore] = useState<boolean>(false);
  const statusCode = ["대기중", "처리중", "승인완료", "미승인"]; //0, 1, 2, 3 -> pending, processing, resolved, rejected

  const {
    id,
    requester,
    coordinates,
    address,
    requestTitle,
    requestComment,
    requestTheme,
    status,
  } = item;
  return (
    <li
      className="curation-request__table__contents__item"
      onClick={() => setShowmore(!showmore)}
    >
      <div className="curation-request__table__contents__item-desc">
        <p>{statusCode[status]}</p>
        <p>{id}</p>
        <p>{requester}</p>
        <p>{requestTitle}</p>
        <select
          onChange={(e) => {
            handleRequestUpdate(id, Number(e.target.value));
          }}
        >
          <option value={0} selected={status === 0 ? true : false}>
            대기중
          </option>
          <option value={1} selected={status !== 0 ? true : false}>
            확인중
          </option>
        </select>
      </div>
      {showmore ? (
        <div className="curation-request__table__contents__item-showmore">
          <p>{`신청이유 : ${requestComment}`}</p>
          <p>{`주소 : ${address}`}</p>
          <div className="showmore-btns">
            <button onClick={() => handleRequestResolved(item)}>승인</button>
            <button onClick={() => handleRequestUpdate(id, 3)}>거절</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </li>
  );
};

export default CurationAdminRequestItem;
