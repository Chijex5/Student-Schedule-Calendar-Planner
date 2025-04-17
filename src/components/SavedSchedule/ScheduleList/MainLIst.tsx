import React, { useEffect, useState } from "react";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScheduleCard } from "../../ScheduleCard";
import { getSavedSchedules, removeScheduleById, SavedSchedule } from "../../../utils/scheduleStorage";
export const MainPage = () => {
    const navigate = useNavigate();
    const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
    useEffect(() => {
        setSavedSchedules(getSavedSchedules());
      }, []);
    const handleRemove = (id: string) => {
        const newSchedules = removeScheduleById(id);
        setSavedSchedules(newSchedules);
      };
    return(
        <div className="min-h-screen px-6 w-full bg-gradient-to-br from-[#1A0830] to-[#2D0A54] overflow-hidden">
            {savedSchedules.length > 0 ? <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Your Saved Scheldues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchedules.map((schedule, index) => <motion.div key={schedule.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                  <ScheduleCard schedule={schedule} remove={handleRemove} />
                </motion.div>)}
            </div>
          </motion.div> : <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Your Journey
              </h2>
              <p className="text-[#E0B0FF] mb-8">
                Choose how you'd like to begin your learning adventure
              </p>
            </div>
            <motion.div whileHover={{
          y: -8
        }} className="group relative overflow-hidden sm:max-w-[500px] mx-auto backdrop-blur-[10px] bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#E040FB]/20">
                    <Plus className="text-[#E040FB]" size={24} />
                  </div>
                  <h3 className="text-white text-xl font-semibold">
                    Start Fresh
                  </h3>
                </div>
                <p className="text-[#E0B0FF] text-sm leading-relaxed">
                  Create a new study schedule tailored to your goals and
                  availability.
                </p>
                <button onClick={() => navigate("/create")} className="w-full mt-4 px-6 py-3 bg-[#E040FB]/20 hover:bg-[#E040FB]/30 text-[#E0B0FF] rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Create New Schedule
                </button>
              </div>
            </motion.div>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#E0B0FF]/20"></div>
              <span className="flex-shrink mx-4 text-[#E0B0FF]/50 text-sm">
                or
              </span>
              <div className="flex-grow border-t border-[#E0B0FF]/20"></div>
            </div>
            <motion.div whileHover={{
          y: -8
        }} className="group relative overflow-hidden backdrop-blur-[10px] sm:max-w-[500px] mx-auto bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#26A69A]/20">
                    <Download className="text-[#26A69A]" size={24} />
                  </div>
                  <h3 className="text-white text-xl font-semibold">
                    Continue Progress
                  </h3>
                </div>
                <p className="text-[#E0B0FF] text-sm leading-relaxed">
                  Already have saved data? Import your existing schedule to pick
                  up where you left off.
                </p>
                <button onClick={() => navigate("/data")} className="w-full mt-4 px-6 py-3 border border-[#E040FB] hover:bg-[#E040FB]/10 text-[#E0B0FF] rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Download size={18} />
                  Import Now
                </button>
              </div>
            </motion.div>
          </motion.div>}
        </div>
    );
};
