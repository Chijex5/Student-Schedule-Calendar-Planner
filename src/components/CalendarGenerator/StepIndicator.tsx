export const StepIndicator = ({
  currentStep
}: {
  currentStep: number;
}) => {
  return <div className="flex justify-center mb-8">
      {[1, 2, 3].map(step => <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === currentStep ? "bg-[#E040FB] text-white" : step < currentStep ? "bg-[#26A69A] text-white" : "bg-[#4A148C] text-[#E0B0FF]"}`}>
            {step}
          </div>
          {step < 3 && <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-[#26A69A]" : "bg-[#4A148C]"}`} />}
        </div>)}
    </div>;
};