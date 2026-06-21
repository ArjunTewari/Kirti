import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  studentIds: z.array(z.string()),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: classEventId } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const markedBy = session.user.role === "TEACHER" ? "TEACHER" : "STUDENT";

  await prisma.$transaction(
    parsed.data.studentIds.map((studentId) =>
      prisma.attendance.upsert({
        where: { studentId_classEventId: { studentId, classEventId } },
        update: { markedBy },
        create: { studentId, classEventId, markedBy },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
