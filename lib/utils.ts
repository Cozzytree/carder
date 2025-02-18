import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function debouncer<T extends (...args: any[]) => void>(
   func: T,
   timeout = 10,
) {
   let timer: ReturnType<typeof setTimeout> | undefined;
   return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         func(...args);
      }, timeout);
   };
}
