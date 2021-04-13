import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import Toast from "./Toast";

function Nofitication() {
  const state = useSelector((state: RootState) => state.notificationReducer);

  return (
    <div className="notification-container">
      {state.notifications.map((n: any) => (
        <Toast key={n.uuid} text={n.message} dismissTime={n.dismissTime} />
      ))}
    </div>
  );
}

export default Nofitication;
