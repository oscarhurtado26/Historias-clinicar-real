"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToastNotification } from "@/components/toast-notification"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ArrowLeft, Plus, X, Camera } from "lucide-react"
import { patients, treatments, appointments, type Treatment, type Appointment } from "@/lib/data-store"

export default function NuevoTratamientoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatientId = searchParams.get("patientId")

  const [formData, setFormData] = useState({
    patientId: preselectedPatientId || "",
    date: new Date().toISOString().split("T")[0],
    professional: "Dra. Ana Torres",
    treatmentName: "",
    zones: "",
    description: "",
    observations: "",
    recommendations: "",
    followUpDate: "",
    followUpTime: "",
    notes: "",
  })

  const [products, setProducts] = useState<Array<{ name: string; lot: string; quantity: string }>>([
    { name: "", lot: "", quantity: "" },
  ])

  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [afterImage, setAfterImage] = useState<string | null>(null)
  const [beforeImageName, setBeforeImageName] = useState<string>("")
  const [afterImageName, setAfterImageName] = useState<string>("")
  const [toast, setToast] = useState<{ type: "success" | "loading" | "error"; message: string } | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addProduct = () => {
    setProducts([...products, { name: "", lot: "", quantity: "" }])
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setProducts(newProducts)
  }

  const handleBeforeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBeforeImageName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBeforeImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAfterImageName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAfterImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = "Debe seleccionar un paciente"
    if (!formData.date) newErrors.date = "Debe ingresar la fecha del tratamiento"
    if (!formData.professional) newErrors.professional = "Debe ingresar el profesional a cargo"
    if (!formData.treatmentName) newErrors.treatmentName = "Debe ingresar el nombre del tratamiento"
    if (!formData.zones) newErrors.zones = "Debe ingresar las zonas tratadas"
    if (!formData.description) newErrors.description = "Debe ingresar la descripción del procedimiento"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setToast({ type: "error", message: "POR FAVOR COMPLETE TODOS LOS CAMPOS REQUERIDOS" })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setToast({ type: "loading", message: "GUARDANDO INFORMACIÓN..." })

    setTimeout(() => {
      const patient = patients.find((p) => p.id === formData.patientId)

      if (!patient) {
        setToast({ type: "error", message: "PACIENTE NO ENCONTRADO" })
        return
      }

      const newTreatment: Treatment = {
        id: `T${Date.now()}`,
        ...formData,
        patientName: patient.name,
        products: products.filter((p) => p.name),
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
      }

      treatments.push(newTreatment)

      if (!patient.treatments) {
        patient.treatments = []
      }
      patient.treatments.push(newTreatment)

      if (formData.notes) {
        if (!patient.notes) {
          patient.notes = []
        }
        patient.notes.push({
          id: `NOTE${Date.now()}`,
          content: formData.notes,
          date: new Date().toLocaleDateString(),
          author: formData.professional,
        })
      }

      if (formData.followUpDate) {
        const newAppointment: Appointment = {
          id: `APT${Date.now()}`,
          date: formData.followUpDate,
          time: formData.followUpTime || "10:00 AM",
          patientName: patient.name,
          patientId: patient.id,
          treatment: formData.treatmentName,
          professional: formData.professional,
        }

        appointments.push(newAppointment)

        if (!patient.appointments) {
          patient.appointments = []
        }
        patient.appointments.push(newAppointment)
      }

      patient.lastVisit = formData.date

      setToast({ type: "success", message: "INFORMACIÓN GUARDADA CON ÉXITO" })

      setTimeout(() => {
        router.push("/tratamientos")
      }, 1500)
    }, 2000)
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = () => {
    setShowCancelDialog(false)
    setShowCancelToast(true)
    setTimeout(() => {
      router.back()
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Tratamiento</h1>
            <p className="text-muted-foreground">Complete el formulario para registrar un nuevo tratamiento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos Generales del Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">
                    Paciente <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                  >
                    <SelectTrigger className={errors.patientId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay pacientes registrados
                        </SelectItem>
                      ) : (
                        patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.patientId && <p className="text-xs text-destructive">{errors.patientId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">
                    Fecha del Tratamiento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={errors.date ? "border-destructive" : ""}
                  />
                  {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professional">
                    Profesional a Cargo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="professional"
                    value={formData.professional}
                    onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                    className={errors.professional ? "border-destructive" : ""}
                  />
                  {errors.professional && <p className="text-xs text-destructive">{errors.professional}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles del Procedimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatmentName">
                    Nombre del Tratamiento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="treatmentName"
                    placeholder="Ej: Toxina Botulínica - Tercio Superior"
                    value={formData.treatmentName}
                    onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                    className={errors.treatmentName ? "border-destructive" : ""}
                  />
                  {errors.treatmentName && <p className="text-xs text-destructive">{errors.treatmentName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zones">
                    Zona(s) Tratada(s) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zones"
                    placeholder="Ej: Frente, entrecejo y patas de gallo"
                    value={formData.zones}
                    onChange={(e) => setFormData({ ...formData, zones: e.target.value })}
                    className={errors.zones ? "border-destructive" : ""}
                  />
                  {errors.zones && <p className="text-xs text-destructive">{errors.zones}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción del Procedimiento <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describa el procedimiento realizado..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Productos y Equipos Utilizados
                <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Producto
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Producto</Label>
                    <Input
                      placeholder="Nombre del producto"
                      value={product.name}
                      onChange={(e) => updateProduct(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lote / Referencia</Label>
                    <Input
                      placeholder="Lote"
                      value={product.lot}
                      onChange={(e) => updateProduct(index, "lot", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      placeholder="Cantidad"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(index)}
                      disabled={products.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones y Seguimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones Post-Tratamiento</Label>
                <Textarea
                  id="observations"
                  placeholder="Describa las observaciones relevantes..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">Recomendaciones para el Paciente</Label>
                <Textarea
                  id="recommendations"
                  placeholder="Indique las recomendaciones para el cuidado post-tratamiento..."
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Agregue notas adicionales sobre el paciente o tratamiento..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Cita de Seguimiento Sugerida</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpTime">Hora de Seguimiento</Label>
                  <Input
                    id="followUpTime"
                    type="time"
                    value={formData.followUpTime}
                    onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archivos Adjuntos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Antes</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBeforeImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {beforeImage ? (
                      <div className="space-y-2">
                        <img
                          src={beforeImage || "/placeholder.svg"}
                          alt="Antes"
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs text-muted-foreground">{beforeImageName}</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Subir foto antes del tratamiento</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Después</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAfterImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {afterImage ? (
                      <div className="space-y-2">
                        <img
                          src={afterImage || "/placeholder.svg"}
                          alt="Después"
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs text-muted-foreground">{afterImageName}</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Subir foto después del tratamiento</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Registro</Button>
          </div>
        </form>
      </div>

      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {showCancelDialog && (
        <ConfirmDialog
          title="¿Estás seguro de que deseas cancelar el registro?"
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelDialog(false)}
        />
      )}

      {showCancelToast && (
        <ToastNotification type="error" message="REGISTRO CANCELADO" onClose={() => setShowCancelToast(false)} />
      )}
    </DashboardLayout>
  )
}
