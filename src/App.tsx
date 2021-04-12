import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import MainPage from "./pages/MainPage";
import FeedPage from "./pages/FeedPage";
import MyPage from "./pages/MyPage";
import PlanPage from "./pages/PlanPage";
import EditUserInfo from "./pages/EditUserInfo";
import CurationManagement from "./pages/Admin/CurationManagement";
import CurationRequest from "./pages/Admin/CurationRequest";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/feedpage" component={FeedPage} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/planpage/:planId" component={PlanPage} />
        <Route path="/edituserinfo" component={EditUserInfo} />
        <Route path="/curation-management" component={CurationManagement} />
        <Route path="/curation-request" component={CurationRequest} />
      </Switch>
    </Router>
  );
};

export default App;
