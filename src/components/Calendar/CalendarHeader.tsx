import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const CalendarHeader = ({
  currentMonth,
  onMonthChange
}: {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    onMonthChange(newDate);
  };
  return <div className="flex items-center justify-between mb-6">
      <button onClick={() => navigateMonth(-1)} className="text-[#E0B0FF] hover:text-[#E040FB] transition-colors duration-300">
        <ChevronLeft size={24} />
      </button>
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="text-[#E0B0FF] text-xl font-medium hover:text-white transition-colors duration-300">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </button>
        {showDropdown && <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-[#4A148C] rounded-lg shadow-lg py-2 z-20">
            {months.map((month, index) => <button key={month} onClick={() => {
          const newDate = new Date(currentMonth);
          newDate.setMonth(index);
          onMonthChange(newDate);
          setShowDropdown(false);
        }} className="block w-full px-4 py-2 text-left text-[#E0B0FF] hover:bg-[#6A1B9A] hover:text-white transition-colors duration-300" style={{
          animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
        }}>
                {month}
              </button>)}
          </div>}
      </div>
      <button onClick={() => navigateMonth(1)} className="text-[#E0B0FF] hover:text-[#E040FB] transition-colors duration-300">
        <ChevronRight size={24} />
      </button>
    </div>;
};