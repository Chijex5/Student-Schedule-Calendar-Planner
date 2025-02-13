import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "./StepIndicator";
import { SubjectPill } from "./SubjectPill";
import { Toast } from "./Toast";
import { DateSelection } from "./DateSelection";
import { GeneratedCalendar } from "../Calendar/GeneratedCalendar";
import { generateSchedule, saveSchedule } from "../../utils/scheduleStorage";
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
    navigate("/");
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
    </main>;
};