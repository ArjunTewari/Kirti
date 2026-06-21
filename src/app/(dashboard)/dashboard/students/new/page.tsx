"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Min 6 chars"),
  registrationFee: z.string().optional(),
});
type Form = z.infer<typeof schema>;

export default function AddStudentPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { registrationFee: "500" },
  });

  const onSubmit = async (data: Form) => {
    setError("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        registrationFee: data.registrationFee ? parseFloat(data.registrationFee) : undefined,
      }),
    });
    if (res.status === 409) { setError("Email already exists."); return; }
    if (!res.ok) { setError("Failed to add student."); return; }
    router.push("/dashboard/students");
    router.refresh();
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/students" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { id: "name", label: "Full Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone", label: "Phone (optional)", type: "tel" },
            { id: "password", label: "Temporary Password", type: "text" },
            { id: "registrationFee", label: "Registration Fee ₹ (optional)", type: "number" },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input {...register(id as keyof Form)} type={type}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              {errors[id as keyof Form] && <p className="text-red-500 text-xs mt-1">{errors[id as keyof Form]?.message}</p>}
            </div>
          ))}
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {isSubmitting ? "Adding…" : "Add Student"}
            </button>
            <Link href="/dashboard/students"
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
