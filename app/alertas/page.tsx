"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { alerts } from "@/lib/data-store"

export default function AlertasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todas")
  const [priorityFilter, setPriorityFilter] = useState("Todas")
  const [, setRefresh] = useState(0)

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "Todas" || alert.status === statusFilter
    const matchesPriority = priorityFilter === "Todas" || alert.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-destructive text-destructive-foreground"
      case "Media":
        return "bg-warning text-warning-foreground"
      case "Baja":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nueva":
        return "bg-primary text-primary-foreground"
      case "Revisada":
        return "bg-success text-success-foreground"
      case "Descartada":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleRevisar = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.status = "Revisada"
      setRefresh((r) => r + 1)
    }
  }

  const handleDescartar = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.status = "Descartada"
      setRefresh((r) => r + 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alertas</h1>
          <p className="text-muted-foreground mt-1">Gestiona las alertas y notificaciones del sistema</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por paciente o tipo de alerta"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Estado: Todas</SelectItem>
                  <SelectItem value="Nueva">Nueva</SelectItem>
                  <SelectItem value="Revisada">Revisada</SelectItem>
                  <SelectItem value="Descartada">Descartada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Prioridad: Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {alerts.length === 0
                    ? "No hay alertas en el sistema. Se generarán automáticamente al registrar tratamientos."
                    : "No se encontraron alertas con los filtros seleccionados"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Prioridad</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Paciente</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Descripción de la Alerta
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                        </td>
                        <td className="py-4 px-4 font-medium text-foreground">{alert.patientName}</td>
                        <td className="py-4 px-4 text-sm text-foreground max-w-md">{alert.description}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">{alert.date}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevisar(alert.id)}
                              disabled={alert.status !== "Nueva"}
                            >
                              Revisar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDescartar(alert.id)}
                              disabled={alert.status === "Descartada"}
                            >
                              Descartar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
