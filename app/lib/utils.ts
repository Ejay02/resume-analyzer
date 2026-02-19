import type { ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

import clsx from "clsx";

/**
 * Formats a file size in bytes into a human-readable string.
 * Uses binary units (KB, MB, GB) based on 1024 bytes per kilobyte.
 */
export const formatSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes < KB) {
    return `${bytes} B`;
  }

  const roundWithUnit = (value: number, unit: string) =>
    `${Math.round(value)} ${unit}`;

  if (bytes < MB) {
    return roundWithUnit(bytes / KB, "KB");
  }

  if (bytes < GB) {
    return roundWithUnit(bytes / MB, "MB");
  }

  return roundWithUnit(bytes / GB, "GB");
};

/**
 * Generates a random UUID (Universally Unique Identifier).
 * @returns A string representing a random UUID.
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - The class names or expressions to combine.
 * @returns A string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
