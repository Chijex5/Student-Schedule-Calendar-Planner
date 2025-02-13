import React, { useEffect, useState, Component } from "react";
import { useParams } from "react-router-dom";
import { LiquidProgressBar } from "./LiquidProgressBar";
import { ViewToggle } from "./ViewToggle";
import { getSavedSchedules, SavedSchedule } from "../../utils/scheduleStorage";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import Confetti from "react-confetti";
import { ReportComponent } from "./ReportComponent";
import { updateTaskCompletion, getTaskStatus } from "../../utils/scheduleStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Sparkles, PartyPopper, Award } from "lucide-react";
import { NotFoundPage } from "../NotFoundPage";

// Define the ViewType type
type ViewType = "daily" | "weekly" | "monthly";

// Helper function to get week days
const getWeekDates = (date: Date): Date[] => {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  monday.setDate(diff);
  return Array(7).fill(null).map((_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
};
const getMonthDates = (date: Date): (Date | null)[] => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days: (Date | null)[] = [];
  const offset = (start.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  // Now push all the actual dates of the month.
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};
export const SavedSchedulePage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [schedule, setSchedule] = useState<SavedSchedule | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notFound, setNotFound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [celebrationType, setCelebrationType] = useState<"confetti" | "achievement" | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  useEffect(() => {
    const schedules = getSavedSchedules();
    const found = schedules.find(s => s.id === id);
    if (found) {
      setSchedule(found);
      const completed = found.scheduleData.filter(item => new Date(item.date) < new Date()).length;
      setProgress(Math.round(completed / found.scheduleData.length * 100));
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setCurrentDate(new Date()); // Reset to current date when changing views
  };
  const handleDateNavigation = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    const modifier = direction === "prev" ? -1 : 1;
    switch (currentView) {
      case "daily":
        newDate.setDate(newDate.getDate() + modifier);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + modifier * 5); // Change from 7 to 5 days
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
      const completed = updated.scheduleData.filter(item => item.completed).length;
      setCelebrationType("confetti");
      setShowOverlay(true);
      setShowAchievement(true);
      setTimeout(() => {
        setCelebrationType("achievement");
      }, 2000);
      setTimeout(() => {
        setShowOverlay(false);
        setCelebrationType(null);
        setShowAchievement(false);
      }, 4000);
      setProgress(Math.round(completed / updated.scheduleData.length * 100));
    }
  };
  if (notFound) {
    return <NotFoundPage />;
  }
  
  const renderCelebration = () => {
    if (!celebrationType) return null;
    return <>
        {celebrationType === "confetti" && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} colors={["#E040FB", "#26A69A", "#FFFFFF", "#FF4081", "#7C4DFF"]} gravity={0.3} tweenDuration={4000} />}
        <AnimatePresence>
          {showAchievement && <motion.div initial={{
          scale: 0,
          y: 50
        }} animate={{
          scale: 1,
          y: 0
        }} exit={{
          scale: 0,
          y: -50
        }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <motion.div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 text-center" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }}>
                <motion.div className="mb-4" animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }} transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 animate-ping">
                      <Trophy className="w-16 h-16 text-[#E040FB]" />
                    </div>
                    <Trophy className="w-16 h-16 text-[#E040FB] relative z-10" />
                  </div>
                </motion.div>
                <motion.h2 className="text-2xl font-bold text-white mb-2" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }}>
                  Task Completed!
                </motion.h2>
                <motion.p className="text-[#E0B0FF] mb-4" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.4
            }}>
                  Keep up the amazing work!
                </motion.p>
                <motion.div className="flex justify-center gap-2" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.6
            }}>
                  {[...Array(5)].map((_, i) => <motion.div key={i} initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                delay: 0.6 + i * 0.1,
                type: "spring",
                stiffness: 300
              }}>
                      <Star className="w-6 h-6 text-[#E040FB]" fill="#E040FB" />
                    </motion.div>)}
                </motion.div>
              </motion.div>
            </motion.div>}
        </AnimatePresence>
        <motion.div className="fixed inset-0 pointer-events-none" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
          {Array.from({
          length: 3
        }).map((_, i) => <motion.div key={i} className="absolute" initial={{
          x: Math.random() * window.innerWidth,
          y: window.innerHeight
        }} animate={{
          y: -100,
          x: Math.random() * window.innerWidth
        }} transition={{
          duration: 2,
          delay: i * 0.3,
          repeat: Infinity,
          repeatType: "loop"
        }}>
              <Sparkles className="w-6 h-6 text-[#E040FB]" />
            </motion.div>)}
        </motion.div>
      </>;
  };
  const renderDailyView = () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
    const isToday = currentDate.toDateString() === new Date().toDateString();
    return <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-bold">
              {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
            </h2>
            {isToday && <span className="px-4 py-1.5 bg-[#E040FB]/20 text-[#E040FB] rounded-full text-sm font-medium">
                Today
              </span>}
          </div>
          {tasks.length === 0 ? <div className="text-center py-12 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
              <Calendar className="mx-auto text-[#E0B0FF] mb-4" size={32} />
              <p className="text-white font-medium">No tasks scheduled</p>
              <p className="text-[#E0B0FF] text-sm mt-1">
                Take this time to review or rest
              </p>
            </div> : <div className="space-y-4">
              {tasks.map((task, i) => <TaskCard key={i} subject={task.subject} date={task.date} status={getTaskStatus(task.date, task.completed)} complete={schedule?.id ? () => complete(schedule.id!, true, task.date) : undefined} onComplete={isToday && task.completed ? () => {} : undefined} />)}
            </div>}
        </div>
        {renderCelebration()}
      </div>;
  };
  const renderWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    const today = new Date();
    const weekdayDates = weekDates.slice(0, 5);
    return <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold">
            Week of{" "}
            {weekDates[0].toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
          })}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {weekdayDates.map((date, i) => {
          const dateStr = date.toISOString().split("T")[0];
          const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
          const isToday = date.toDateString() === today.toDateString();
          const isPast = date < today;
          const status = tasks[0]?.completed ? "completed" : isPast ? "missed" : isToday ? "today" : "upcoming";
          return <div key={i} className={`
                  rounded-xl p-4
                  backdrop-blur-md
                  ${isToday ? "bg-[#E040FB]/20 ring-2 ring-[#E040FB]" : "bg-white/5"}
                  transition-all duration-300
                  hover:bg-white/10
                `}>
                <div className="text-center mb-4">
                  <div className="text-[#E0B0FF] text-sm mb-1">
                    {date.toLocaleDateString("en-US", {
                  weekday: "short"
                })}
                  </div>
                  <div className="text-white text-xl font-bold">
                    {date.getDate()}
                  </div>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, j) => <div key={j} className={`
                        p-3 rounded-lg text-sm
                        ${task.completed ? "bg-[#26A69A]/20 text-[#26A69A]" : isPast ? "bg-[#FF5252]/20 text-[#FF5252]" : "bg-white/10 text-white"}
                      `}>
                      {task.subject}
                    </div>)}
                  {tasks.length === 0 && <div className="text-center py-3">
                      <span className="text-[#E0B0FF]/60 text-sm">
                        No tasks
                      </span>
                    </div>}
                </div>
              </div>;
        })}
        </div>
      </div>;
  };
  const renderMonthlyView = () => {
    const monthDays = getMonthDates(currentDate);
    const isMobile = window.innerWidth < 768;
    return <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 md:p-6">
        <div className="grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <div key={day} className="hidden md:block text-[#E0B0FF] text-sm text-center p-2">
              {day}
            </div>)}
          {["M", "T", "W", "T", "F", "S", "S"].map(day => <div key={day} className="md:hidden text-[#E0B0FF] text-xs text-center p-1">
              {day}
            </div>)}
          {monthDays.map((date: Date | null, i: number) => {
          if (!date) {
            return <div key={i} className="min-h-[40px] md:min-h-[100px] p-1 md:p-2" />;
          }
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const dateStr = date.toISOString().split("T")[0];
          const tasks = !isWeekend ? schedule?.scheduleData.filter((item: {
            date: string;
          }) => item.date === dateStr) || [] : [];
          const isToday = date.toDateString() === new Date().toDateString();
          return <div key={i} className={`
                relative
                min-h-[40px] md:min-h-[100px] 
                p-1 md:p-2 
                rounded-lg
                ${isWeekend ? "bg-white/5" : getTaskColor(date, tasks[0]?.completed)}
                transition-all duration-300 
                hover:bg-white/15
                ${isToday ? "ring-1 ring-[#E040FB]" : ""}
              `}>
                <div className={`
                  text-white font-medium 
                  text-xs md:text-sm
                  ${isToday ? "text-[#E040FB]" : ""}
                  ${isWeekend ? "opacity-50" : ""}
                `}>
                  {date.getDate()}
                </div>
                {!isWeekend && <>
                    <div className="md:hidden">
                      {tasks.length > 0 && <div className="mt-1 w-2 h-2 rounded-full bg-[#E040FB]" />}
                    </div>
                    <div className="hidden md:block space-y-1 mt-1">
                      {tasks.map((task: {
                  subject: string;
                }, j: number) => <div key={j} className="text-[#E0B0FF] text-xs truncate" title={task.subject}>
                            • {task.subject}
                          </div>)}
                    </div>
                  </>}
              </div>;
        })}
        </div>
      </div>;
  };
  const getTaskColor = (date: Date, completed?: boolean) => {
    const status = getTaskStatus(date.toISOString().split("T")[0], completed);
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
  return <main className="min-h-screen w-full bg-[#2D0A54] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-white text-3xl font-bold">{schedule.name}</h1>
          <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
        </div>
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-xl p-4">
              <button onClick={() => handleDateNavigation("prev")} className="text-white hover:text-[#E040FB] transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="text-white hover:text-[#E040FB] transition-colors text-lg font-medium">
                {currentView === "daily" ? "Today" : currentView === "weekly" ? "This Week" : "This Month"}
              </button>
              <button onClick={() => handleDateNavigation("next")} className="text-white hover:text-[#E040FB] transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
            {currentView === "daily" && renderDailyView()}
            {currentView === "weekly" && renderWeeklyView()}
            {currentView === "monthly" && renderMonthlyView()}
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-[#E040FB] text-xl font-bold mb-6">
              Overall Progress
            </h2>
            <LiquidProgressBar progress={progress} />
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <ReportComponent scheduleData={schedule.scheduleData} />
          </div>
        </div>
      </div>
    </main>;
};