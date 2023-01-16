import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.js";
import MeetingCreation from "./pages/MeetingCreation/MeetingCreation.js";
import Login from "./pages/Login/Login.js";
import Checkin from "./pages/Checkin/Checkin.js";
import History from "./pages/History/History.js";
import MemberRoster from "./pages/MemberRoster/MemberRoster.js";

export default function App() {
  
  window.onpopstate = () => {
    navigate("/");
  }

  return (
    <Routes>
      <Route exact path="/" element={<Home />}/>
      <Route exact path="/meetings" element={<MeetingCreation />}/>
      <Route exact path="/login" element={<Login />}/>
      <Route exact path="/checkin" element={<Checkin />}/>
      <Route exact path="/history" element={<History />}/>
      <Route exact path="/members" element={<MemberRoster />}/>
    </Routes>
  );
}