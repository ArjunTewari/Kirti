import { buildSeedUsers } from "@/lib/seed-data";

describe("seed-data", () => {
  it("produces exactly one TEACHER and three STUDENTs", async () => {
    const users = await buildSeedUsers();
    const teachers = users.filter((u) => u.role === "TEACHER");
    const students = users.filter((u) => u.role === "STUDENT");
    expect(teachers).toHaveLength(1);
    expect(students).toHaveLength(3);
  });

  it("teacher email is kirti@yoga.com", async () => {
    const users = await buildSeedUsers();
    const teacher = users.find((u) => u.role === "TEACHER");
    expect(teacher?.email).toBe("kirti@yoga.com");
  });

  it("all passwords are hashed (not plaintext)", async () => {
    const users = await buildSeedUsers();
    for (const user of users) {
      expect(user.password).not.toMatch(/^(teacher|student|password|123)/i);
      expect(user.password.startsWith("$2")).toBe(true);
    }
  });

  it("all users have name and phone", async () => {
    const users = await buildSeedUsers();
    for (const user of users) {
      expect(user.name).toBeTruthy();
      expect(user.phone).toBeTruthy();
    }
  });
});
