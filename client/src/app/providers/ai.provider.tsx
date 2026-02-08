import React, { createContext, useContext } from "react";

type AIContextType = {
  enabled: boolean;
};

const AIContext = createContext<AIContextType>({ enabled: false });

export function AIProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <AIContext.Provider value={{ enabled }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
