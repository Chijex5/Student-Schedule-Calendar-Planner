import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, TrendingUp, Frown, Meh, Smile, Star } from "lucide-react";



interface ReportComponentProps {
  scheduleData: Array<{ date: string; completed?: boolean }>;
}

export const ReportComponent: React.FC<ReportComponentProps> = ({ scheduleData }) => {
  // Calculate metrics
  const [feedback, setFeedback] = useState<{ message: string; title: string; icon: JSX.Element } | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = scheduleData.length;

  const getMotivationalFeedback = (successRate: number) => {
    const feedback = {
      poor: {
        title: "Needs Improvement",
        message: [
          "Every great journey starts with a single step. Missed a few? That’s okay! Today is a fresh start!",
          "Progress isn’t about being perfect—it’s about showing up. Let’s turn things around, one step at a time!",
          "Failure is just a lesson in disguise. You’ve got this—pick up where you left off and keep going!",
        ],
        icon: <Frown className="text-red-500" size={24} />,
      },
      okish: {
        title: "Keep Going",
        message: [
          "You're on the right track! A little more consistency and you'll be unstoppable!",
          "Small steps still lead to big destinations. Keep pushing forward!",
          "You're getting there! Every effort counts, and your progress is already showing!",
        ],
        icon: <Meh className="text-yellow-500" size={24} />,
      },
      good: {
        title: "Great Work",
        message: [
          "Great job! A little more effort and you’ll be at the top of your game!",
          "Consistency is key, and you’re proving it! Keep going—you're closer than you think!",
          "Your hard work is paying off! Stay focused and keep up the momentum!",
        ],
        icon: <Smile className="text-green-500" size={24} />,
      },
      perfect: {
        title: "Outstanding",
        message: [
          "Wow! You're on fire! Keep this energy up and the sky’s the limit!",
          "Perfection is a habit, and you’re proving it every day! Keep shining!",
          "You’re setting a new standard for excellence! Keep up the amazing work!",
        ],
        icon: <Star className="text-purple-500" size={24} />,
      },
    };
  
    if (successRate < 25) return { ...feedback.poor, message: feedback.poor.message[Math.floor(Math.random() * feedback.poor.message.length)] };
    if (successRate < 50) return { ...feedback.okish, message: feedback.okish.message[Math.floor(Math.random() * feedback.okish.message.length)] };
    if (successRate < 75) return { ...feedback.good, message: feedback.good.message[Math.floor(Math.random() * feedback.good.message.length)] };
    return { ...feedback.perfect, message: feedback.perfect.message[Math.floor(Math.random() * feedback.perfect.message.length)] };
  };
  
  const { completedDays, missedDays, remainingDays } = scheduleData.reduce(
    (acc, item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
  
      if (item.completed) {
        acc.completedDays++;
      } else if (itemDate < today) { // Changed: compare with "today" instead of "now"
        acc.missedDays++;
      } else if (itemDate >= today) {
        acc.remainingDays++;
      }
      
      return acc;
    },
    { completedDays: 0, missedDays: 0, remainingDays: 0 }
  );

  const successRate: number = Math.round((completedDays / (completedDays + missedDays)) * 100) || 0;
  
  useEffect(() => {
    setFeedback(getMotivationalFeedback(successRate));
  }, [successRate]);
  
  const MetricCard = ({ 
    icon, 
    title, 
    value,
    color 
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="flex items-center p-4 bg-white/5 backdrop-blur-md rounded-xl gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-[#E0B0FF] text-sm">{title}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      <MetricCard
        icon={<CheckCircle2 size={24} className="text-white" />}
        title="Days Completed"
        value={completedDays}
        color="bg-[#26A69A]/20"
      />
      
      <MetricCard
        icon={<XCircle size={24} className="text-white" />}
        title="Days Missed"
        value={missedDays}
        color="bg-[#FF5252]/20"
      />
      
      <MetricCard
        icon={<Clock size={24} className="text-white" />}
        title="Days Remaining"
        value={remainingDays}
        color="bg-[#2196F3]/20"
      />
      
      <MetricCard
        icon={<TrendingUp size={24} className="text-white" />}
        title="Success Rate"
        value={successRate}
        color="bg-[#E040FB]/20"
      />

      {/* Progress breakdown footer */}
      <div className="col-span-2 p-4 bg-white/5 backdrop-blur-md rounded-xl">
        <div className="flex justify-between text-[#E0B0FF] text-sm mb-2">
          <span>Total Schedule Days</span>
          <span>{totalDays}</span>
        </div>
        <div className="relative h-2 bg-[#4A148C]/20 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-[#26A69A] transition-all duration-500" 
            style={{ width: `${(completedDays / totalDays) * 100}%` }}
          />
          <div 
            className="absolute h-full bg-[#FF5252] transition-all duration-500" 
            style={{ 
              left: `${(completedDays / totalDays) * 100}%`,
              width: `${(missedDays / totalDays) * 100}%` 
            }}
          />
        </div>
        
      </div>
      {feedback && remainingDays === scheduleData.length ?(
        <div className="col-span-2">
        <div className="flex items-center w-[100%] p-4 bg-white/5 backdrop-blur-md rounded-xl gap-4 border border-[#4A148C]/30 hover:border-[#E040FB]/20">
            <p className="text-white/80 text-sm leading-snug">
            Your journey is just beginning! Once you start completing tasks, your success rate will light up. Keep pushing forward!
            </p>
        </div>
        </div>
      ) : (
        <div className="col-span-2">
            <div className="flex items-center p-4 bg-white/5 backdrop-blur-md rounded-xl gap-4 border border-[#4A148C]/30 hover:border-[#E040FB]/20 transition-colors duration-200">
            <div className={`p-3 rounded-full ${
                feedback?.title === 'Needs Improvement' ? 'bg-red-500/20' :
                feedback?.title === 'Keep Going' ? 'bg-yellow-500/20' :
                feedback?.title === 'Great Work' ? 'bg-green-500/20' :
                'bg-purple-500/20'
            }`}>
                {feedback?.icon && React.cloneElement(feedback.icon, {
                className: `${
                    feedback.title === 'Needs Improvement' ? 'text-red-400' :
                    feedback.title === 'Keep Going' ? 'text-yellow-400' :
                    feedback.title === 'Great Work' ? 'text-green-400' :
                    'text-purple-400'
                }`
                })}
            </div>
            <div className="flex-1">
                <h3 className="text-[#E0B0FF] text-sm font-semibold mb-1 tracking-wide">
                {feedback?.title}
                </h3>
                <p className="text-white/80 text-sm leading-snug">
                {feedback?.message}
                </p>
            </div>
            </div>
        </div>
        )}
        </div>
  );
};