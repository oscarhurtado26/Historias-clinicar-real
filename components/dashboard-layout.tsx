"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LaskinLogo } from "./laskin-logo"
import { SidebarNav } from "./sidebar-nav"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <LaskinLogo />
        </div>
        <div className="flex-1 max-w-md mx-4 md:mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar por paciente" className="pl-10" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <SidebarNav />
        </aside>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
