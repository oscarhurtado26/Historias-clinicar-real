export function LaskinLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-primary-foreground"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
          <path d="M12 7v5" />
          <circle cx="12" cy="14" r="2" />
        </svg>
      </div>
      <span className="text-2xl font-bold text-foreground">Laskin</span>
    </div>
  )
}
