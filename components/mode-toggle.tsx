"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex flex-col">
      <button onClick={() => setTheme("light")}>light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
