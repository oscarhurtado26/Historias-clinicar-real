import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return ""

  // Handle dates in DD/MM/YYYY format
  if (dateString.includes("/")) {
    return dateString
  }

  // Handle dates in YYYY-MM-DD format
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
