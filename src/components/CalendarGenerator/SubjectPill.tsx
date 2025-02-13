import React from "react";
import { X } from "lucide-react";
export const SubjectPill = ({
  subject,
  onDelete
}: {
  subject: string;
  onDelete: () => void;
}) => {
  return <div className="inline-flex items-center px-4 py-2 bg-[#4A148C] rounded-full mr-2 mb-2">
      <span className="text-white mr-2">{subject}</span>
      <button onClick={onDelete} className="text-[#FF6B6B] hover:text-white transform hover:scale-120 transition-all duration-300">
        <X size={16} />
      </button>
    </div>;
};