"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, ChevronRight } from "lucide-react"
import { patients } from "@/lib/data-store"

export default function PacientesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Gestiona la información de tus pacientes</p>
          </div>
          <Button onClick={() => router.push("/pacientes/nuevo")} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, email o ID"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer gap-3 sm:gap-4"
                  onClick={() => router.push(`/pacientes/${patient.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                      <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-16 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-foreground">{patient.phone}</p>
                      <p className="text-sm text-muted-foreground">Última visita: {patient.lastVisit}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
