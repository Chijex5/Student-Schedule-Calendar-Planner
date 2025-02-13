import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Sparkles, Binary } from "lucide-react";
export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0
  });
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    id: number;
  }>>([]);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({
      x,
      y
    });
    // Create new particle
    if (Math.random() > 0.8) {
      const newParticle = {
        x,
        y,
        id: Date.now()
      };
      setParticles(prev => [...prev, newParticle]);
      // Remove particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    }
  };
  return <main className="relative min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Floating particles */}
      {particles.map(particle => <motion.div key={particle.id} initial={{
      x: particle.x,
      y: particle.y,
      opacity: 1
    }} animate={{
      y: particle.y - 100,
      opacity: 0
    }} transition={{
      duration: 1,
      ease: "easeOut"
    }} className="absolute pointer-events-none">
          <Binary className="text-[#E040FB] w-4 h-4" />
        </motion.div>)}
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div initial={{
        scale: 0.5,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="mb-8">
          <h1 className="relative text-[120px] md:text-[200px] font-bold text-white leading-none">
            {/* Glitch layers */}
            <span className="absolute inset-0 text-[#E040FB] opacity-50 animate-glitch-1">
              404
            </span>
            <span className="absolute inset-0 text-[#26A69A] opacity-50 animate-glitch-2">
              404
            </span>
            404
          </h1>
        </motion.div>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Reality Distortion Detected
          </h2>
          <p className="text-[#E0B0FF] text-lg max-w-md mx-auto">
            The timeline you're looking for seems to have slipped into a
            parallel dimension.
          </p>
        </motion.div>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.4
      }}>
          <button onClick={() => navigate("/")} className="group relative px-8 py-3 bg-[#E040FB]/20 hover:bg-[#E040FB]/30 
              text-white rounded-lg transition-all duration-300 
              hover:transform hover:scale-105 flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span>Return to Reality</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E040FB] 
              transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>
        </motion.div>
        {/* Decorative elements */}
        <motion.div className="absolute inset-0 pointer-events-none" animate={{
        backgroundColor: ["rgba(224,64,251,0.03)", "rgba(38,166,154,0.03)"]
      }} transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }} />
        {Array.from({
        length: 20
      }).map((_, i) => <motion.div key={i} className="absolute" initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      }} animate={{
        y: [0, -20, 0],
        x: i % 2 === 0 ? [0, 20, 0] : [0, -20, 0]
      }} transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.1
      }}>
            <Sparkles className="text-[#E040FB]/20 w-4 h-4" />
          </motion.div>)}
      </div>
    </main>;
};