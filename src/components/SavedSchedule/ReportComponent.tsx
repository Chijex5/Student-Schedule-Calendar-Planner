import React, { useEffect, useState, Component } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, TrendingUp, Frown, Meh, Smile, Star, Award, Zap, Target, Calendar as CalendarIcon } from "lucide-react";
interface ReportComponentProps {
  scheduleData: Array<{
    date: string;
    completed?: boolean;
  }>;
}
export const ReportComponent: React.FC<ReportComponentProps> = ({
  scheduleData
}) => {
  const [feedback, setFeedback] = useState<{
    message: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("progress");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calculateStreak = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    scheduleData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach((item, index) => {
      if (item.completed) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    return {
      currentStreak,
      maxStreak
    };
  };
  const {
    currentStreak,
    maxStreak
  } = calculateStreak();
  const getMotivationalFeedback = (successRate: number) => {
    const feedback = {
      poor: {
        title: "Needs Improvement",
        message: ["Every great journey starts with a single step. Missed a few? That’s okay! Today is a fresh start!", "Progress isn’t about being perfect—it’s about showing up. Let’s turn things around, one step at a time!", "Failure is just a lesson in disguise. You’ve got this—pick up where you left off and keep going!"],
        icon: <Frown className="text-red-500" size={24} />
      },
      okish: {
        title: "Keep Going",
        message: ["You're on the right track! A little more consistency and you'll be unstoppable!", "Small steps still lead to big destinations. Keep pushing forward!", "You're getting there! Every effort counts, and your progress is already showing!"],
        icon: <Meh className="text-yellow-500" size={24} />
      },
      good: {
        title: "Great Work",
        message: ["Great job! A little more effort and you’ll be at the top of your game!", "Consistency is key, and you’re proving it! Keep going—you're closer than you think!", "Your hard work is paying off! Stay focused and keep up the momentum!"],
        icon: <Smile className="text-green-500" size={24} />
      },
      perfect: {
        title: "Outstanding",
        message: ["Wow! You're on fire! Keep this energy up and the sky’s the limit!", "Perfection is a habit, and you’re proving it every day! Keep shining!", "You’re setting a new standard for excellence! Keep up the amazing work!"],
        icon: <Star className="text-purple-500" size={24} />
      }
    };
    if (successRate < 25) return {
      ...feedback.poor,
      message: feedback.poor.message[Math.floor(Math.random() * feedback.poor.message.length)]
    };
    if (successRate < 50) return {
      ...feedback.okish,
      message: feedback.okish.message[Math.floor(Math.random() * feedback.okish.message.length)]
    };
    if (successRate < 75) return {
      ...feedback.good,
      message: feedback.good.message[Math.floor(Math.random() * feedback.good.message.length)]
    };
    return {
      ...feedback.perfect,
      message: feedback.perfect.message[Math.floor(Math.random() * feedback.perfect.message.length)]
    };
  };
  const {
    completedDays,
    missedDays,
    remainingDays
  } = scheduleData.reduce((acc, item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    if (item.completed) {
      acc.completedDays++;
    } else if (itemDate < today) {
      acc.missedDays++;
    } else if (itemDate >= today) {
      acc.remainingDays++;
    }
    return acc;
  }, {
    completedDays: 0,
    missedDays: 0,
    remainingDays: 0
  });
  const totalDays = scheduleData.length;
  const successRate = Math.round(completedDays / (completedDays + missedDays) * 100) || 0;
  useEffect(() => {
    setFeedback(getMotivationalFeedback(successRate));
  }, [successRate]);
  const MetricCard = ({
    icon: Icon,
    title,
    value,
    color,
    subtitle,
    onClick,
    isSelected
  }: {
    icon: any;
    title: string;
    value: number | string;
    color: string;
    subtitle?: string;
    onClick?: () => void;
    isSelected?: boolean;
  }) => <motion.div whileHover={{
    y: -4
  }} onClick={onClick} className={`
        flex items-center p-4 backdrop-blur-md rounded-xl gap-4 cursor-pointer
        transition-all duration-300
        ${isSelected ? "ring-2 ring-[#E040FB]" : ""}
        ${color}
      `}>
      <div className="p-3 rounded-full bg-white/10">
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <div className="text-[#E0B0FF] text-sm">{title}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-[#E0B0FF]/70 text-xs mt-1">{subtitle}</div>}
      </div>
    </motion.div>;
  const AchievementBadge = ({
    icon: Icon,
    title,
    value
  }: {
    icon: any;
    title: string;
    value: string;
  }) => <motion.div initial={{
    opacity: 0,
    scale: 0.8
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="flex flex-col items-center p-4 backdrop-blur-md rounded-xl bg-white/5">
      <div className="p-3 rounded-full bg-[#E040FB]/20 mb-2">
        <Icon className="text-[#E040FB]" size={24} />
      </div>
      <div className="text-white text-sm font-medium text-center">{title}</div>
      <div className="text-[#E0B0FF] text-xs mt-1">{value}</div>
    </motion.div>;
  return <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={CheckCircle2} title="Completion Rate" value={`${successRate}%`} color="bg-[#26A69A]/20" subtitle="Of all due tasks" onClick={() => setSelectedMetric("progress")} isSelected={selectedMetric === "progress"} />
        <MetricCard icon={Zap} title="Current Streak" value={currentStreak} color="bg-[#E040FB]/20" subtitle={`Best: ${maxStreak} days`} onClick={() => setSelectedMetric("streak")} isSelected={selectedMetric === "streak"} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <AchievementBadge icon={Target} title="Accuracy" value={`${successRate}% On Track`} />
        <AchievementBadge icon={Award} title="Streak" value={`${currentStreak} Days`} />
        <AchievementBadge icon={CalendarIcon} title="Completed" value={`${completedDays} Tasks`} />
      </div>
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
        <div className="flex justify-between text-[#E0B0FF] text-sm mb-2">
          <span>Overall Progress</span>
          <span>
            {completedDays} of {totalDays} days
          </span>
        </div>
        <div className="relative h-2 bg-[#4A148C]/20 rounded-full overflow-hidden">
          <motion.div initial={{
          width: 0
        }} animate={{
          width: `${completedDays / totalDays * 100}%`
        }} transition={{
          duration: 1,
          ease: "easeOut"
        }} className="absolute h-full bg-[#26A69A]" />
          <motion.div initial={{
          width: 0
        }} animate={{
          width: `${missedDays / totalDays * 100}%`,
          x: `${completedDays / totalDays * 100}%`
        }} transition={{
          duration: 1,
          ease: "easeOut"
        }} className="absolute h-full bg-[#FF5252]" />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={feedback?.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="flex items-center p-4 backdrop-blur-md rounded-xl gap-4 border border-[#4A148C]/30 hover:border-[#E040FB]/20 transition-colors duration-200">
          <div className={`p-3 rounded-full ${feedback?.title === "Needs Improvement" ? "bg-red-500/20" : feedback?.title === "Keep Going" ? "bg-yellow-500/20" : feedback?.title === "Great Work" ? "bg-green-500/20" : "bg-purple-500/20"}`}>
            {feedback?.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[#E0B0FF] text-sm font-semibold mb-1 tracking-wide">
              {feedback?.title}
            </h3>
            <p className="text-white/80 text-sm leading-snug">
              {feedback?.message}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>;
};