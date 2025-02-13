import { CheckCircle, XCircle, Clock } from "lucide-react";
interface TaskCardProps {
  subject: string;
  date: string;
  status: "completed" | "missed" | "upcoming" | "today";
  onComplete?: () => void;
  complete?: () => void ;
}
export const TaskCard = ({
  subject,
  status,
  complete,
  onComplete
}: TaskCardProps) => {
  console.log(!status );

  
  
  const getStatusDisplay = () => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="text-[#26A69A]" size={20} />,
          text: "Completed",
          bgColor: "bg-[#26A69A]/10"
        };
      case "missed":
        return {
          icon: <XCircle className="text-[#FF6B6B]" size={20} />,
          text: "Missed",
          bgColor: "bg-[#FF6B6B]/10"
        };
      case "upcoming":
        return {
          icon: <Clock className="text-[#E0B0FF]" size={20} />,
          text: "Upcoming",
          bgColor: "bg-white/5"
        };
      case "today":
        return {
          icon: <Clock className="text-[#E040FB]" size={20} />,
          text: "Today's Task",
          bgColor: "bg-[#E040FB]/10"
        };
      default:
        return {
          icon: null,
          text: "",
          bgColor: "bg-white/5"
        };
    }
  };
  const {
    icon,
    text,
    bgColor
  } = getStatusDisplay();
  return <div className={`${bgColor} rounded-lg p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white font-medium">{subject}</span>
        </div>
        <span className="text-[#E0B0FF] text-sm">{text}</span>
      </div>
      {status === "today" && !onComplete && <button onClick={complete} className="mt-4 w-full py-2 bg-[#E040FB] text-white rounded-lg
            hover:bg-[#E040FB]/80 transition-all duration-300">
          Mark as Complete
        </button>}
    </div>;
};