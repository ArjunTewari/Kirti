"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); return; }
    const me = await fetch("/api/me").then(r => r.json());
    router.push(me?.role === "TEACHER" ? "/dashboard" : "/student");
  };

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <div className="rounded-2xl p-6 sm:p-8"
        style={{ background: "white", boxShadow: "0 8px 40px rgba(44,62,48,0.12)", border: "1px solid var(--color-warm-border)" }}>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, var(--color-sage-50) 0%, var(--color-terra-50) 100%)" }}>
            <LotusAvatar />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
            Kirti Yoga
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-sage)" }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--color-muted-sage)" }}>Email</label>
            <input
              id="email"
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="you@example.com"
              className="w-full px-4 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                height: "48px",
                background: "var(--color-cream)",
                border: `1px solid ${errors.email ? "#EF4444" : "var(--color-warm-border)"}`,
                color: "var(--color-forest)",
                WebkitAppearance: "none",
              }}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--color-muted-sage)" }}>Password</label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  height: "48px",
                  background: "var(--color-cream)",
                  border: `1px solid ${errors.password ? "#EF4444" : "var(--color-warm-border)"}`,
                  color: "var(--color-forest)",
                  WebkitAppearance: "none",
                }}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center rounded-r-xl transition-colors"
                style={{ color: "var(--color-muted-sage)", minWidth: "44px" }}
                aria-label={showPwd ? "Hide password" : "Show password"}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 active:scale-95"
            style={{
              height: "48px",
              background: loading ? "var(--color-sage-400)" : "var(--color-sage-600)",
              cursor: loading ? "wait" : "pointer",
            }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--color-muted-sage)" }}>
          New student?{" "}
          <a href="/register" className="font-semibold" style={{ color: "var(--color-sage-600)" }}>
            Register here
          </a>
        </p>
      </div>

      <p className="text-center text-xs mt-4 italic" style={{ color: "var(--color-muted-sage)" }}>
        &ldquo;Inhale the future, exhale the past.&rdquo;
      </p>
    </div>
  );
}

function LotusAvatar() {
  return (
    <svg width="34" height="34" viewBox="0 0 200 200" fill="none">
      <ellipse cx="100" cy="148" rx="38" ry="11" fill="var(--color-sage-200)" fillOpacity="0.6" />
      <path d="M65 140 Q68 125 100 122 Q132 125 135 140 Q118 148 100 149 Q82 148 65 140Z" fill="var(--color-sage-500)" />
      <circle cx="100" cy="92" r="22" fill="var(--color-terra-400)" />
      <path d="M80 86 Q84 74 100 72 Q116 74 120 86" fill="#4A2E0A" />
      <path d="M88 97 Q92 94 96 97" stroke="#3D2508" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M104 97 Q108 94 112 97" stroke="#3D2508" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M93 106 Q100 110 107 106" stroke="#7A4B24" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
