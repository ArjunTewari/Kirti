export function buildAttendanceSummary(
  students: { id: string; name: string }[],
  attendedIds: Set<string>
) {
  return students.map((s) => ({ ...s, attended: attendedIds.has(s.id) }));
}
