import React, { useEffect, useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { SubjectTag } from "./SubjectTag";
import { ActionButtons } from "./ActionButtons";
import { Calendar, Grid, List } from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysOfWeekMobile = ["M", "T", "W", "T", "F", "S", "S"];

export const GeneratedCalendar = ({
  scheduleData,
  onSave,
  onRegenerate,
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
  const [calendarViewMobile, setCalendarViewMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
    const dateStr = getLocalDateString(date);
    return scheduleData.filter(item => item.date === dateStr);
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderMonthlyView = () => {
    const days = getDaysInMonth(currentMonth);

    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 md:p-6">
        <div className="grid grid-cols-7 gap-1">
          {!isMobile &&
            daysOfWeek.map(day => (
              <div key={day} className="hidden md:block text-[#E0B0FF] text-sm text-center p-2">
                {day}
              </div>
            ))}
          {isMobile &&
            daysOfWeekMobile.map(day => (
              <div key={day} className="md:hidden text-[#E0B0FF] text-xs text-center p-1">
                {day}
              </div>
            ))}
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="min-h-[40px] md:min-h-[100px] p-1 md:p-2" />;
            }
            const tasks = getScheduleForDate(date);
            const isCurrentDay = isToday(date);

            return (
              <div
                key={index}
                className={`
                  relative group
                  min-h-[40px] md:min-h-[100px]
                  p-1 md:p-2
                  rounded-lg
                  bg-[#4A148C]
                  ${isCurrentDay ? "ring-1 ring-[#E040FB]" : ""}
                  transition-all duration-300
                  hover:bg-white/15
                `}
              >
                {tasks.length > 0 && (
                  <div className="absolute top-0 right-0 md:hidden">
                    <div className="h-3 w-3 transform rotate-45 bg-[#E040FB]/80 rounded-sm" />
                  </div>
                )}
                <div
                  className={`
                    text-white font-medium
                    text-xs md:text-sm
                    ${isCurrentDay ? "text-[#E040FB]" : ""}
                    ${tasks.length > 0 ? "font-bold" : ""}
                  `}
                >
                  {date.getDate()}
                </div>
                <div className="md:hidden mt-1 flex flex-wrap gap-1">
                  {tasks.length > 0 &&
                    tasks.slice(0, 2).map((task, j) => (
                      <div
                        key={j}
                        className="text-[7px] px-1 py-0.5 rounded bg-[#E040FB]/30 text-white"
                        title={task.subject}
                      >
                        {task.subject.substring(0, 3)}
                      </div>
                    ))}
                  {tasks.length > 2 && (
                    <div className="text-[7px] px-1 py-0.5 rounded bg-[#E040FB]/30 text-white">
                      +{tasks.length - 2}
                    </div>
                  )}
                </div>
                <div className="hidden md:block space-y-1 mt-1">
                  {tasks.map((task, j) => (
                    <div key={j} className="text-[#E0B0FF] text-xs truncate" title={task.subject}>
                      • {task.subject}
                    </div>
                  ))}
                </div>
                {tasks.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 top-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                    <div className="bg-[#2D0A54]/95 p-2 rounded-lg shadow-lg text-xs hidden group-hover:block">
                      {tasks.map((task, idx) => (
                        <div key={idx} className="text-white py-1">{task.subject}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMobileMonthlyView = () => {
    const tasksByDate: Record<string, { subject: string }[]> = {};
    scheduleData.forEach(item => {
      if (!tasksByDate[item.date]) {
        tasksByDate[item.date] = [];
      }
      tasksByDate[item.date].push({ subject: item.subject });
    });

    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const datesWithTasks = Object.keys(tasksByDate)
      .filter(dateStr => {
        const date = new Date(dateStr);
        return date >= currentMonthStart && date <= currentMonthEnd;
      })
      .sort();

    return (
      <div className="md:hidden space-y-2">
        {datesWithTasks.length === 0 ? (
          <div className="text-center py-8 text-[#E0B0FF]">
            <Calendar className="mx-auto mb-2" size={24} />
            No tasks scheduled this month
          </div>
        ) : (
          datesWithTasks.map(dateStr => {
            const date = new Date(dateStr);
            const isCurrentDay = isToday(date);

            return (
              <div
                key={dateStr}
                className={`
                  bg-white/10 rounded-lg overflow-hidden
                  ${isCurrentDay ? "ring-1 ring-[#E040FB]" : ""}
                `}
              >
                <div className="flex justify-between items-center p-3 bg-white/5">
                  <div className="font-medium text-white">
                    {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                  </div>
                  {isCurrentDay && (
                    <span className="px-2 py-0.5 bg-[#E040FB]/20 text-[#E040FB] rounded-full text-xs">
                      Today
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  {tasksByDate[dateStr].map((task, idx) => (
                    <div key={idx} className="p-2 rounded text-sm bg-white/10 text-white">
                      {task.subject}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderMonthlyViewResponsive = () => {
    return (
      <>
        <div className="hidden md:block">{renderMonthlyView()}</div>
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-4 bg-white/5 rounded-lg overflow-hidden">
            <button
              className={`flex-1 py-2 flex justify-center items-center gap-1 ${
                calendarViewMobile ? "bg-[#E040FB]/30 text-white" : "bg-transparent text-[#E0B0FF]"
              }`}
              onClick={() => setCalendarViewMobile(true)}
            >
              <Grid size={14} />
              <span>Calendar</span>
            </button>
            <button
              className={`flex-1 py-2 flex justify-center items-center gap-1 ${
                !calendarViewMobile ? "bg-[#E040FB]/30 text-white" : "bg-transparent text-[#E0B0FF]"
              }`}
              onClick={() => setCalendarViewMobile(false)}
            >
              <List size={14} />
              <span>List</span>
            </button>
          </div>
          {calendarViewMobile ? renderMonthlyView() : renderMobileMonthlyView()}
        </div>
      </>
    );
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-6 text-center">Preview Your Schedule</h2>
      <CalendarHeader currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
      {renderMonthlyViewResponsive()}
      <ActionButtons onSave={onSave} onRegenerate={onRegenerate} />
    </div>
  );
};