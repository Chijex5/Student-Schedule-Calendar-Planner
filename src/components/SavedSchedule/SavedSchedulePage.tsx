import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { LiquidProgressBar } from "./LiquidProgressBar";
import { ViewToggle } from "./ViewToggle";
import { getSavedSchedules, SavedSchedule } from "../../utils/scheduleStorage";
import { ChevronLeft, ChevronRight, Calendar, List, Grid } from "lucide-react";
import { TaskCard } from "./TaskCard";
import Confetti from "react-confetti";
import { ReportComponent } from "./ReportComponent";
import { updateTaskCompletion, getTaskStatus, UpdateScheldueName } from "../../utils/scheduleStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Sparkles, Edit3 } from "lucide-react";
import { NotFoundPage } from "../NotFoundPage";

// Define the ViewType type
type ViewType = "daily" | "weekly" | "monthly";

// Helper function to get week days
const getWeekDates = (date: Date): Date[] => {
  const result = Array(7)
    .fill(null)
    .map((_, i) => {
      const day = new Date(date);
      const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      const diff = dayOfWeek === 0 ? -6 + i : i + 1 - dayOfWeek;
      day.setDate(date.getDate() + diff);
      return day;
    });
  return result;
};

// Helper function to get month dates
const getMonthDates = (date: Date): (Date | null)[] => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days: (Date | null)[] = [];
  
  // Calculate offset to start the month grid on Monday
  const offset = (start.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  // Push all actual dates of the month
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export const SavedSchedulePage = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<SavedSchedule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(schedule?.name ||  "Scheldue Name");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useState<ViewType>("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notFound, setNotFound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [achievement, setAchievement] = useState(0);
  const [celebrationType, setCelebrationType] = useState<"confetti" | "achievement" | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [calendarViewMobile, setCalendarViewMobile] = useState(true);

  const week = (day: number) => {
    if (day <= 7) {
      return "Week 1";
    } else if (day <= 14) {
      return "Week 2";
    } else if (day <= 21) {
      return "Week 3";
    } else if (day <= 28) {
      return "Week 4";
    } else if (day <= 31) {
      return "Week 5";
    } else {
      return null;
    }
  };

  const month = currentDate.getMonth();
  const currentday = currentDate.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentWeek = week(currentDate.getDate());
  const now = new Date()


  useEffect(() => {
    const schedules = getSavedSchedules();
    const found = schedules.find(s => s.id === id);
    if (found) {
      setSchedule(found);
      const completed = found.scheduleData.filter(item => item.completed).length;
      const today = new Date();
      setName(found.name);
      const reached = found.scheduleData.filter(item => new Date(item.date) <= today).length;
      setAchievement(Math.round((completed / reached) * 100))
      setProgress(Math.round((reached / found.scheduleData.length) * 100));
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      UpdateScheldueName(schedule?.id!, name);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setCurrentDate(new Date()); // Reset to current date when changing views
  };

  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

const isTodayMatch = now.getDate() === currentDate.getDate() && now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear();


  const handleDateNavigation = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    const modifier = direction === "prev" ? -1 : 1;
    switch (currentView) {
      case "daily":
        newDate.setDate(newDate.getDate() + modifier);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + modifier * 5);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + modifier);
        break;
    }
    setCurrentDate(newDate);
  };

  const complete = (id: string, complete: boolean, date: string) => {
    const updated = updateTaskCompletion(id, date, complete);
    if (updated) {
      setSchedule(updated);
      const today = new Date();
      setName(updated.name)
      const completed = updated.scheduleData.filter(item => item.completed).length;
      const reached = updated.scheduleData.filter(item => new Date(item.date) <= today).length;
      setCelebrationType("confetti");
      setShowAchievement(true);
      setTimeout(() => {
        setCelebrationType("achievement");
      }, 2000);
      setTimeout(() => {
        setCelebrationType(null);
        setShowAchievement(false);
      }, 4000);
      setAchievement(Math.round((completed / reached) * 100))
      setProgress(Math.round((reached / updated.scheduleData.length) * 100));
    }
  };

  const isDateToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  const renderCelebration = () => {
    if (!celebrationType) return null;
    return (
      <>
        {celebrationType === "confetti" && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            colors={["#E040FB", "#26A69A", "#FFFFFF", "#FF4081", "#7C4DFF"]}
            gravity={0.3}
            tweenDuration={4000}
          />
        )}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-xl p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="mb-4"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 animate-ping">
                      <Trophy className="w-16 h-16 text-[#E040FB]" />
                    </div>
                    <Trophy className="w-16 h-16 text-[#E040FB] relative z-10" />
                  </div>
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Task Completed!
                </motion.h2>
                <motion.p
                  className="text-[#E0B0FF] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Keep up the amazing work!
                </motion.p>
                <motion.div
                  className="flex justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Star className="w-6 h-6 text-[#E040FB]" fill="#E040FB" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="fixed inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight }}
              animate={{ y: -100, x: Math.random() * window.innerWidth }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "loop" }}
            >
              <Sparkles className="w-6 h-6 text-[#E040FB]" />
            </motion.div>
          ))}
        </motion.div>
      </>
    );
  };

  const renderDailyView = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;
    const tasks = schedule?.scheduleData.filter(item => item.date === formatted) || [];
    const isToday = isDateToday(currentDate);

    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-bold">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            {isToday && (
              <span className="px-4 py-1.5 bg-[#E040FB]/20 text-[#E040FB] rounded-full text-sm font-medium">
                Today
              </span>
            )}
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-12 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
              <Calendar className="mx-auto text-[#E0B0FF] mb-4" size={32} />
              <p className="text-white font-medium">No tasks scheduled</p>
              <p className="text-[#E0B0FF] text-sm mt-1">Take this time to review or rest</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, i) => (
                <TaskCard
                  key={i}
                  subject={task.subject}
                  date={task.date}
                  status={getTaskStatus(task.date, task.completed)}
                  complete={schedule?.id ? () => complete(schedule.id!, true, task.date) : undefined}
                  onComplete={isToday && task.completed ? () => {} : undefined}
                />
              ))}
            </div>
          )}
        </div>
        {renderCelebration()}
      </div>
    );
  };

  const renderMobileWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    const weekdayDates = weekDates.slice(0, 5); // Monday to Friday

    return (
      <div>
        <div className="mb-4">
          <h2 className="text-white text-xl font-bold">
            Week of {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h2>
        </div>
        <div className="space-y-4">
          {weekdayDates.map((date, i) => {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formatted = `${year}-${month}-${day}`;
            const tasks = schedule?.scheduleData.filter(item => item.date === formatted) || [];
            const isToday = isDateToday(date);

            return (
              <div key={i} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-bold">
                    {date.toLocaleDateString("en-US", { weekday: "long", day: "numeric" })}
                  </h3>
                  {isToday && (
                    <span className="px-2 py-1 bg-[#E040FB]/20 text-[#E040FB] rounded-full text-sm">
                      Today
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <div className="text-center py-2 text-[#E0B0FF]">No tasks scheduled</div>
                  ) : (
                    tasks.map((task, j) => (
                      <div
                        key={j}
                        className={`
                          p-3 rounded-lg text-sm
                          ${task.completed ? "bg-[#26A69A]/20 text-[#26A69A]" : "bg-white/10 text-white"}
                        `}
                      >
                        {task.subject}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    const today = new Date();
    const weekdayDates = weekDates.slice(0, 5);

    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold">
            Week of{" "}
            {weekDates[0].toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {weekdayDates.map((date, i) => {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const tasks = schedule?.scheduleData.filter(item => item.date === getLocalDateString(date)) || [];
            const isToday = isDateToday(date);
            const isPast = date < today;

            return (
              <div
                key={i}
                className={`
                  rounded-xl p-4
                  backdrop-blur-md
                  ${isToday ? "bg-[#E040FB]/20 ring-2 ring-[#E040FB]" : "bg-white/5"}
                  transition-all duration-300
                  hover:bg-white/10
                `}
              >
                <div className="text-center mb-4">
                  <div className="text-[#E0B0FF] text-sm mb-1">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-white text-xl font-bold">{date.getDate()}</div>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, j) => (
                    <div
                      key={j}
                      className={`
                        p-3 rounded-lg text-sm
                        ${
                          task.completed
                            ? "bg-[#26A69A]/20 text-[#26A69A]"
                            : isPast
                            ? "bg-[#FF5252]/20 text-[#FF5252]"
                            : "bg-white/10 text-white"
                        }
                      `}
                    >
                      {task.subject}
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-3">
                      <span className="text-[#E0B0FF]/60 text-sm">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthDays = getMonthDates(currentDate);
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 md:p-6">
        <div className="grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="hidden md:block text-[#E0B0FF] text-sm text-center p-2">
              {day}
            </div>
          ))}
          {[{day:"M", id:1}, {day:"T", id:2},{day:"W", id:`3`},{day:"T", id:4},{day:"F", id:5},{day:"S", id:6},{day:"S", id:7}].map(day => (
            <div key={day.id} className="md:hidden text-[#E0B0FF] text-xs text-center p-1">
              {day.day}
            </div>
          ))}
          {monthDays.map((date: Date | null, i: number) => {
            if (!date) {
              return <div key={i} className="min-h-[38px] md:min-h-[100px] p-1 md:p-2" />;
            }

            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const tasks = schedule?.scheduleData.filter(item => item.date === getLocalDateString(date)) || [];
            
            // Fixed date comparison for today
            const isToday = isDateToday(date);

            return (
              <div
                key={i}
                className={`
                  relative group
                  min-h-[38px] md:min-h-[100px]
                  p-1 md:p-2
                  rounded-lg
                  ${isWeekend ? "bg-white/5" : getTaskColor(date, tasks[0]?.completed ?? false)}
                  ${tasks[0]?.completed ? "line-through" : ""}
                  transition-all duration-300
                  hover:bg-white/15
                  ${isToday ? "ring-1 ring-[#E040FB]" : ""}
                `}
              >
                {!isWeekend && tasks.length > 0 && (
                  <div className="absolute top-0 right-0 md:hidden">
                    <div className="h-3 w-3 transform rotate-45 bg-[#E040FB]/80 rounded-sm" />
                  </div>
                )}
                <div
                  className={`
                    text-white font-medium
                    text-xs md:text-sm
                    ${isToday ? "text-[#E040FB]" : ""}
                    ${isWeekend ? "opacity-50" : ""}
                    ${tasks.length > 0 ? "font-bold" : ""}
                  `}
                >
                  {date.getDate()}
                </div>
                {!isWeekend && (
                  <>
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
                    {tasks.map((task: { subject: string; completed?: boolean }, j: number) => { // ✅ This logs the task during render

                      return (
                        <div
                          key={j}
                          className={`text-[#E0B0FF] text-xs truncate ${task.completed ? "line-through" : ""}`}
                          title={task.subject}
                        >
                          • {task.subject}
                        </div>
                      );
                    })}

                    </div>
                  </>
                )}
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
    const tasksByDate: Record<string, { subject: string; completed: boolean }[]> = {};
    if (schedule?.scheduleData) {
      schedule.scheduleData.forEach(item => {
        if (!tasksByDate[item.date]) {
          tasksByDate[item.date] = [];
        }
        tasksByDate[item.date].push({
          subject: item.subject,
          completed: item.completed ?? false,
        });
      });
    }

    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const datesWithTasks = Object.keys(tasksByDate)
      .filter(dateStr => {
        const date = new Date(dateStr);
        return date >= currentMonthStart && date <= currentMonthEnd;
      })
      .sort();

    return (
      <div className="md:hidden space-y-2">
        {datesWithTasks.length === 0 ? (
          <div className="text-center py-8 text-[#E0B0FF]">No tasks scheduled this month</div>
        ) : (
          datesWithTasks.map(dateStr => {
            const date = new Date(dateStr);
            const isToday = isDateToday(date);

            return (
              <div
                key={dateStr}
                className={`
                  bg-white/10 rounded-lg overflow-hidden
                  ${isToday ? "ring-1 ring-[#E040FB]" : ""}
                `}
              >
                <div className="flex justify-between items-center p-3 bg-white/5">
                  <div className="font-medium text-white">
                    {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                  </div>
                  {isToday && (
                    <span className="px-2 py-0.5 bg-[#E040FB]/20 text-[#E040FB] rounded-full text-xs">
                      Today
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  {tasksByDate[dateStr].map((task, idx) => (
                    <div
                      key={idx}
                      className={`
                        p-2 rounded text-sm
                        ${task.completed ? "bg-[#26A69A]/20 text-[#26A69A] line-through" : "bg-white/10 text-white"}
                      `}
                    >
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

  const getTaskColor = (date: Date, completed?: boolean) => {
    const dateStr = getLocalDateString(date);
    const status = getTaskStatus(dateStr, completed);
    switch (status) {
      case "completed":
        return "bg-[#26A69A]/10";
      case "missed":
        return "bg-[#FF6B6B]/10";
      case "today":
        return "bg-[#E040FB]/20";
      default:
        return "bg-white/10";
    }
  };

  if (!schedule) return null;

  return (
    <main className="min-h-screen w-full bg-[#2D0A54] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-4 items-center">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-b-2 border-white text-white text-3xl font-bold outline-none"
              />
            ) : (
              <h1 className="text-white text-3xl font-bold">{name}</h1>
            )}
            <button onClick={handleEditClick}>
              <Edit3 className="text-white" />
            </button>
          </div>
          <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
        </div>
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-xl p-4">
              <button
                onClick={() => handleDateNavigation("prev")}
                className="text-white hover:text-[#E040FB] transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className={`${ isTodayMatch ? "text-[#E040FB]" : "text-white" } hover:text-[#E040FB] transition-colors text-lg font-medium`}
              >
                {currentView === "daily"
                  ? dayNames[currentday]
                  : currentView === "weekly"
                  ? currentWeek
                  : new Date(currentDate.getFullYear(), month).toLocaleDateString("en-US", {
                      month: "long",
                    })}
              </button>
              <button
                onClick={() => handleDateNavigation("next")}
                className="text-white hover:text-[#E040FB] transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            {currentView === "daily" && renderDailyView()}
            {currentView === "weekly" && (
              <>
                <div className="hidden md:block">{renderWeeklyView()}</div>
                <div className="md:hidden">{renderMobileWeeklyView()}</div>
              </>
            )}
            {currentView === "monthly" && renderMonthlyViewResponsive()}
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-[#E040FB] text-xl font-bold mb-6">Overall Progress</h2>
            <LiquidProgressBar progress={progress} achievement={achievement}/>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <ReportComponent scheduleData={schedule.scheduleData} />
          </div>
        </div>
      </div>
    </main>
  );
};