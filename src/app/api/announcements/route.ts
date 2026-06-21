import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1), body: z.string().min(1) });

export async function GET() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const a = await prisma.announcement.create({ data: parsed.data });
  return NextResponse.json(a, { status: 201 });
}
