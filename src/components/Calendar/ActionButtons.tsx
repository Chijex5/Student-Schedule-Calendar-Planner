import React, { useState } from "react";
import { Save, Check, Shuffle } from "lucide-react";
export const ActionButtons = ({
  onSave,
  onRegenerate
}: {
  onSave: () => void;
  onRegenerate: () => void;
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const handleSave = () => {
    setIsSaved(true);
    onSave();
    setTimeout(() => setIsSaved(false), 2000);
  };
  return <div className="flex gap-4 mt-6">
      <button onClick={onRegenerate} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#4A148C] text-white rounded-lg hover:bg-[#6A1B9A] transition-colors duration-300">
        <Shuffle size={20} />
        Shuffle Subjects
      </button>
      <button onClick={handleSave} className={`
          flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg
          transition-all duration-300
          ${isSaved ? "bg-[#26A69A]" : "bg-[#E040FB]"}
          text-white
        `}>
        {isSaved ? <Check className="animate-[spin_0.5s_ease-out]" size={20} /> : <Save size={20} />}
        Save Schedule
      </button>
    </div>;
};