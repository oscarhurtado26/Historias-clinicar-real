"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Bell, ChevronRight } from "lucide-react"
import { patients, appointments, alerts, treatments } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [, setRefresh] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((r) => r + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const recentPatients = patients
    .sort((a, b) => {
      const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0
      const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 3)

  const activeAlerts = alerts.filter((a) => a.status === "Nueva").length

  const upcomingAppointments = appointments
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Bienvenido de nuevo, {user?.name}!</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Aquí tienes un resumen de la actividad de tu clínica hoy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Pacientes</CardTitle>
              <Users className="w-5 h-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Tratamientos Realizados</CardTitle>
              <Calendar className="w-5 h-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{treatments.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Alertas Activas</CardTitle>
              <Bell className="w-5 h-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{activeAlerts}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pacientes Recientes
                <ChevronRight
                  className="w-5 h-5 text-muted-foreground cursor-pointer"
                  onClick={() => router.push("/pacientes")}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPatients.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay pacientes registrados aún</p>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => router.push(`/pacientes/${patient.id}`)}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Última visita: {patient.lastVisit || "Sin visitas"}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay citas programadas</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-bold text-primary">{appointment.time.split(" ")[0]}</div>
                        <div className="text-xs text-muted-foreground">{appointment.time.split(" ")[1]}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(appointment.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertas de IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter((a) => a.status === "Nueva").length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay alertas activas. Las alertas se generarán automáticamente al registrar tratamientos.
              </p>
            ) : (
              alerts
                .filter((a) => a.status === "Nueva")
                .slice(0, 5)
                .map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        alert.priority === "Alta"
                          ? "bg-destructive"
                          : alert.priority === "Media"
                            ? "bg-warning"
                            : "bg-muted"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            alert.priority === "Alta"
                              ? "text-destructive"
                              : alert.priority === "Media"
                                ? "text-warning"
                                : "text-muted-foreground"
                          }`}
                        >
                          {alert.priority === "Alta"
                            ? "Alerta Alta"
                            : alert.priority === "Media"
                              ? "Recomendación"
                              : "Seguimiento"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium mb-1">{alert.patientName}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
