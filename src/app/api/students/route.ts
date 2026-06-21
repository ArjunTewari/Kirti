import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  registrationFee: z.number().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      invoices: { where: { status: "PENDING" }, select: { id: true, amount: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  const session = await auth();
  const isTeacher = session?.user.role === "TEACHER";

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const hashed = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone, password: hashed, role: "STUDENT" },
  });

  if (isTeacher && parsed.data.registrationFee) {
    await prisma.invoice.create({
      data: { studentId: user.id, type: "REGISTRATION", amount: parsed.data.registrationFee, status: "PENDING" },
    });
  }

  return NextResponse.json(user, { status: 201 });
}
