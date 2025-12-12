"use client"

import { useEffect } from "react"
import { CheckCircle2, XCircle, Loader2, FileCheck } from "lucide-react"

interface ToastNotificationProps {
  type: "success" | "error" | "loading" | "printing" | "printed"
  message: string
  onClose: () => void
  duration?: number
}

export function ToastNotification({ type, message, onClose, duration = 3000 }: ToastNotificationProps) {
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [type, duration, onClose])

  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-success" />,
    error: <XCircle className="w-12 h-12 text-destructive" />,
    loading: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
    printing: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
    printed: <FileCheck className="w-12 h-12 text-success" />,
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 flex flex-col items-center gap-4 min-w-[300px] shadow-xl border">
        {icons[type]}
        <p className="text-lg font-semibold text-center text-card-foreground">{message}</p>
      </div>
    </div>
  )
}
