import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SavedSchedule } from "../utils/scheduleStorage";
import { Trash2 } from "lucide-react";
interface ScheduleCardProps {
  schedule: SavedSchedule;
  progress?: number;
  remove: (id: string) => void;
}
const calculateProgress = (startDate: string, endDate: string): number => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  if (now < start) return 0;
  if (now >= end) return 100;
  const totalDuration = end - start;
  const elapsedTime = now - start;
  return Math.min(elapsedTime / totalDuration * 100, 100);
};
export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  progress,
  remove
}) => {
  const navigate = useNavigate();
  const [ripplePos, setRipplePos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Compute progress if not provided
  const displayProgress = progress ?? calculateProgress(schedule.startDate, schedule.endDate);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  const start = new Date(schedule.startDate).getTime();
  const end = new Date(schedule.endDate).getTime();
  const now = new Date().getTime();
  const formattedDate = `${new Date(schedule.startDate).toLocaleDateString()} - ${new Date(schedule.endDate).toLocaleDateString()}`;
  return <div onClick={() => navigate(`/schedule/${schedule.id}`)} className="
        relative overflow-hidden
        backdrop-blur-[10px] 
        bg-white/10 
        border border-white/20
        p-6 rounded-xl 
        transition-all duration-300
        hover:transform hover:-translate-y-2.5
        hover:shadow-lg hover:shadow-[#6A1B9A]/20
        group cursor-pointer
      " onMouseMove={handleMouseMove} onMouseLeave={() => setRipplePos(null)}>
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
      <h3 className="text-white text-xl font-bold mb-2">{schedule.name}</h3>
      <p className="text-[#E0B0FF] mb-4">{formattedDate}</p>
      <div className="mb-4">
        <div className="h-1 bg-[#4A148C] rounded-full overflow-hidden">
          <div className="h-full bg-[#26A69A] transition-all duration-300" style={{
          width: `${displayProgress}%`
        }} />
        </div>
        <p className="text-[#E0B0FF] text-sm mt-1">
          {now < start ? "Yet to Start" : now >= end ? "Finished" : `${displayProgress.toFixed(1)}% Complete`}
        </p>

      </div>
      <div className="flex justify-between">
      <button className="text-white relative inline-block group">
        View Schedule
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26A69A] transition-all duration-300 group-hover:w-full" />
      </button>
      <Trash2 className="text-[#FF6B6B] cursor-pointer" onClick={e => {
        e.stopPropagation();
        remove(schedule.id);
      }} />
      </div>
    </div>;
};