export function canBook(capacity: number, bookedCount: number): boolean {
  return bookedCount < capacity;
}

export function canCancelBooking(classDate: Date): boolean {
  return classDate > new Date();
}

export function getHeadcount(
  bookings: { status: string }[]
): number {
  return bookings.filter((b) => b.status === "BOOKED").length;
}
