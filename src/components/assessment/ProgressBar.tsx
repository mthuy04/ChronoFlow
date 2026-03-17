interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    progress: number;
  }
  
  export default function ProgressBar({
    currentStep,
    totalSteps,
    progress,
  }: ProgressBarProps) {
    return (
      <div className="mb-10">
        <div className="flex justify-between text-xs uppercase tracking-widest text-[#A39C93] mb-3 font-medium">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{progress}%</span>
        </div>
  
        <div className="h-1 w-full bg-[#EAE6DF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4B59E] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }