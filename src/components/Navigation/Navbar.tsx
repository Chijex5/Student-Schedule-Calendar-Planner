import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Home, Plus, Database, List } from "lucide-react";
export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return <nav className="fixed top-0 left-0 right-0 bg-[#2D0A54]/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className={`flex items-center gap-2 transition-colors ${location.pathname === "/" ? "text-[#E040FB]" : "text-white hover:text-[#E0B0FF]"}`}>
            <Calendar size={24} />
            <span className="font-bold text-sm sm:text-lg">Study Calendar</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/schelduelist")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${location.pathname === "/schelduelist" ? "text-white bg-white/10" : "text-[#E0B0FF] hover:text-white"}`}>
              <List size={20} />
              <span className="hidden sm:block">Scheldue List</span>
            </button>
            <button onClick={() => navigate("/create")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${location.pathname === "/create" ? "text-white bg-white/10" : "text-[#E0B0FF] hover:text-white"}`}>
              <Plus size={20} />
              <span className="hidden sm:block">New Schedule</span>
            </button>
            <button onClick={() => navigate("/data")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${location.pathname === "/data" ? "text-white bg-white/10" : "text-[#E0B0FF] hover:text-white"}`}>
              <Database size={20} />
              <span className="hidden sm:block">Data Hub</span>
            </button>
          </div>
        </div>
      </div>
    </nav>;
};