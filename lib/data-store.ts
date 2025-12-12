export interface Patient {
  id: string
  name: string
  documentType: string
  documentId: string
  birthDate: string
  gender: string
  maritalStatus: string
  phone: string
  email: string
  address: string
  consultReason: string
  allergies: string
  medications: string
  consentSigned: boolean
  fileUploaded: boolean
  lastVisit?: string
  documents?: Array<{ id: string; name: string; url: string; uploadDate: string }>
  treatments?: Treatment[]
  notes?: Array<{ id: string; content: string; date: string; author: string }>
  appointments?: Appointment[]
}

export interface Alert {
  id: string
  priority: "Alta" | "Media" | "Baja"
  patientName: string
  description: string
  date: string
  status: "Nueva" | "Revisada" | "Descartada"
}

export interface Appointment {
  id: string
  date: string
  time: string
  patientName: string
  patientId: string
  treatment: string
  professional: string
}

export interface Treatment {
  id: string
  patientId: string
  patientName: string
  date: string
  professional: string
  treatmentName: string
  zones: string
  description: string
  products: Array<{ name: string; lot: string; quantity: string }>
  observations: string
  recommendations: string
  followUpDate?: string
  beforeImage?: string
  afterImage?: string
}

export interface Consultation {
  id: string
  patientId: string
  date: string
  treatment: string
  notes: string
  professional: string
}

export interface User {
  email: string
  password: string
  role: "Personal" | "Paciente" | "Admin"
  name: string
  title?: string
  roleType?: string
  permissions?: UserPermissions
}

export interface UserPermissions {
  patientManagement: {
    viewClinicalHistory: boolean
    addNotesAndPhotos: boolean
    editPatientInfo: boolean
  }
  appointmentsAndSchedule: {
    viewOwnSchedule: boolean
    viewOthersSchedule: boolean
    addTreatmentOrPatient: boolean
  }
  billing: {
    viewPaymentHistory: boolean
    generateInvoices: boolean
    applyDiscounts: boolean
  }
}

export interface ClinicConfiguration {
  centerName: string
  address: string
  logo?: string
  language: string
  timezone: string
  dateFormat: string
  timeFormat: string
  aiSensitivity: number
}

export const clinicConfig: ClinicConfiguration = {
  centerName: "Centro Estético Laskin",
  address: "Av. Principal 123, Ciudad, País",
  logo: undefined,
  language: "es",
  timezone: "utc-5",
  dateFormat: "dmy",
  timeFormat: "24",
  aiSensitivity: 50,
}

export const roleTemplates: Record<string, { description: string; permissions: UserPermissions }> = {
  Dermatólogo: {
    description: "Acceso completo a historias clínicas y tratamientos.",
    permissions: {
      patientManagement: {
        viewClinicalHistory: true,
        addNotesAndPhotos: true,
        editPatientInfo: true,
      },
      appointmentsAndSchedule: {
        viewOwnSchedule: true,
        viewOthersSchedule: true,
        addTreatmentOrPatient: true,
      },
      billing: {
        viewPaymentHistory: true,
        generateInvoices: false,
        applyDiscounts: false,
      },
    },
  },
  Esteticista: {
    description: "Acceso a agenda, registro de tratamientos y notas.",
    permissions: {
      patientManagement: {
        viewClinicalHistory: true,
        addNotesAndPhotos: false,
        editPatientInfo: true,
      },
      appointmentsAndSchedule: {
        viewOwnSchedule: true,
        viewOthersSchedule: false,
        addTreatmentOrPatient: true,
      },
      billing: {
        viewPaymentHistory: false,
        generateInvoices: false,
        applyDiscounts: false,
      },
    },
  },
  "Personal Administrativo": {
    description: "Gestión de citas, facturación y datos de pacientes.",
    permissions: {
      patientManagement: {
        viewClinicalHistory: false,
        addNotesAndPhotos: false,
        editPatientInfo: true,
      },
      appointmentsAndSchedule: {
        viewOwnSchedule: true,
        viewOthersSchedule: true,
        addTreatmentOrPatient: false,
      },
      billing: {
        viewPaymentHistory: true,
        generateInvoices: true,
        applyDiscounts: true,
      },
    },
  },
  "Call Center": {
    description: "Acceso limitado para agendar y confirmar citas.",
    permissions: {
      patientManagement: {
        viewClinicalHistory: false,
        addNotesAndPhotos: false,
        editPatientInfo: false,
      },
      appointmentsAndSchedule: {
        viewOwnSchedule: true,
        viewOthersSchedule: false,
        addTreatmentOrPatient: false,
      },
      billing: {
        viewPaymentHistory: false,
        generateInvoices: false,
        applyDiscounts: false,
      },
    },
  },
}

