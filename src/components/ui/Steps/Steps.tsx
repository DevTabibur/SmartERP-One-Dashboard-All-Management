import React, { forwardRef, HTMLAttributes, createContext, useContext, ReactNode } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  disabled?: boolean;
  icon?: ReactNode;
}

export interface StepsContextType {
  currentStep: number;
  steps: Step[];
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToFirstStep: () => void;
  goToLastStep: () => void;
}

const StepsContext = createContext<StepsContextType | null>(null);

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within a Steps component');
  }
  return context;
};

export interface StepsProps extends HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  variant?: 'default' | 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  showStepNumbers?: boolean;
  showStepDescriptions?: boolean;
  clickable?: boolean;
  allowSkip?: boolean;
}

export interface StepItemProps extends HTMLAttributes<HTMLDivElement> {
  step: Step;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  onClick?: () => void;
}

export interface StepContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface StepNavigationProps extends HTMLAttributes<HTMLDivElement> {
  showPrevious?: boolean;
  showNext?: boolean;
  showFinish?: boolean;
  previousText?: string;
  nextText?: string;
  finishText?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

const Steps = forwardRef<HTMLDivElement, StepsProps>(
  ({
    className,
    steps,
    currentStep = 0,
    onStepChange,
    variant = 'horizontal',
    size = 'md',
    showStepNumbers = true,
    showStepDescriptions = true,
    clickable = false,
    allowSkip = false,
    ...props
  }, ref) => {
    const goToStep = (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length && onStepChange) {
        onStepChange(stepIndex);
      }
    };

    const nextStep = () => {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    };

    const previousStep = () => {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    };

    const goToFirstStep = () => goToStep(0);
    const goToLastStep = () => goToStep(steps.length - 1);

    const contextValue: StepsContextType = {
      currentStep,
      steps,
      goToStep,
      nextStep,
      previousStep,
      goToFirstStep,
      goToLastStep,
    };

    const variantClasses = {
      horizontal: 'flex flex-row space-x-4',
      vertical: 'flex flex-col space-y-4'
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    return (
      <StepsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              index={index}
              isActive={index === currentStep}
              isCompleted={step.status === 'completed'}
              isClickable={clickable && !step.disabled}
              onClick={() => clickable && !step.disabled && goToStep(index)}
            />
          ))}
        </div>
      </StepsContext.Provider>
    );
  }
);

const StepItem = forwardRef<HTMLDivElement, StepItemProps>(
  ({
    className,
    step,
    index,
    isActive,
    isCompleted,
    isClickable,
    onClick,
    ...props
  }, ref) => {
    const getStatusIcon = () => {
      if (step.icon) return step.icon;
      
      if (isCompleted) {
        return <CheckIcon className="h-5 w-5 text-white" />;
      }
      
      return (
        <span className="text-sm font-medium">
          {index + 1}
        </span>
      );
    };

    const getStatusClasses = () => {
      if (step.status === 'error') {
        return 'bg-red-500 border-red-500 text-white';
      }
      
      if (isCompleted) {
        return 'bg-green-500 border-green-500 text-white';
      }
      
      if (isActive) {
        return 'bg-blue-500 border-blue-500 text-white';
      }
      
      return 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          isClickable && 'cursor-pointer',
          step.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={isClickable ? onClick : undefined}
        {...props}
      >
        {/* Step Circle */}
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
            getStatusClasses()
          )}
        >
          {getStatusIcon()}
        </div>

        {/* Step Content */}
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3
              className={cn(
                'font-medium',
                isActive && 'text-blue-600 dark:text-blue-400',
                isCompleted && 'text-green-600 dark:text-green-400',
                step.status === 'error' && 'text-red-600 dark:text-red-400',
                !isActive && !isCompleted && step.status !== 'error' && 'text-gray-900 dark:text-gray-100'
              )}
            >
              {step.title}
            </h3>
          </div>
          
          {step.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {step.description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

const StepContent = forwardRef<HTMLDivElement, StepContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const StepNavigation = forwardRef<HTMLDivElement, StepNavigationProps>(
  ({
    className,
    showPrevious = true,
    showNext = true,
    showFinish = false,
    previousText = 'Previous',
    nextText = 'Next',
    finishText = 'Finish',
    onPrevious,
    onNext,
    onFinish,
    disablePrevious = false,
    disableNext = false,
    ...props
  }, ref) => {
    const { currentStep, steps, previousStep, nextStep } = useSteps();
    
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const handlePrevious = () => {
      if (onPrevious) {
        onPrevious();
      } else {
        previousStep();
      }
    };

    const handleNext = () => {
      if (onNext) {
        onNext();
      } else {
        nextStep();
      }
    };

    const handleFinish = () => {
      onFinish?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        <div>
          {showPrevious && !isFirstStep && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={disablePrevious}
              className={cn(
                'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700',
                'dark:focus:ring-offset-gray-900',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200'
              )}
            >
              {previousText}
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {showNext && !isLastStep && (
            <button
              type="button"
              onClick={handleNext}
              disabled={disableNext}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200'
              )}
            >
              {nextText}
            </button>
          )}

          {showFinish && isLastStep && (
            <button
              type="button"
              onClick={handleFinish}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md',
                'hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                'transition-colors duration-200'
              )}
            >
              {finishText}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Steps.displayName = 'Steps';
StepItem.displayName = 'StepItem';
StepContent.displayName = 'StepContent';
StepNavigation.displayName = 'StepNavigation';

export { Steps, StepItem, StepContent, StepNavigation };
export default Steps;
