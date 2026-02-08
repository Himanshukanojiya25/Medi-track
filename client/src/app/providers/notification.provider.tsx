import React, { createContext, useContext } from "react";

type NotificationContextType = {
  notify: (msg: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const notify = (msg: string) => {
    console.info("[notify]", msg);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
