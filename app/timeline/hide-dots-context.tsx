import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface HideDotsContextType {
  hideDots: boolean;
  setHideDots: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with undefined default
const HideDotsContext = createContext<HideDotsContextType | undefined>(undefined);

// Custom hook to use context (with safety check)
export function useHideDots() {
  const context = useContext(HideDotsContext);
  if (!context) {
    throw new Error("useHideDots must be used within a HideDotsProvider");
  }
  return context;
}

// Provider component that holds the state
export function HideDotsProvider({ children }: { children: ReactNode }) {
  const [hideDots, setHideDots] = useState(false);

  return (
    <HideDotsContext.Provider value={{ hideDots, setHideDots }}>
      {children}
    </HideDotsContext.Provider>
  );
}
