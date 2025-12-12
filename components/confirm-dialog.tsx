"use client"

import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  title: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 flex flex-col items-center gap-6 max-w-md shadow-xl border">
        <p className="text-lg font-semibold text-center text-card-foreground">{title}</p>
        <div className="flex gap-4">
          <Button onClick={onConfirm} variant="default" className="min-w-[100px]">
            Sí
          </Button>
          <Button onClick={onCancel} variant="outline" className="min-w-[100px] bg-transparent">
            No
          </Button>
        </div>
      </div>
    </div>
  )
}
