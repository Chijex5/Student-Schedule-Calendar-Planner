import { useEffect, useState } from "react";
export const LiquidProgressBar = ({
  progress
}: {
  progress: number;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        }
        clearInterval(timer);
        return prev;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [progress]);
  return <div className="relative w-full max-w-xs mx-auto">
      {/* Progress Circle */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-[#4A148C] opacity-20" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
          <circle className="text-[#E040FB] transition-all duration-300" strokeWidth="8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" strokeDasharray={`${animatedProgress * 3.64} 364`} />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-4xl font-bold text-white">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      </div>
      {/* Progress Details */}
      <div className="text-center text-[#E0B0FF] mt-4">
        <p className="text-sm">
          {progress === 100 ? "Complete!" : "Keep going!"}
        </p>
      </div>
    </div>;
};