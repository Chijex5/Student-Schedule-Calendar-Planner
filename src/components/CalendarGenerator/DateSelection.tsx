
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold mb-6">Set Name and Study Duration</h2>
      <div className="space-y-4">
        {/* Start Date Input */}
        <div className="group">
          <label 
            htmlFor="name" 
            className="block text-[#E0B0FF] mb-2 transition-colors duration-200 group-focus-within:text-[#E040FB]"
          >
            Schedule Name
          </label>
          <input
            id="Name"
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border-2 border-[#4A148C] focus:border-[#E040FB] outline-none transition-all duration-200 placeholder:text-[#E0B0FF]/50 hover:border-[#E040FB]/50"
            placeholder="Enter a name for your schedule"
          />
        </div>
        <div className="group">
          <label 
            htmlFor="start-date" 
            className="block text-[#E0B0FF] mb-2 transition-colors duration-200 group-focus-within:text-[#E040FB]"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => onStartDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border-2 border-[#4A148C] focus:border-[#E040FB] outline-none transition-all duration-200 placeholder:text-[#E0B0FF]/50 hover:border-[#E040FB]/50"
            placeholder=" "
          />
        </div>

        {/* End Date Input */}
        <div className="group">
          <label 
            htmlFor="end-date" 
            className="block text-[#E0B0FF] mb-2 transition-colors duration-200 group-focus-within:text-[#E040FB]"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={e => onEndDateChange(e.target.value)}
            min={minEndDate}
            className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border-2 focus:border-[#E040FB] outline-none transition-all duration-200 placeholder:text-[#E0B0FF]/50 hover:border-[#E040FB]/50 ${
              error ? "border-[#FF6B6B] animate-shake" : "border-[#4A148C]"
            }`}
            placeholder=" "
          />
          <p className="text-sm text-[#E0B0FF]/70 mt-1">
            Available from {minEndDate}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p 
            className="text-[#FF6B6B] text-sm flex items-center gap-2"
            role="alert"
            aria-live="polite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

// Add this CSS for the shake animation
const styles = document.createElement('style');
styles.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
`;
document.head.appendChild(styles);