import React, { createContext, useContext } from "react";
import type { SubscriptionPlan } from "../constants";

const SubscriptionContext = createContext<SubscriptionPlan>("free");

export function SubscriptionProvider({
  plan,
  children,
}: {
  plan: SubscriptionPlan;
  children: React.ReactNode;
}) {
  return (
    <SubscriptionContext.Provider value={plan}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
