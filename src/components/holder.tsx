import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { ScheduleCard } from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import { getSavedSchedules, SavedSchedule, removeScheduleById } from "../utils/scheduleStorage";
export const HomePage = () => {
  const navigate = useNavigate();
  const [ripplePos, setRipplePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  useEffect(() => {
    setSavedSchedules(getSavedSchedules());
  }, []);
  const handleRemove = (id: string) => {
    const newSchedules = removeScheduleById(id);
    setSavedSchedules(newSchedules);
  };
  return <main className="min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] px-4 py-8 md:px-8" onMouseMove={handleMouseMove} onMouseLeave={() => setRipplePos(null)}>
    {ripplePos && <div className="absolute pointer-events-none" style={{
      left: ripplePos.x,
      top: ripplePos.y,
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "200px",
      background: "radial-gradient(circle, rgba(224,64,251,0.2) 0%, transparent 70%)",
      borderRadius: "50%",
      transition: "all 0.5s ease-out"
    }} />}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 pt-16">
          <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
            Build Your Perfect Reading Schedule
          </h1>
          <p className="text-[24px] text-[#E0B0FF] mb-8">
            Never miss a study session again. Plan, track, conquer.
          </p>
          <div onClick={() => navigate("/create")}>
            <CTAButton>Start New Study Calendar</CTAButton>
          </div>
        </div>
        {savedSchedules.length > 0 && <div className="mt-16">
            <h2 className="text-white text-2xl mb-6">Your Saved Schedules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchedules.map(schedule => <ScheduleCard key={schedule.id} schedule={schedule} remove={handleRemove} />)}
            </div>
          </div>}
      </div>
    </main>;
};