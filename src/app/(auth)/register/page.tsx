"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
  name:     z.string().min(1, "Name required"),
  email:    z.string().email("Invalid email"),
  phone:    z.string().optional(),
  password: z.string().min(6, "Min 6 characters"),
});
type Form = z.infer<typeof schema>;

const FIELDS = [
  { id: "name",     label: "Full Name",         type: "text",     autoComplete: "name",             inputMode: undefined,    placeholder: "Your name" },
  { id: "email",    label: "Email",             type: "email",    autoComplete: "email",            inputMode: "email" as const, placeholder: "you@example.com" },
  { id: "phone",    label: "Phone (optional)",  type: "tel",      autoComplete: "tel",              inputMode: "tel" as const,   placeholder: "+91 98765 43210" },
  { id: "password", label: "Password",          type: "password", autoComplete: "new-password",     inputMode: undefined,    placeholder: "Min 6 characters" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setError("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) { setError("Email already registered."); return; }
    if (!res.ok) { setError("Registration failed. Try again."); return; }
    router.push("/login?registered=1");
  };

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <div className="rounded-2xl p-6 sm:p-8"
        style={{ background: "white", boxShadow: "0 8px 40px rgba(44,62,48,0.12)", border: "1px solid var(--color-warm-border)" }}>

        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--color-sage-50)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 21c0 0-8-5-8-11a8 8 0 0 1 8-4 8 8 0 0 1 8 4c0 6-8 11-8 11z" fill="var(--color-sage-100)" />
              <path d="M12 21c0 0-4-3-4-7 0-2.5 1.8-4.5 4-5 2.2.5 4 2.5 4 5 0 4-4 7-4 7z" fill="var(--color-sage-500)" />
              <circle cx="12" cy="14" r="2" fill="var(--color-terra-400)" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
            Join Kirti Yoga
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-sage)" }}>Create your student account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {FIELDS.map(({ id, label, type, autoComplete, inputMode, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--color-muted-sage)" }}>{label}</label>
              <input
                id={id}
                {...register(id)}
                type={type}
                autoComplete={autoComplete}
                inputMode={inputMode}
                autoCapitalize={id === "email" ? "none" : undefined}
                autoCorrect="off"
                placeholder={placeholder}
                className="w-full px-4 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  height: "48px",
                  background: "var(--color-cream)",
                  border: `1px solid ${errors[id] ? "#EF4444" : "var(--color-warm-border)"}`,
                  color: "var(--color-forest)",
                  WebkitAppearance: "none",
                }}
              />
              {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>}
            </div>
          ))}

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 active:scale-95"
            style={{ height: "48px", background: "var(--color-sage-600)", cursor: isSubmitting ? "wait" : "pointer" }}>
            {isSubmitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--color-muted-sage)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--color-sage-600)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
