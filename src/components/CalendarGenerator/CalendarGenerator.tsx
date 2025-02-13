import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "./StepIndicator";
import { SubjectPill } from "./SubjectPill";
import { Toast } from "./Toast";
import { DateSelection } from "./DateSelection";
import { GeneratedCalendar } from "../Calendar/GeneratedCalendar";
import { generateSchedule, saveSchedule } from "../../utils/scheduleStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
export const CalendarGenerator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [scheduleData, setScheduleData] = useState<{
    date: string;
    subject: string;
  }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    if (subjects.includes(trimmedValue)) {
      setIsShaking(true);
      setShowToast(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setSubjects([...subjects, trimmedValue]);
    setInputValue("");
  };
  const handleDateValidation = () => {
    if (!startDate || !endDate) {
      setDateError("Please select both start and end dates");
      return false;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setDateError("End date must be after start date");
      return false;
    }
    setDateError("");
    return true;
  };
  const handleNextStep = () => {
    if (currentStep === 1 && subjects.length >= 3) {
      setCurrentStep(2);
    } else if (currentStep === 2 && handleDateValidation()) {
      const generated = generateSchedule(subjects, startDate, endDate, false);
      setScheduleData(generated);
      setCurrentStep(3);
    }
  };
  const handleSave = () => {
    const schedule = saveSchedule({
      name,
      subjects,
      startDate,
      endDate,
      scheduleData
    });
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      navigate("/");
    }, 3000);
  };
  const handleRegenerate = () => {
    const generated = generateSchedule(subjects, startDate, endDate, false);
    setScheduleData(generated);
  };
  return <main className="min-h-screen w-full bg-[#2D0A54] px-4 py-8 md:px-8">
      <div className="max-w-2xl mx-auto">
        <StepIndicator currentStep={currentStep} />
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
          {currentStep === 1 && <>
              <h2 className="text-2xl text-white font-bold mb-6">
                Add Your Subjects
              </h2>
              <form onSubmit={handleAddSubject} className="mb-8">
                <div className={`relative ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Enter subject (e.g., 'Biology')" className={`
                      w-full px-4 py-3 rounded-lg
                      bg-transparent
                      text-white placeholder-[#E0B0FF]
                      border-2 ${isShaking ? "border-[#FF6B6B]" : "border-[#4A148C]"}
                      focus:border-[#E040FB]
                      outline-none
                      transition-all duration-300
                    `} />
                </div>
              </form>
              <div className="mb-8">
                {subjects.map((subject, index) => <SubjectPill key={index} subject={subject} onDelete={() => {
              setSubjects(subjects.filter((_, i) => i !== index));
            }} />)}
              </div>
            </>}
          {currentStep === 2 && <DateSelection startDate={startDate} endDate={endDate} name={name} onStartDateChange={setStartDate} onEndDateChange={setEndDate} onNameChange={setName} error={dateError} />}
          {currentStep === 3 && <GeneratedCalendar scheduleData={scheduleData} onSave={handleSave} onRegenerate={handleRegenerate} />}
          {currentStep < 3 && <button onClick={handleNextStep} disabled={currentStep === 1 ? subjects.length < 3 : false} className={`
                w-full py-3 px-6 rounded-lg
                transition-all duration-500
                ${currentStep === 1 && subjects.length >= 3 || currentStep === 2 ? "bg-gradient-to-r from-[#E040FB] to-[#9C27B0] hover:bg-gradient-to-l" : "bg-[#6A1B9A] opacity-50 cursor-not-allowed"}
                text-white font-medium
              `}>
              Next Step
            </button>}
        </div>
      </div>
      {showToast && <Toast message="This subject already exists!" onClose={() => setShowToast(false)} />}
      <AnimatePresence>
        {showCelebration && <motion.div initial={{
        opacity: 0,
        scale: 0.5
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.5
      }} className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <motion.div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 text-center max-w-md mx-4" initial={{
          y: 50
        }} animate={{
          y: 0
        }} exit={{
          y: 50
        }}>
              <motion.div className="mb-6" animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          }} transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}>
                <Trophy className="w-16 h-16 text-[#E040FB] mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Congratulations!
              </h2>
              <p className="text-[#E0B0FF] mb-6">
                You've taken an important step towards your learning goals. Your
                study schedule has been created successfully!
              </p>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => <motion.div key={i} initial={{
              opacity: 0,
              scale: 0
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: i * 0.1
            }}>
                    <Star className="w-6 h-6 text-[#E040FB]" fill="#E040FB" />
                  </motion.div>)}
              </div>
              <motion.div className="absolute inset-0 pointer-events-none" initial={{
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
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </main>;
};