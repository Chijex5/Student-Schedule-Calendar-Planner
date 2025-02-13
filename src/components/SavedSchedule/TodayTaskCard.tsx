import React, { useEffect, useState } from "react";
import { Book, CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
interface TodayTaskCardProps {
  subject: string;
  nextSubject: string;
  date: string;
  completed: boolean;
  onComplete: () => void;
}
export const TodayTaskCard: React.FC<TodayTaskCardProps> = ({
  subject,
  nextSubject,
  date,
  completed,
  onComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isMissed, setIsMissed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    const now = new Date();
    const taskDate = new Date(date);
    if (taskDate < now && !isCompleted) {
      setIsMissed(true);
    }
  }, [date, isCompleted]);
  const handleComplete = () => {
    setShowConfetti(true);
    setIsCompleted(true);
    setIsMissed(false);
    setShowOverlay(true);
    onComplete();
    setTimeout(() => {
      setShowConfetti(false);
      setShowOverlay(false);
    }, 3000);
  };
  return <div className="relative">
      <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-500 ${isMissed ? "bg-[#FF6B6B] animate-[shake_0.5s_ease-in-out] shadow-lg" : "bg-white/15 backdrop-blur-md"}`}>
        <h2 className="text-[#E040FB] text-xl font-bold mb-4">Today's Reading</h2>
        <div className="flex items-center mb-6">
          <Book className="text-[#26A69A] mr-3" size={24} />
          <span className="text-white text-2xl font-bold">{subject}</span>
        </div>
        {!isCompleted && !isMissed && <div className="text-[#E0B0FF]">
            <p className="text-sm">Up Next</p>
            <p className="font-medium">{nextSubject}</p>
          </div>}
        {isMissed && <div className="flex items-center text-white">
            <span className="text-2xl mr-2">😞</span>
            <p>Oops! You missed this session</p>
          </div>}
        {!isCompleted && !isMissed && <button onClick={handleComplete} className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#E040FB] text-white flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95">
            <CheckCircle size={24} />
          </button>}
      </div>
      {showOverlay && <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <p className="text-white text-2xl font-bold">🎉 Amazing! One step closer!</p>
        </div>}
      {showConfetti && <Confetti colors={["#E040FB", "#26A69A", "#FFFFFF"]} recycle={false} numberOfPieces={200} />}
    </div>;
};