import { hashPassword, verifyPassword, isTeacher, isStudent } from "@/lib/auth-helpers";

describe("auth-helpers", () => {
  describe("hashPassword / verifyPassword", () => {
    it("hashes a password and verifies it correctly", async () => {
      const plain = "secret123";
      const hashed = await hashPassword(plain);
      expect(hashed).not.toBe(plain);
      expect(await verifyPassword(plain, hashed)).toBe(true);
    });

    it("returns false for wrong password", async () => {
      const hashed = await hashPassword("correct");
      expect(await verifyPassword("wrong", hashed)).toBe(false);
    });
  });

  describe("role guards", () => {
    it("isTeacher returns true for TEACHER role", () => {
      expect(isTeacher("TEACHER")).toBe(true);
      expect(isTeacher("STUDENT")).toBe(false);
    });

    it("isStudent returns true for STUDENT role", () => {
      expect(isStudent("STUDENT")).toBe(true);
      expect(isStudent("TEACHER")).toBe(false);
    });
  });
});
