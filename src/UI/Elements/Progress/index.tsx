import { Progress } from '@/components/ui/progress';

const ProgressBar = ({ steps, currentStep, dir }) => {
  const avgVal = (currentStep / steps.length) * 100;

  return (
    <div className="">
      <div className="layout-container flex justify-end pt-5 pr-[20px]">
        {steps.length < currentStep ? null : (
          <>
            {currentStep || 0} / {steps.length || 0}
          </>
        )}
      </div>
      <div className="layout-container flex px-6 relative mb-5" dir='rtl'>
        <Progress dir={dir} className="mt-5 h-3" value={avgVal} />
      </div>
    </div>
  );
};

export default ProgressBar;
