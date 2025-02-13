import React, { useEffect } from "react";
export const Toast = ({
  message,
  onClose
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed bottom-4 right-4 animate-[bounce-in_0.5s_ease-out]">
      <div className="bg-[#FF6B6B] text-white px-4 py-3 rounded-lg shadow-lg">
        {message}
      </div>
    </div>;
};
// Add these keyframes to your global CSS
const styles = `
@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% { transform: scale(0.9); }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;