// Initial data
export const users: User[] = [
  {
    email: "anaperez@laskin.com.co",
    password: "Anaoperez19*",
    role: "Personal",
    name: "Ana Pérez",
    title: "Dermatóloga",
    roleType: "Dermatólogo",
    permissions: roleTemplates["Dermatólogo"].permissions,
  },
  {
    email: "administrador@laskin.com.co",
    password: "administrador19*",
    role: "Admin",
    name: "Admin Laskin",
    roleType: "Admin",
    permissions: {
      patientManagement: {
        viewClinicalHistory: true,
        addNotesAndPhotos: true,
        editPatientInfo: true,
      },
      appointmentsAndSchedule: {
        viewOwnSchedule: true,
        viewOthersSchedule: true,
        addTreatmentOrPatient: true,
      },
      billing: {
        viewPaymentHistory: true,
        generateInvoices: true,
        applyDiscounts: true,
      },
    },
  },
]

export const patients: Patient[] = []

export const alerts: Alert[] = []

export const appointments: Appointment[] = []

export const treatments: Treatment[] = []

export const consultations: Consultation[] = []

export function generateAlertForPatient(patientId: string, patientName: string, treatmentName: string) {
  const alertTypes = [
    {
      priority: "Media" as const,
      description: `Seguimiento recomendado: Revisar evolución del tratamiento de ${treatmentName}`,
    },
    {
      priority: "Baja" as const,
      description: `Recordatorio: Programar cita de control post-${treatmentName}`,
    },
  ]

  const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]

  const newAlert: Alert = {
    id: `A${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    priority: randomAlert.priority,
    patientName: patientName,
    description: randomAlert.description,
    date: new Date().toLocaleDateString("es-ES"),
    status: "Nueva",
  }

  alerts.push(newAlert)
}

export function generateAllergyAlerts(patient: Patient) {
  if (patient.allergies && patient.allergies.toLowerCase() !== "ninguna" && patient.allergies.trim() !== "") {
    const allergyAlert: Alert = {
      id: `A${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      priority: "Alta",
      patientName: patient.name,
      description: `Alergias conocidas: ${patient.allergies}. Verificar antes de cualquier tratamiento.`,
      date: new Date().toLocaleDateString("es-ES"),
      status: "Nueva",
    }
    alerts.push(allergyAlert)
  }
}

export function hasPermission(user: User | null, category: keyof UserPermissions, permission: string): boolean {
  if (!user || !user.permissions) return false
  const categoryPerms = user.permissions[category] as Record<string, boolean>
  return categoryPerms[permission] === true
}

export function updateRolePermissions(roleType: string, newPermissions: UserPermissions) {
  // Update the template
  if (roleTemplates[roleType]) {
    roleTemplates[roleType].permissions = newPermissions
  }

  // Update all users with this role type
  users.forEach((user) => {
    if (user.roleType === roleType) {
      user.permissions = { ...newPermissions }
    }
  })
}

export function updateClinicConfiguration(config: Partial<ClinicConfiguration>) {
  Object.assign(clinicConfig, config)
}
