import "./app.css";

import { Routes, Route } from "react-router-dom";

import MeetingCreation from "./pages/MeetingCreation/MeetingCreation.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MeetingCreation />}>
      </Route>
    </Routes>
  );
}