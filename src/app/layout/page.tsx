"use client"

import React from "react";
import { Header } from "(components)/header";
import { Footer } from "(components)/footer";
import { ThemeProvider } from "(components)/theme-provider";

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
