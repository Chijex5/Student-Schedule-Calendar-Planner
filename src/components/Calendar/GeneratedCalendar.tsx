import React, { useEffect, useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { SubjectTag } from "./SubjectTag";
import { ActionButtons } from "./ActionButtons";
import { Calendar } from "lucide-react";
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysOfWeekMobile = ["M", "T", "W", "T", "F", "S", "S"];
export const GeneratedCalendar = ({
  scheduleData,
  onSave,
  onRegenerate
}: {
  scheduleData: {
    date: string;
    subject: string;
  }[];
  onSave: () => void;
  onRegenerate: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };
  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return scheduleData.find(item => item.date === dateStr);
  };
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };
  return <div>
      <h2 className="text-2xl text-white font-bold mb-6 text-center">
        Preview Your Schedule
      </h2>
      <CalendarHeader currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 md:p-6">
        <div className="grid grid-cols-7 gap-1">
          {!isMobile && daysOfWeek.map(day => <div key={day} className="hidden md:block text-[#E0B0FF] text-sm text-center p-2">
                {day}
              </div>)}
          {isMobile && daysOfWeekMobile.map(day => <div key={day} className="md:hidden text-[#E0B0FF] text-xs text-center p-1">
                {day}
              </div>)}
          {getDaysInMonth(currentMonth).map((date, index) => {
          if (!date) {
            return <div key={index} className="min-h-[40px] md:min-h-[100px] p-1 md:p-2" />;
          }
          const scheduleItem = getScheduleForDate(date);
          const isCurrentDay = isToday(date);
          return <div key={index} className={`
                  relative
                  min-h-[40px] md:min-h-[100px]
                  p-1 md:p-2
                  rounded-lg
                  ${date ? "bg-[#4A148C]" : "bg-transparent"}
                  ${isCurrentDay ? "ring-1 ring-[#E040FB]" : ""}
                  transition-all duration-300
                  hover:bg-white/15
                `}>
                <div className={`
                  text-white font-medium
                  text-xs md:text-sm
                  ${isCurrentDay ? "text-[#E040FB]" : ""}
                `}>
                  {date.getDate()}
                </div>
                <div className="md:hidden">
                  {scheduleItem && <div className="mt-1 w-2 h-2 rounded-full bg-[#E040FB]" />}
                </div>
                <div className="hidden md:block space-y-1 mt-1">
                  {scheduleItem && <div className="text-[#E0B0FF] text-xs truncate" title={scheduleItem.subject}>
                      • {scheduleItem.subject}
                    </div>}
                </div>
              </div>;
        })}
        </div>
      </div>
      <ActionButtons onSave={onSave} onRegenerate={onRegenerate} />
    </div>;
};