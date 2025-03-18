"use client"

import React from "react";
import { CodeIcon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <CodeIcon
        className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
      />
      <span className="text-xl font-bold">
        AppPlaceholder
      </span>
    </div>
  );
}
