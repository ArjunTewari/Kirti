import { buildAttendanceSummary } from "@/lib/attendance";

describe("buildAttendanceSummary", () => {
  const students = [
    { id: "s1", name: "Priya" },
    { id: "s2", name: "Rahul" },
    { id: "s3", name: "Ananya" },
  ];
  const attended = new Set(["s1", "s3"]);

  it("marks attended students correctly", () => {
    const summary = buildAttendanceSummary(students, attended);
    expect(summary.find((s) => s.id === "s1")?.attended).toBe(true);
    expect(summary.find((s) => s.id === "s3")?.attended).toBe(true);
  });

  it("marks absent students correctly", () => {
    const summary = buildAttendanceSummary(students, attended);
    expect(summary.find((s) => s.id === "s2")?.attended).toBe(false);
  });

  it("returns one entry per student", () => {
    const summary = buildAttendanceSummary(students, attended);
    expect(summary).toHaveLength(3);
  });
});
