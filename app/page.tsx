"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LaskinLogo } from "@/components/laskin-logo"
import { ToastNotification } from "@/components/toast-notification"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [userType, setUserType] = useState<"Personal" | "Paciente">("Personal")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)

    if (success) {
      setToast({ type: "success", message: "Sesión exitosa" })
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else {
      setError("Correo o contraseña incorrecta")
      setToast({ type: "error", message: "Correo o contraseña incorrecta" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <LaskinLogo />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Bienvenido/a de nuevo</h1>
            <p className="text-sm text-muted-foreground">Accede a tu cuenta para continuar</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={userType === "Personal" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setUserType("Personal")}
          >
            Personal
          </Button>
          <Button
            type="button"
            variant={userType === "Paciente" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setUserType("Paciente")}
          >
            Paciente
          </Button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="anaperez@laskin.com.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={error ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={error ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              ¿Olvidé mi contraseña?
            </a>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Iniciar sesión
          </Button>
        </form>
      </div>

      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
