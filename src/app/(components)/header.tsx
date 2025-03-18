"use client"

import React from "react";
import { Logo } from "(components)/logo";
import { ThemeToggle } from "(components)/theme-toggle";

export function Header() {
  return (
    <header
      className="border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
