import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LiquidProgressBar } from "./LiquidProgressBar";
import { ViewToggle } from "./ViewToggle";
import { getSavedSchedules, SavedSchedule } from "../../utils/scheduleStorage";
import { ChevronLeft, ChevronRight, Calendar1 } from "lucide-react";
import { TaskCard } from "./TaskCard";
import Confetti from "react-confetti";
import { ReportComponent } from "./ReportComponent";
import { updateTaskCompletion, getTaskStatus } from "../../utils/scheduleStorage";

// Define the ViewType type
type ViewType = "daily" | "weekly" | "monthly";

// Helper function to get week days
const getWeekDates = (date: Date): Date[] => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  return Array(7).fill(null).map((_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const schedules = getSavedSchedules();
    const found = schedules.find(s => s.id === id);
    if (found) {
      setSchedule(found);
      const completed = found.scheduleData.filter(item => new Date(item.date) < new Date()).length;
      setProgress(Math.round(completed / found.scheduleData.length * 100));
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
        newDate.setDate(newDate.getDate() + modifier * 7);
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
            // Update progress
            const completed = updated.scheduleData.filter(item => item.completed).length;
            setShowConfetti(true);
            setShowOverlay(true);
            setTimeout(() => {
              setShowConfetti(false);
              setShowOverlay(false);
            }, 3000);
            setProgress(Math.round(completed / updated.scheduleData.length * 100));
          }
  }
  const renderDailyView = () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
    const isToday = currentDate.toDateString() === new Date().toDateString();
    return <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
      {showOverlay && <div className="absolute inset-0 flex items-center z-100 justify-center animate-fade-in">
            <p className="text-white text-2xl font-bold">🎉 Amazing! One step closer!</p>
          </div>}
        {showConfetti && <Confetti colors={["#E040FB", "#26A69A", "#FFFFFF"]} recycle={false} numberOfPieces={200} />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">
            {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
          })}
          </h2>
          {isToday && <span className="bg-[#E040FB] px-3 py-1 rounded-full text-sm text-white">
              Today
            </span>}
        </div>
        <div className="space-y-4">
        {tasks.length === 0 ? (
          // Gracefully show a message when there are no tasks for the day.
          <div className="text-center text-white font-medium flex items-center gap-2 px-4 py-2">
            
            <Calendar1 />
            <span>No tasks scheduled for this day.</span>
          </div>
        ) : (
          tasks.map((task, i) => 
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
      </div>;
  };
  const renderWeeklyView = () => {
    const weekDays = getWeekDates(currentDate);
    const today = new Date();
    return <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, i) => {
          const dateStr = date.toISOString().split("T")[0];
          const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
          const isToday = date.toDateString() === today.toDateString();
          return <div key={i} className={`
                  rounded-lg p-3 
                  ${isToday ? "bg-[#E040FB]/20" : "bg-white/10"}
                  transition-all duration-300 hover:bg-white/15
                `}>
                <div className="text-center mb-2">
                  <div className="text-[#E0B0FF] text-sm">
                    {date.toLocaleDateString("en-US", {
                  weekday: "short"
                })}
                  </div>
                  <div className="text-white font-bold">{date.getDate()}</div>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, j) => <div key={j} className="text-white text-sm p-1 rounded bg-white/5">
                      {task.subject}
                    </div>)}
                </div>
              </div>;
        })}
        </div>
      </div>;
  };
  const renderMonthlyView = () => {
    // Get the month days with placeholders included.
    const monthDays = getMonthDates(currentDate);
  
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <div className="grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-[#E0B0FF] text-sm text-center p-2">
              {day}
            </div>
          ))}
            {monthDays.map((date: Date | null, i: number) => {
            // If there is no date, render an empty cell.
            if (!date) {
              return <div key={i} className="min-h-[100px] p-2" />;
            }
        
            const dateStr = date.toISOString().split("T")[0];
            const tasks = schedule?.scheduleData.filter(
              (item: { date: string }) => item.date === dateStr
            ) || [];
        
            return (
              <div
              key={i}
              className={`
                min-h-[100px] p-2 rounded-lg
                ${getTaskColor(date, tasks[0]?.completed)}
                transition-all duration-300 hover:bg-white/15
              `}
              >
              <div className="text-white font-medium mb-1">
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {tasks.map((task: { subject: string }, j: number) => (
                <div
                  key={j}
                  className="text-[#E0B0FF] text-xs truncate"
                  title={task.subject}
                >
                  • {task.subject}
                </div>
                ))}
              </div>
              </div>
            );
            })}
        </div>
      </div>
    );
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