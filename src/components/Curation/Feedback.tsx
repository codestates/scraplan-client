import { defaultMaxListeners } from "node:events";
import React from "react";

interface FeedbackProps {
  detail: {
    curationFeedbackId: number;
    writer: string;
    times: number;
    comment: string;
    rate: number; //0,1,2 -> 별로에요, 그저그래요, 좋아요
  };
}

const Feedback = ({ detail }: FeedbackProps) => {
  const { curationFeedbackId, writer, times, comment, rate } = detail;
  const emotionList = ["😡", "🤔", "😃"];
  return (
    <span className="feedback">
      <div>
        <p className="feedback__emotion">{emotionList[rate] || "😡"}</p>
        <span className="feedback__time">{times || 1}H</span>
      </div>
      <span className="feedback__comment">{comment || "의견"}</span>
    </span>
  );
};

export default Feedback;
