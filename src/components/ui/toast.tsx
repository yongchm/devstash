"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

export type ToastType = "success" | "error"

interface ToastProps {
  message: string
  type: ToastType
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, type, onDismiss, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const enter = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => {
      cancelAnimationFrame(enter)
      clearTimeout(timer)
    }
  }, [duration, onDismiss])

  return (
    <div
      className={`flex items-center gap-3 min-w-72 max-w-sm px-4 py-3 rounded-lg border shadow-lg text-sm transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${
        type === "success"
          ? "bg-background border-border text-foreground"
          : "bg-background border-destructive/50 text-foreground"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
      )}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {children}
    </div>
  )
}
