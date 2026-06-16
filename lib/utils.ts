import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildUrlWithQuery(path: string, key: string, value: string): string {
  return `${path}?${key}=${encodeURIComponent(value)}`
}
