import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface TourContextType {
  isOpen: boolean;
  activeStep: number;
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const startTour = useCallback(() => {
    setActiveStep(0);
    setIsOpen(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsOpen(false);
    setActiveStep(0);
  }, []);

  const nextStep = useCallback(() => setActiveStep((s) => s + 1), []);
  const prevStep = useCallback(() => setActiveStep((s) => Math.max(0, s - 1)), []);
  const setStep = useCallback((step: number) => setActiveStep(step), []);

  return (
    <TourContext.Provider value={{ isOpen, activeStep, startTour, stopTour, nextStep, prevStep, setStep }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within a TourProvider');
  return context;
};
