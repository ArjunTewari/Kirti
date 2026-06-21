export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-sage-50) 0%, var(--color-cream) 50%, var(--color-terra-50) 100%)" }}>

      {/* Decorative background circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-sage-200) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-terra-200) 0%, transparent 70%)" }} />

      {/* Floating nature elements */}
      <div className="absolute top-12 right-16 opacity-20 animate-float pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 5C30 5 8 18 8 34a22 22 0 0 0 44 0C52 18 30 5 30 5z" fill="var(--color-sage-400)" />
          <path d="M30 5v42" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-12 opacity-20 animate-float-slow pointer-events-none">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="30" rx="18" ry="8" fill="var(--color-sage-300)" />
          <ellipse cx="22" cy="26" rx="14" ry="6" fill="var(--color-sage-400)" />
          <circle cx="22" cy="21" r="5" fill="var(--color-terra-300)" />
        </svg>
      </div>

      {children}
    </div>
  );
}
