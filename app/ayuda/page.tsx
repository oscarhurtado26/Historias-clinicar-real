"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"

export default function AyudaPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ayuda</h1>
          <p className="text-muted-foreground mt-1">Centro de ayuda y soporte</p>
        </div>

        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Módulo de ayuda en desarrollo</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
