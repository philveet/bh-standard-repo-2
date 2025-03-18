"use client"

import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-gray-200 dark:border-gray-800 py-8"
    >
      <div className="container mx-auto px-4">
        <div
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {currentYear} AppPlaceholder. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
