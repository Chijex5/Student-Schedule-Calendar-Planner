import React, { useState, useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { SubjectTag } from "./SubjectTag";
import { ActionButtons } from "./ActionButtons";
import { ChevronDown, ChevronUp } from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const GeneratedCalendar = ({
  scheduleData,
  onSave,
  onRegenerate
}: {
  scheduleData: { date: string; subject: string }[];
  onSave: () => void;
  onRegenerate: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days: (Date | null)[] = [];

    const offset = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(date.getFullYear(), date.getMonth(), i));

    return days;
  };

  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
    return scheduleData.find((item) => item.date === dateStr);
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const handleDayClick = (date: Date | null) => {
    if (!isMobile || !date) return;
    const dateStr = date.toISOString().split("T")[0]; // Store as string
    setExpandedDay(expandedDay === dateStr ? null : dateStr);
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-6 text-center">
        Preview Your Schedule
      </h2>

      <CalendarHeader currentMonth={currentMonth} onMonthChange={setCurrentMonth} />

      {!isMobile && (
        <div className="grid grid-cols-7 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-[#E0B0FF] text-center font-medium">
              {day}
            </div>
          ))}
        </div>
      )}

      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-7"} gap-2 mb-6`}>
        {getDaysInMonth(currentMonth).map((date, index) => {
          const scheduleItem = date ? getScheduleForDate(date) : null;
          const dateStr = date ? date.toISOString().split("T")[0] : "";
          const isExpanded = expandedDay === dateStr;
          const isDisabled = isMobile && date && !scheduleItem; // Grey out if no event in mobile

          return (
            <div
              key={index}
              className={`
                p-2 rounded-lg transition-all cursor-pointer
                ${date ? (isDisabled ? "bg-gray-600 opacity-50" : "bg-[#4A148C]") : "bg-transparent"}
                ${isToday(date) ? "ring-2 ring-[#E040FB]" : ""}
              `}
              onClick={() => handleDayClick(date)}
            >
              {date && (
                <>
                  <div className="flex justify-between items-center">
                    <span className={`${isDisabled ? "text-gray-400" : "text-white"}`}>
                      {date.getDate()}
                    </span>
                    {isMobile && scheduleItem && (
                      isExpanded ? (
                        <ChevronUp size={16} className="text-[#E0B0FF]" />
                      ) : (
                        <ChevronDown size={16} className="text-[#E0B0FF]" />
                      )
                    )}
                  </div>

                  {(isExpanded || !isMobile) && scheduleItem && (
                    <div className="mt-2 space-y-1">
                      <SubjectTag subject={scheduleItem.subject} />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <ActionButtons onSave={onSave} onRegenerate={onRegenerate} />
    </div>
  );
};
