import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomID(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomID += characters[randomIndex];
  }
  return randomID;
}

export function dateFormat(date: string | number) {
  const locale = navigator.language || "en-US";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(date));
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
