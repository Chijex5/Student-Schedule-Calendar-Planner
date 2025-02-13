import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { ScheduleCard } from "./ScheduleCard";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainBackgroundWithRipple from "./HomeMain";
import { getSavedSchedules, SavedSchedule, removeScheduleById } from "../utils/scheduleStorage";
export const HomePage = () => {
  const navigate = useNavigate();
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  useEffect(() => {
    setSavedSchedules(getSavedSchedules());
  }, []);
  const handleRemove = (id: string) => {
    const newSchedules = removeScheduleById(id);
    setSavedSchedules(newSchedules);
  };
  return <MainBackgroundWithRipple>
  <main className="min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] px-4 py-8 md:px-8">
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
        {savedSchedules.length > 0 ? <div className="mt-16">
            <h2 className="text-white text-2xl mb-6">Your Saved Schedules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchedules.map(schedule => <ScheduleCard key={schedule.id} schedule={schedule} remove={handleRemove} />)}
            </div>
          </div> : <div className="mt-16 space-y-8">
            {/* Create New Schedule Card */}
            <div className="group relative overflow-hidden backdrop-blur-[10px] bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6A1B9A]/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#E040FB]/20">
                    <Plus className="text-[#E040FB]" size={24} />
                  </div>
                  <h3 className="text-white text-xl font-semibold">Start Fresh</h3>
                </div>
                <p className="text-[#E0B0FF] text-sm leading-relaxed">
                  Create a new study schedule tailored to your goals and availability.
                </p>
                <button onClick={() => navigate('/create')} className="w-full mt-4 px-6 py-3 bg-[#E040FB]/20 hover:bg-[#E040FB]/30 text-[#E0B0FF] rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Create New Schedule
                </button>
              </div>
            </div>

            {/* Or Separator */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#E0B0FF]/20"></div>
              <span className="flex-shrink mx-4 text-[#E0B0FF]/50 text-sm">or</span>
              <div className="flex-grow border-t border-[#E0B0FF]/20"></div>
            </div>

            {/* Import Data Card */}
            <div className="group relative overflow-hidden backdrop-blur-[10px] bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6A1B9A]/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#26A69A]/20">
                    <Download className="text-[#26A69A]" size={24} />
                  </div>
                  <h3 className="text-white text-xl font-semibold">Continue Progress</h3>
                </div>
                <p className="text-[#E0B0FF] text-sm leading-relaxed">
                  Already have saved data? Import your existing schedule to pick up where you left off.
                </p>
                <button onClick={() => navigate('/data')} className="w-full mt-4 px-6 py-3 border border-[#E040FB] hover:bg-[#E040FB]/10 text-[#E0B0FF] rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Download size={18} />
                  Import Now
                </button>
              </div>
            </div>
          </div>}
      </div>
    </main>
    </MainBackgroundWithRipple>;
};