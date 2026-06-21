import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canBook, getHeadcount } from "@/lib/class-booking";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: classEventId } = await params;

  const event = await prisma.classEvent.findUnique({
    where: { id: classEventId },
    include: { bookings: { where: { status: "BOOKED" }, select: { status: true } } },
  });

  if (!event) return NextResponse.json({ error: "Class not found" }, { status: 404 });
  if (event.cancelledAt) return NextResponse.json({ error: "Class is cancelled" }, { status: 400 });
  if (!canBook(event.capacity, getHeadcount(event.bookings))) {
    return NextResponse.json({ error: "Class is full" }, { status: 409 });
  }

  const booking = await prisma.classBooking.upsert({
    where: { studentId_classEventId: { studentId: session.user.id, classEventId } },
    update: { status: "BOOKED" },
    create: { studentId: session.user.id, classEventId, status: "BOOKED" },
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: classEventId } = await params;

  const event = await prisma.classEvent.findUnique({ where: { id: classEventId } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { canCancelBooking } = await import("@/lib/class-booking");
  if (!canCancelBooking(event.date)) {
    return NextResponse.json({ error: "Cannot cancel — class already started" }, { status: 400 });
  }

  const booking = await prisma.classBooking.update({
    where: { studentId_classEventId: { studentId: session.user.id, classEventId } },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json(booking);
}
