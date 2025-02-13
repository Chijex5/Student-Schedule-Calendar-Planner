import React from "react";
export const CTAButton = ({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return <button onClick={onClick} className="
        relative px-8 py-3 
        text-white bg-primary rounded-lg 
        transform transition-all duration-300
        shadow-[0_0_10px_rgba(224,64,251,0.5)]
        hover:scale-105 hover:shadow-[0_0_15px_rgba(224,64,251,0.8)]
        active:scale-95 
        text-lg font-medium
        before:absolute before:inset-0 before:rounded-lg
        before:bg-primary-light before:opacity-0 before:transition-opacity
        hover:before:opacity-20
      ">
      {children}
    </button>;
};