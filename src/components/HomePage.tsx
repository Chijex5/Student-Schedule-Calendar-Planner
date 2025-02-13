import React, { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { ScheduleCard } from "./ScheduleCard";
import { Plus, Download, BookOpen, Calendar, Bell, BarChart, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSavedSchedules, SavedSchedule, removeScheduleById } from "../utils/scheduleStorage";
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => <motion.div initial={{
  opacity: 0,
  y: 20
}} whileInView={{
  opacity: 1,
  y: 0
}} transition={{
  duration: 0.5,
  delay
}} viewport={{
  once: true
}} className="relative overflow-hidden backdrop-blur-[10px] bg-white/10 border border-white/20 p-6 rounded-xl hover:transform hover:-translate-y-2 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-[#E040FB]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="p-3 bg-[#E040FB]/20 w-fit rounded-lg mb-4">
        <Icon className="text-[#E040FB]" size={24} />
      </div>
      <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
      <p className="text-[#E0B0FF] text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>;
const features = [{
  icon: BookOpen,
  title: "Smart Study Planning",
  description: "Intelligently distributes your study materials across your schedule for optimal learning."
}, {
  icon: Calendar,
  title: "Flexible Scheduling",
  description: "Easily adapt your study schedule to fit your lifestyle and learning preferences."
}, {
  icon: Bell,
  title: "Progress Tracking",
  description: "Monitor your study progress with detailed insights and statistics."
}, {
  icon: BarChart,
  title: "Performance Analytics",
  description: "Visualize your learning journey with comprehensive analytics and reports."
}];
export const HomePage = () => {
  const navigate = useNavigate();
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0
  });
  const [ripples, setRipples] = useState<Array<{
    x: number;
    y: number;
    id: number;
  }>>([]);
  useEffect(() => {
    setSavedSchedules(getSavedSchedules());
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({
      x,
      y
    });
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };
  const handleRemove = (id: string) => {
    const newSchedules = removeScheduleById(id);
    setSavedSchedules(newSchedules);
  };
  return <main className="relative min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] overflow-hidden" onMouseMove={handleMouseMove}>
      {ripples.map(ripple => <div key={ripple.id} className="absolute pointer-events-none animate-ripple" style={{
      left: ripple.x,
      top: ripple.y,
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "200px",
      background: "radial-gradient(circle, rgba(224,64,251,0.2) 0%, transparent 70%)",
      borderRadius: "50%"
    }} />)}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center mb-16 pt-16">
          <h1 className="text-[48px] md:text-[64px] font-bold text-white mb-4 leading-tight">
            Build Your Perfect
            <span className="bg-gradient-to-r from-[#E040FB] to-[#26A69A] bg-clip-text text-transparent">
              {" "}
              Reading Schedule
            </span>
          </h1>
          <p className="text-[24px] text-[#E0B0FF] mb-8 max-w-2xl mx-auto">
            Never miss a study session again. Plan, track, and conquer your
            learning goals with our intelligent scheduling system.
          </p>
          <motion.div whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={() => navigate("/create")}>
            <CTAButton>Start Your Learning Journey</CTAButton>
          </motion.div>
        </motion.div>
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-[#E040FB] to-[#26A69A] bg-clip-text text-transparent">
              Effective Learning
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} delay={index * 0.1} />)}
          </div>
        </motion.div>
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
              Your Learning Journey
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
        }} className="group relative overflow-hidden backdrop-blur-[10px] bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300">
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
        }} className="group relative overflow-hidden backdrop-blur-[10px] bg-white/10 border border-white/20 p-8 rounded-xl transition-all duration-300">
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
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="mt-24 text-center px-4 py-12 backdrop-blur-[10px] bg-white/5 rounded-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-[#E0B0FF] mb-8 max-w-xl mx-auto">
            Join thousands of students who have already improved their study
            habits with our intelligent scheduling system.
          </p>
          <motion.div whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={() => navigate("/create")}>
            <CTAButton>
              Get Started Now <ArrowRight className="ml-2" size={20} />
            </CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </main>;
};