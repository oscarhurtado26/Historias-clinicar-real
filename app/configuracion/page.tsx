"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastNotification } from "@/components/toast-notification"
import { useAuth } from "@/lib/auth-context"
import {
  users,
  roleTemplates,
  updateRolePermissions,
  type UserPermissions,
  clinicConfig,
  updateClinicConfiguration,
} from "@/lib/data-store"
import { Pencil, Trash2, Upload } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function ConfiguracionPage() {
  const [toast, setToast] = useState<{ type: "success" | "loading" | "error"; message: string } | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === "Admin"
  const [refresh, setRefresh] = useState(0)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<UserPermissions | null>(null)

  const [centerName, setCenterName] = useState(clinicConfig.centerName)
  const [address, setAddress] = useState(clinicConfig.address)
  const [logo, setLogo] = useState(clinicConfig.logo)
  const [language, setLanguage] = useState(clinicConfig.language)
  const [timezone, setTimezone] = useState(clinicConfig.timezone)
  const [dateFormat, setDateFormat] = useState(clinicConfig.dateFormat)
  const [timeFormat, setTimeFormat] = useState(clinicConfig.timeFormat)
  const [aiSensitivity, setAiSensitivity] = useState(clinicConfig.aiSensitivity)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((r) => r + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogo(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveGeneral = () => {
    setToast({ type: "loading", message: "GUARDANDO INFORMACIÓN..." })

    setTimeout(() => {
      updateClinicConfiguration({
        centerName,
        address,
        logo,
        language,
        timezone,
        dateFormat,
        timeFormat,
        aiSensitivity,
      })

      setToast({ type: "success", message: "INFORMACIÓN GUARDADA CON ÉXITO" })
      setTimeout(() => setToast(null), 3000)
    }, 1000)
  }

  const getUserCountByRoleType = (roleType: string) => {
    return users.filter((u) => u.roleType === roleType).length
  }

  const getUsersByRoleType = (roleType: string) => {
    return users.filter((u) => u.roleType === roleType)
  }

  const handleEditRole = (roleType: string) => {
    setSelectedRole(roleType)
    setEditingPermissions(roleTemplates[roleType].permissions)
  }

  const handlePermissionChange = (category: keyof UserPermissions, permission: string, value: boolean) => {
    if (editingPermissions) {
      setEditingPermissions({
        ...editingPermissions,
        [category]: {
          ...editingPermissions[category],
          [permission]: value,
        },
      })
    }
  }

  const handleSaveRolePermissions = () => {
    if (!selectedRole) return

    setToast({ type: "loading", message: "ACTUALIZANDO PERMISOS..." })
    setTimeout(() => {
      updateRolePermissions(selectedRole, editingPermissions!)
      setToast({ type: "success", message: "PERMISOS ACTUALIZADOS CORRECTAMENTE PARA TODOS LOS USUARIOS DEL ROL" })
      setTimeout(() => setToast(null), 3000)
    }, 1000)
  }

  const handleCancelEdit = () => {
    setSelectedRole(null)
    setEditingPermissions(null)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">Gestiona la configuración del sistema</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            {isAdmin && <TabsTrigger value="roles">Gestión de Roles y Permisos</TabsTrigger>}
            <TabsTrigger value="alertas">Alertas y Notificaciones</TabsTrigger>
            <TabsTrigger value="acerca">Acerca de</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Centro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="centerName">Nombre del Centro</Label>
                    <Input id="centerName" value={centerName} onChange={(e) => setCenterName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo del Centro</Label>
                    <div className="flex items-center gap-4">
                      {logo && (
                        <img
                          src={logo || "/placeholder.svg"}
                          alt="Logo"
                          className="w-16 h-16 object-contain rounded border"
                        />
                      )}
                      <div className="relative">
                        <Button variant="outline" type="button">
                          <Upload className="w-4 h-4 mr-2" />
                          Cambiar Logo
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de la Aplicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-5">(UTC-05:00) Eastern Time</SelectItem>
                          <SelectItem value="utc-6">(UTC-06:00) Central Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de Fecha</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dmy">24/03/2025</SelectItem>
                          <SelectItem value="mdy">03/24/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Formato de Hora</Label>
                      <Select value={timeFormat} onValueChange={setTimeFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 Horas (14:30)</SelectItem>
                          <SelectItem value="12">12 Horas (2:30 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parámetros de IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sensibilidad de Recomendaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajusta qué tan proactivas serán las sugerencias de la IA para tratamientos.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiSensitivity}
                      onChange={(e) => setAiSensitivity(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right">{aiSensitivity}%</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleSaveGeneral}>Guardar Cambios</Button>
              </div>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Roles y Permisos</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Crea y administra los roles de usuario y sus accesos al sistema.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Roles del Sistema</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                              Nombre del Rol
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                              Descripción
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                              Usuarios
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(roleTemplates).map(([roleType, roleData]) => (
                            <tr key={roleType} className="border-b border-border hover:bg-accent/50">
                              <td className="py-4 px-4 font-medium text-foreground">{roleType}</td>
                              <td className="py-4 px-4 text-sm text-muted-foreground">{roleData.description}</td>
                              <td className="py-4 px-4 text-sm text-foreground font-semibold">
                                {getUserCountByRoleType(roleType)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditRole(roleType)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedRole && editingPermissions && (
                    <div className="border border-border rounded-lg p-6 bg-accent/20">
                      <h3 className="text-lg font-semibold mb-2">Permisos para el Rol: {selectedRole}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Selecciona los permisos específicos para este rol.
                      </p>
                      <div className="mb-6 p-4 bg-background rounded-md">
                        <p className="text-sm font-medium mb-2">Usuarios con este rol:</p>
                        <div className="flex flex-wrap gap-2">
                          {getUsersByRoleType(selectedRole).map((u) => (
                            <span key={u.email} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {u.name}
                            </span>
                          ))}
                          {getUsersByRoleType(selectedRole).length === 0 && (
                            <span className="text-sm text-muted-foreground italic">No hay usuarios con este rol</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Gestión de Pacientes</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="viewClinicalHistory"
                                checked={editingPermissions.patientManagement.viewClinicalHistory}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("patientManagement", "viewClinicalHistory", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="viewClinicalHistory"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Ver historias clínicas
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="addNotesAndPhotos"
                                checked={editingPermissions.patientManagement.addNotesAndPhotos}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("patientManagement", "addNotesAndPhotos", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="addNotesAndPhotos"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Añadir notas y fotos
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="editPatientInfo"
                                checked={editingPermissions.patientManagement.editPatientInfo}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("patientManagement", "editPatientInfo", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="editPatientInfo"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Editar información del paciente
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Agenda y Citas</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="viewOwnSchedule"
                                checked={editingPermissions.appointmentsAndSchedule.viewOwnSchedule}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    "appointmentsAndSchedule",
                                    "viewOwnSchedule",
                                    checked as boolean,
                                  )
                                }
                              />
                              <label
                                htmlFor="viewOwnSchedule"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Ver propia agenda
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="viewOthersSchedule"
                                checked={editingPermissions.appointmentsAndSchedule.viewOthersSchedule}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    "appointmentsAndSchedule",
                                    "viewOthersSchedule",
                                    checked as boolean,
                                  )
                                }
                              />
                              <label
                                htmlFor="viewOthersSchedule"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Ver agenda de otros
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="addTreatmentOrPatient"
                                checked={editingPermissions.appointmentsAndSchedule.addTreatmentOrPatient}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    "appointmentsAndSchedule",
                                    "addTreatmentOrPatient",
                                    checked as boolean,
                                  )
                                }
                              />
                              <label
                                htmlFor="addTreatmentOrPatient"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                añadir tratamiento / paciente
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Facturación</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="viewPaymentHistory"
                                checked={editingPermissions.billing.viewPaymentHistory}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("billing", "viewPaymentHistory", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="viewPaymentHistory"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Ver historial de pagos
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="generateInvoices"
                                checked={editingPermissions.billing.generateInvoices}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("billing", "generateInvoices", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="generateInvoices"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Generar facturas
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="applyDiscounts"
                                checked={editingPermissions.billing.applyDiscounts}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange("billing", "applyDiscounts", checked as boolean)
                                }
                              />
                              <label
                                htmlFor="applyDiscounts"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Aplicar descuentos
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-end mt-6">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveRolePermissions}>Guardar Cambios</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </DashboardLayout>
  )
}
