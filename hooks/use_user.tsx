"use client";

import type { User } from "@/api_/types";
import { createContext, useContext } from "react";

type userProp = {
   user: User;
};

const UserContext = createContext<userProp | undefined>(undefined);

const UserContextProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
   return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
   const context = useContext(UserContext);
   if (!context) {
      throw new Error("useUserContext must be used within a UserContextProvider");
   }
   return context;
};

export { UserContextProvider, useUserContext };
