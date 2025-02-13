import React from "react";
type ViewType = "daily" | "weekly" | "monthly";
export const ViewToggle = ({
  currentView,
  onViewChange
}: {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) => {
  return <div className="flex space-x-4 justify-center mb-8">
      {(["daily", "weekly", "monthly"] as ViewType[]).map(view => <button key={view} onClick={() => onViewChange(view)} className={`
            relative px-4 py-2 
            transition-all duration-300
            ${currentView === view ? "text-white" : "text-[#E0B0FF] opacity-50 hover:opacity-75"}
          `}>
          <span className="capitalize">{view}</span>
          {currentView === view && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#26A69A] animate-slide-right" />}
        </button>)}
    </div>;
};