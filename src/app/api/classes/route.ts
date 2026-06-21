import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  capacity: z.number().int().min(1).max(200).default(30),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classes = await prisma.classEvent.findMany({
    orderBy: { date: "asc" },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        where: { status: "BOOKED" },
        select: { studentId: true },
      },
    },
  });

  return NextResponse.json(classes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await prisma.classEvent.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
      capacity: parsed.data.capacity,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
