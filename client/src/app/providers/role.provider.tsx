import React, { createContext, useContext } from "react";
import type { AppRole } from "../constants";

const RoleContext = createContext<AppRole>("public");

export function RoleProvider({
  role,
  children,
}: {
  role: AppRole;
  children: React.ReactNode;
}) {
  return (
    <RoleContext.Provider value={role}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
