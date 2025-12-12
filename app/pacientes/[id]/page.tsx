"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { patients, treatments, appointments } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Printer, Plus, AlertTriangle, Calendar, Phone, MapPin, Mail, FileText, Sparkles } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { formatDate } from "@/lib/utils"

const tabs = [
  { id: "resumen", label: "Resumen" },
  { id: "historial", label: "Historial de Tratamientos" },
  { id: "documentos", label: "Documentos" },
  { id: "notas", label: "Notas" },
]

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [patient, setPatient] = useState(() => patients.find((p) => p.id === patientId))
  const [patientTreatments, setPatientTreatments] = useState<typeof treatments>([])
  const [activeTab, setActiveTab] = useState<"resumen" | "historial" | "documentos" | "notas">("resumen")
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    const currentPatient = patients.find((p) => p.id === patientId)
    setPatient(currentPatient)

    const treatmentsForPatient = treatments.filter((t) => t.patientId === patientId)
    setPatientTreatments(treatmentsForPatient)
  }, [patientId])

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Paciente no encontrado</p>
        </div>
      </DashboardLayout>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate.split("/").reverse().join("-"))
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSaveNote = () => {
    if (!newNote.trim()) return

    if (!patient.notes) {
      patient.notes = []
    }

    const note = {
      id: `N${Date.now()}`,
      content: newNote,
      date: new Date().toLocaleDateString("es-ES"),
      author: "Dra. Ana Torres",
    }

    patient.notes.push(note)
    setNewNote("")
    setPatient({ ...patient })
  }

  const nextAppointment = appointments.find((apt) => apt.patientId === patientId)

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <nav className="text-sm text-muted-foreground">Pacientes / {patient.name} / Historia Clínica</nav>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl md:text-2xl flex-shrink-0">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {patient.name}, {calculateAge(patient.birthDate)} años
                  </h1>
                  <p className="text-sm text-muted-foreground">ID Paciente: {patient.id}</p>
                  <p className="text-sm text-muted-foreground">Fecha de Nacimiento: {formatDate(patient.birthDate)}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none bg-transparent" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={() => router.push(`/tratamientos/nuevo?patientId=${patientId}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Tratamiento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="border-b border-border overflow-x-auto">
          <div className="flex gap-8 min-w-max px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "resumen" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left column */}
            <div className="space-y-4 md:space-y-6">
              {/* Alertas y Contraindicaciones */}
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    Alertas y Contraindicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {patient.allergies && patient.allergies.toLowerCase() !== "ninguna" && (
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">•</span>
                        <span className="text-foreground">Alergia a {patient.allergies}</span>
                      </li>
                    )}
                    {patient.medications && patient.medications.toLowerCase() !== "ninguno" && (
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">•</span>
                        <span className="text-foreground">
                          {patient.medications.toLowerCase().includes("retinoid")
                            ? "Contraindicado: Retinoides tópicos fuertes"
                            : `Medicación actual: ${patient.medications}`}
                        </span>
                      </li>
                    )}
                    {(!patient.allergies || patient.allergies.toLowerCase() === "ninguna") &&
                      (!patient.medications || patient.medications.toLowerCase() === "ninguno") && (
                        <li className="text-muted-foreground">No hay alertas registradas</li>
                      )}
                  </ul>
                </CardContent>
              </Card>

              {/* Historial de Consultas */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Consultas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {patientTreatments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay consultas registradas</p>
                  ) : (
                    patientTreatments.map((treatment) => (
                      <div key={treatment.id} className="relative pl-6 border-l-2 border-emerald-500">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{treatment.date}</p>
                        <h4 className="font-semibold text-foreground mb-2">{treatment.treatmentName}</h4>
                        <p className="text-sm text-foreground mb-3">{treatment.description}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          Profesional: {treatment.professional}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Center column */}
            <div className="space-y-4 md:space-y-6">
              {/* Próxima Cita */}
              {nextAppointment && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Próxima Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-primary mb-1">
                          {nextAppointment.date.split(" ")[0]} - {nextAppointment.time}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {nextAppointment.time.includes("AM") ? "AM" : "PM"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tratamiento:</p>
                        <p className="text-sm font-medium text-foreground">{nextAppointment.treatment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Profesional:</p>
                        <p className="text-sm font-medium text-foreground">{nextAppointment.professional}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4 md:space-y-6">
              {/* Análisis y Sugerencias IA */}
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="w-5 h-5" />
                    Análisis y Sugerencias IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Resumen del Historial:</p>
                    <p className="text-sm text-foreground">
                      {patientTreatments.length > 0
                        ? `Paciente con historial de ${patientTreatments.length} tratamiento(s). ${
                            patient.allergies && patient.allergies.toLowerCase() !== "ninguna"
                              ? `Precaución con alergias conocidas a ${patient.allergies}.`
                              : "Sin alergias conocidas."
                          }`
                        : "Paciente nuevo sin historial de tratamientos."}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Sugerencia de Tratamiento:</p>
                    <p className="text-sm text-foreground">
                      {patient.consultReason.toLowerCase().includes("acné")
                        ? "Considerar un ciclo de terapia de luz LED (roja) para complementar la hidratación y reducir la rojez asociada a la rosácea."
                        : "Considerar tratamiento de hidratación profunda según motivo de consulta."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Datos de Contacto */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Datos de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{patient.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{patient.email}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Añadir Nueva Nota */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Añadir Nueva Nota
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Escriba sus observaciones..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <Button onClick={handleSaveNote} className="w-full bg-emerald-500 hover:bg-emerald-600">
                    Guardar Nota
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="pb-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial Completo de Tratamientos</CardTitle>
              </CardHeader>
              <CardContent>
                {patientTreatments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay tratamientos registrados</p>
                ) : (
                  <div className="space-y-4">
                    {patientTreatments.map((treatment) => (
                      <div key={treatment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">{treatment.treatmentName}</h4>
                            <p className="text-sm text-muted-foreground">{treatment.date}</p>
                          </div>
                          <Badge variant="outline">{treatment.zones}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-foreground">
                            <strong>Descripción:</strong> {treatment.description}
                          </p>
                          {treatment.observations && (
                            <p className="text-foreground">
                              <strong>Observaciones:</strong> {treatment.observations}
                            </p>
                          )}
                          {treatment.recommendations && (
                            <p className="text-foreground">
                              <strong>Recomendaciones:</strong> {treatment.recommendations}
                            </p>
                          )}
                          <p className="text-primary">
                            <strong>Profesional:</strong> {treatment.professional}
                          </p>
                          {treatment.products && treatment.products.length > 0 && (
                            <div>
                              <strong className="text-foreground">Productos utilizados:</strong>
                              <ul className="ml-4 mt-1 space-y-1">
                                {treatment.products.map((product, idx) => (
                                  <li key={idx} className="text-muted-foreground">
                                    {product.name} - Lote: {product.lot} - Cantidad: {product.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(treatment.beforeImage || treatment.afterImage) && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {treatment.beforeImage && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">Antes</p>
                                  <img
                                    src={treatment.beforeImage || "/placeholder.svg"}
                                    alt="Antes del tratamiento"
                                    className="w-full h-32 object-cover rounded-lg border border-border"
                                  />
                                </div>
                              )}
                              {treatment.afterImage && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">Después</p>
                                  <img
                                    src={treatment.afterImage || "/placeholder.svg"}
                                    alt="Después del tratamiento"
                                    className="w-full h-32 object-cover rounded-lg border border-border"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "documentos" && (
          <div className="pb-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos del Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                {!patient.documents || patient.documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay documentos cargados</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patient.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">Subido: {doc.uploadDate}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} download={doc.name}>
                            Descargar
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notas" && (
          <div className="pb-6">
            <Card>
              <CardHeader>
                <CardTitle>Notas del Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                {!patient.notes || patient.notes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay notas registradas</p>
                ) : (
                  <div className="space-y-3">
                    {patient.notes.map((note) => (
                      <div key={note.id} className="border-l-4 border-emerald-500 pl-4 py-2">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{note.date}</p>
                          <p className="text-xs text-muted-foreground">{note.author}</p>
                        </div>
                        <p className="text-sm text-foreground">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
