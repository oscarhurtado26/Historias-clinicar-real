"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ToastNotification } from "@/components/toast-notification"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Upload } from "lucide-react"
import { patients, type Patient, generateAllergyAlerts } from "@/lib/data-store"

export default function NuevoPacientePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    documentType: "CC",
    documentId: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    phone: "",
    email: "",
    address: "",
    consultReason: "",
    allergies: "",
    medications: "",
    consentSigned: false,
    fileUploaded: false,
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: "success" | "loading" | "error"; message: string } | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const [consentFile, setConsentFile] = useState<File | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    if (!formData.name) newErrors.name = true
    if (!formData.documentId) newErrors.documentId = true
    if (!formData.birthDate) newErrors.birthDate = true
    if (!formData.gender) newErrors.gender = true
    if (!formData.maritalStatus) newErrors.maritalStatus = true
    if (!formData.phone) newErrors.phone = true
    if (!formData.email) newErrors.email = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setConsentFile(file)
      setFormData({ ...formData, fileUploaded: true })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!formData.consentSigned || !consentFile) {
      setToast({ type: "error", message: "DEBE CARGAR EL CONSENTIMIENTO INFORMADO Y MARCAR LA CASILLA" })
      return
    }

    setToast({ type: "loading", message: "GUARDANDO INFORMACIÓN..." })

    setTimeout(() => {
      const consentDocument = {
        id: `DOC-${Date.now()}`,
        name: consentFile.name,
        url: URL.createObjectURL(consentFile),
        uploadDate: new Date().toLocaleDateString("es-ES"),
      }

      const newPatient: Patient = {
        id: `P789-${1234 + patients.length}`,
        ...formData,
        lastVisit: new Date().toLocaleDateString("es-ES"),
        documents: [consentDocument],
      }

      patients.push(newPatient)

      generateAllergyAlerts(newPatient)

      setToast({ type: "success", message: "INFORMACIÓN GUARDADA CON ÉXITO" })

      setTimeout(() => {
        router.push("/pacientes")
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
      router.push("/pacientes")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registro de Nuevo Paciente</h1>
          <p className="text-muted-foreground mt-1">
            Complete el formulario para agregar un nuevo paciente al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos Demográficos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="name">
                    Nombre completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ingrese nombre y apellidos"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentId">
                    Documento de Identidad <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="documentId"
                    placeholder="Cédula o Pasaporte"
                    value={formData.documentId}
                    onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                    className={errors.documentId ? "border-destructive" : ""}
                  />
                  {errors.documentId && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Fecha de Nacimiento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className={errors.birthDate ? "border-destructive" : ""}
                  />
                  {errors.birthDate && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Género <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">
                    Estado Civil <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                  >
                    <SelectTrigger className={errors.maritalStatus ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soltero">Soltero/a</SelectItem>
                      <SelectItem value="Casado">Casado/a</SelectItem>
                      <SelectItem value="Unión libre">Unión libre</SelectItem>
                      <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                      <SelectItem value="Viudo">Viudo/a</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.maritalStatus && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Teléfono <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+57 (602) 554-3150"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="paciente@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">Este campo es obligatorio</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, ciudad"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historia Clínica Inicial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consultReason">Motivo de la consulta</Label>
                <Textarea
                  id="consultReason"
                  placeholder="Describa la principal preocupación estética del paciente..."
                  value={formData.consultReason}
                  onChange={(e) => setFormData({ ...formData, consultReason: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Alergias Conocidas</Label>
                <Textarea
                  id="allergies"
                  placeholder="Ej: Penicilina, látex, etc. Si no tiene, escribir 'Ninguna'."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Medicamentos Actuales</Label>
                <Textarea
                  id="medications"
                  placeholder="Liste los medicamentos que el paciente toma regularmente"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archivos y Consentimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Subir Consentimiento Informado <span className="text-destructive">*</span>
                </Label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="consent-upload"
                />
                <label htmlFor="consent-upload">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-foreground mb-1">
                      {consentFile ? consentFile.name : "Subir un archivo o arrastrar y soltar"}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF hasta 10MB</p>
                  </div>
                </label>
                {consentFile && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Archivo cargado correctamente
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consentSigned}
                  onCheckedChange={(checked) => setFormData({ ...formData, consentSigned: checked as boolean })}
                />
                <Label htmlFor="consent" className="font-normal cursor-pointer">
                  El paciente ha firmado el consentimiento informado <span className="text-destructive">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Paciente</Button>
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
