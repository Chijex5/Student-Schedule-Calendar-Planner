import React, { useState } from "react";
export const SubjectTag = ({
  subject
}: {
  subject: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return <div className="relative">
      <div className="
          inline-block bg-accent-teal text-white text-sm px-2 py-1 
          rounded-md cursor-pointer transform transition-all duration-300 
          hover:scale-110 hover:shadow-lg hover:shadow-accent-teal/20
          active:scale-95
        " onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        {subject}
      </div>
      {showTooltip && <div className="
          absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 
          mb-2 px-3 py-2 bg-primary text-white text-sm rounded-lg 
          shadow-lg whitespace-nowrap animate-fade-in
        ">
          Study session: {subject}
          <div className="
            absolute bottom-0 left-1/2 transform -translate-x-1/2 
            translate-y-1/2 rotate-45 w-2 h-2 bg-primary
          " />
        </div>}
    </div>;
};