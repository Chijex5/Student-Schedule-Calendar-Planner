import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { CalendarGenerator } from "./components/CalendarGenerator/CalendarGenerator";
import { SavedSchedulePage } from "./components/SavedSchedule/SavedSchedulePage";
import DataManagementPage from "./components/DataManagementPage"
import { Navbar } from "./components/Navigation/Navbar";
export function App() {
  return <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CalendarGenerator />} />
          <Route path="/schedule/:id" element={<SavedSchedulePage />} />
          <Route path="/data" element={<DataManagementPage />} />
        </Routes>
      </div>
    </Router>;
}