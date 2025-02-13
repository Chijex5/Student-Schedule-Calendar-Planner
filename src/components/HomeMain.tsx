import React, { useState } from 'react';

const MainBackgroundWithRipple = ({ children }: { children: React.ReactNode }) => {
  // Create a state for the ripple position
  const [mainRipplePos, setMainRipplePos] = useState<{ x: number; y: number } | null>(null);

  // Handler for mouse movement on the main container
  const handleMainMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMainRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMainMouseLeave = () => {
    setMainRipplePos(null);
  };

  return (
    <main
      className="relative min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] px-4 py-8 md:px-8 overflow-hidden"
      onMouseMove={handleMainMouseMove}
      onMouseLeave={handleMainMouseLeave}
    >
      {mainRipplePos && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mainRipplePos.x,
            top: mainRipplePos.y,
            transform: "translate(-50%, -50%)",
            width: "200px", // a bit larger for the background ripple
            height: "200px",
            background: "radial-gradient(circle, rgba(224,64,251,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            transition: "all 0.5s ease-out",
          }}
        />
      )}

      {/* Render all your page content here */}
      {children}
    </main>
  );
};

export default MainBackgroundWithRipple;
