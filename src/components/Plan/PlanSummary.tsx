import "./Plan.scss";
type PlanSummaryProps = {
  id: number;
  title: string;
  desc: string;
  writer: string;
  dayCount: number;
  representAddr: string;
};
const PlanSummary = (props: PlanSummaryProps) => {
  const { id, title, desc, writer, dayCount, representAddr } = props;
  return (
    <div className="plansummary">
      <div className="plansummary__contents__plan">
        <div className="plansummary__contents__plan__title">{title}</div>
        <div className="plansummary__contents__plan__info">
          {`${representAddr}   |   ${dayCount}박 ${dayCount + 1}일`}{" "}
        </div>
        <div className="plansummary__contents__plan__description">{desc}</div>
      </div>
      <div className="plansummary__contents__plan-hover">
        <button className="plansummary__contents__plan-hover__cancel-btn">
          &times;
        </button>
        <div className="plansummary__contents__plan-hover__share-btn">
          <img src="images/share.png" alt=""></img>
          <span>공유하기</span>
        </div>
      </div>
    </div>
  );
};

export default PlanSummary;
