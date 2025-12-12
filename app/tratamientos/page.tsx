"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { treatments } from "@/lib/data-store"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

export default function TratamientosPage() {
  const router = useRouter()
  const [, setRefresh] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((r) => r + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredTreatments = treatments.filter(
    (treatment) =>
      treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.treatmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.professional.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tratamientos</h1>
            <p className="text-muted-foreground mt-1">Gestiona los tratamientos realizados</p>
          </div>
          <Button onClick={() => router.push("/tratamientos/nuevo")}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tratamiento
          </Button>
        </div>

        {treatments.length > 0 ? (
          <Card className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, tratamiento o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Paciente</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Tratamiento</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Zonas</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Profesional</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTreatments.length > 0 ? (
                    filteredTreatments.map((treatment) => (
                      <tr key={treatment.id} className="border-b border-border hover:bg-accent/50">
                        <td className="py-4 px-4 text-sm text-foreground">{treatment.date}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{treatment.patientName}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground">{treatment.treatmentName}</td>
                        <td className="py-4 px-4 text-sm text-foreground">{treatment.zones}</td>
                        <td className="py-4 px-4 text-sm text-foreground">{treatment.professional}</td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/pacientes/${treatment.patientId}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Paciente
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No se encontraron tratamientos que coincidan con la búsqueda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay tratamientos registrados</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
