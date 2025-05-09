import { clsx, type ClassValue } from "clsx";
import { CreditCardIcon, FilesIcon, HomeIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const routes = [
   { label: "Home", url: "/", icon: HomeIcon },
   { label: "Projects", url: "/projects", icon: FilesIcon },
   { label: "Billing", url: "/billing", icon: CreditCardIcon },
];

export function generateRandomID(length = 8) {
   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let randomID = "";
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomID += characters[randomIndex];
   }
   return randomID;
}

export function dateFormat(date: string | number | Date) {
   const locale = navigator.language || "en-US";
   return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
   }).format(new Date(date));
}

export function debouncer<T extends (...args: any[]) => void>(func: T, timeout = 10) {
   let timer: ReturnType<typeof setTimeout> | undefined;
   return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         func(...args);
      }, timeout);
   };
}

type AppError = {
   message: string;
   status?: number;
};
type Fetcher<T, U = void> = (args: U) => Promise<T>;
export const handler = <T, U = void>(fn: Fetcher<T, U>) => {
   return async (args: U): Promise<T> => {
      try {
         const result = await fn(args);
         return result;
      } catch (err: unknown) {
         // Log the error for debugging purposes (in development)
         if (process.env.NEXT_ENV === "development") {
            console.error("Handler Error:", err);
         }

         // Handle different error types
         if (err instanceof Error) {
            // Generic error with context
            throw new Error(err.message || "An error occurred during the mutation.");
         }

         // In case the error is an unexpected type
         throw new Error("Internal server error");
      }
   };
};
