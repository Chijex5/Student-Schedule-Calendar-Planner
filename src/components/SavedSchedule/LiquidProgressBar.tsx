import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
export const LiquidProgressBar = ({
  progress
}: {
  progress: number;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev < progress) {
          const next = Math.min(prev + 1, progress);
          if (next === 100 && prev !== 100) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }
          return next;
        }
        clearInterval(timer);
        return prev;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [progress]);
  const circleVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: animatedProgress / 100,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  return <div className="relative w-full max-w-xs mx-auto">
      <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.5
    }} className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-[#4A148C] opacity-20" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
          <motion.circle className="text-[#E040FB]" strokeWidth="8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" variants={circleVariants} initial="hidden" animate="visible" />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.span className="text-4xl font-bold text-white" initial={{
          scale: 0.5,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: 0.2
        }}>
            {Math.round(animatedProgress)}%
          </motion.span>
        </div>
        {showCelebration && <motion.div initial={{
        scale: 0,
        rotate: -180
      }} animate={{
        scale: 1,
        rotate: 0
      }} transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }} className="absolute -top-8 -right-8 p-3 bg-[#E040FB]/20 rounded-full">
            <Trophy className="text-[#E040FB] w-6 h-6" />
          </motion.div>}
      </motion.div>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3
    }} className="text-center space-y-2">
        <p className="text-[#E0B0FF] text-lg font-medium">
          {progress === 100 ? "Complete!" : "Keep going!"}
        </p>
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => <motion.div key={i} initial={{
          opacity: 0,
          scale: 0
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.4 + i * 0.1
        }}>
              <Star className={`w-4 h-4 ${i < Math.floor(progress / 20) ? "text-[#E040FB]" : "text-[#4A148C]"}`} fill={i < Math.floor(progress / 20) ? "#E040FB" : "transparent"} />
            </motion.div>)}
        </div>
      </motion.div>
    </div>;
};