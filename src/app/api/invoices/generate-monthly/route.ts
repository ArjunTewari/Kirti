import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const { month, amount } = parsed.data;

  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });

  let created = 0;
  for (const s of students) {
    const existing = await prisma.invoice.findFirst({
      where: { studentId: s.id, type: "MONTHLY", month },
    });
    if (!existing) {
      await prisma.invoice.create({
        data: { studentId: s.id, type: "MONTHLY", month, amount, status: "PENDING" },
      });
      created++;
    }
  }

  return NextResponse.json({ created });
}
