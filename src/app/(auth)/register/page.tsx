"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Min 6 characters"),
});
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setError("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, password: data.password }),
    });
    if (res.status === 409) { setError("Email already registered."); return; }
    if (!res.ok) { setError("Registration failed. Try again."); return; }
    router.push("/login?registered=1");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🧘</div>
        <h1 className="text-2xl font-bold text-gray-900">Join Kirti Yoga</h1>
        <p className="text-gray-500 text-sm mt-1">Create your student account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { id: "name", label: "Full Name", type: "text", placeholder: "Your name" },
          { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { id: "phone", label: "Phone (optional)", type: "tel", placeholder: "+91 98765 43210" },
          { id: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input {...register(id as keyof Form)} type={type} placeholder={placeholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            {errors[id as keyof Form] && <p className="text-red-500 text-xs mt-1">{errors[id as keyof Form]?.message}</p>}
          </div>
        ))}
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>}
        <button type="submit" disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
          {isSubmitting ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link href="/login" className="text-emerald-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
