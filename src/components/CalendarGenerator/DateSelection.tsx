import React from "react";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";
export const DateSelection = ({
  startDate,
  endDate,
  name,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  error
}: {
  startDate: string;
  endDate: string;
  name: string;
  onNameChange: (name: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error: string;
}) => {
  const minEndDate = startDate || new Date().toISOString().split("T")[0];
  return <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl text-white font-bold mb-2">
          Set Your Study Timeline
        </h2>
        <p className="text-[#E0B0FF]">
          Choose when you want to start and end your study schedule
        </p>
      </div>
      <div className="space-y-6">
        {/* Schedule Name Input */}
        <div className="group relative backdrop-blur-md bg-white/5 rounded-xl p-6 border-2 border-[#4A148C] focus-within:border-[#E040FB] transition-all duration-300">
          <label className="block text-[#E0B0FF] mb-2 text-sm font-medium">
            Schedule Name
          </label>
          <div className="flex items-center gap-3">
            <input id="name" type="text" value={name} onChange={e => onNameChange(e.target.value)} className="w-full bg-transparent text-white text-lg outline-none placeholder:text-[#E0B0FF]/50" placeholder="e.g., Spring Semester Study Plan" />
          </div>
        </div>
        {/* Date Selection Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="group relative backdrop-blur-md bg-white/5 rounded-xl p-6 border-2 border-[#4A148C] focus-within:border-[#E040FB] transition-all duration-300">
            <label className="block text-[#E0B0FF] mb-2 text-sm font-medium">
              Start Date
            </label>
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-[#E040FB]" size={20} />
              <input type="date" value={startDate} onChange={e => onStartDateChange(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-transparent text-white text-lg outline-none [color-scheme:dark]" />
            </div>
          </div>
          {/* End Date */}
          <div className="group relative backdrop-blur-md bg-white/5 rounded-xl p-6 border-2 border-[#4A148C] focus-within:border-[#E040FB] transition-all duration-300">
            <label className="block text-[#E0B0FF] mb-2 text-sm font-medium">
              End Date
            </label>
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-[#E040FB]" size={20} />
              <input type="date" value={endDate} onChange={e => onEndDateChange(e.target.value)} min={minEndDate} className="w-full bg-transparent text-white text-lg outline-none [color-scheme:dark]" />
            </div>
          </div>
        </div>
        {/* Schedule Info */}
        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-[#4A148C]">
          <div className="flex items-start gap-3">
            <Info className="text-[#E040FB] mt-1" size={20} />
            <div>
              <h3 className="text-white font-medium mb-1">Schedule Details</h3>
              <p className="text-[#E0B0FF] text-sm">
                Your study schedule will be created for weekdays only
                (Monday-Friday). Weekends are reserved for rest and review.
              </p>
            </div>
          </div>
        </div>
        {/* Error Message */}
        {error && <div className="backdrop-blur-md bg-[#FF5252]/20 rounded-xl p-4 border border-[#FF5252]/30 flex items-center gap-3">
            <Clock className="text-[#FF5252]" size={20} />
            <p className="text-[#FF5252] text-sm" role="alert">
              {error}
            </p>
          </div>}
      </div>
    </div>;
};