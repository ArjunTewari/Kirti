import { canBook, canCancelBooking, getHeadcount } from "@/lib/class-booking";

describe("class-booking", () => {
  describe("canBook", () => {
    it("allows booking when spots are available", () => {
      expect(canBook(30, 10)).toBe(true);
    });

    it("blocks booking when at capacity", () => {
      expect(canBook(10, 10)).toBe(false);
    });

    it("blocks booking when over capacity", () => {
      expect(canBook(5, 6)).toBe(false);
    });
  });

  describe("canCancelBooking", () => {
    it("allows cancel when class is in the future", () => {
      const future = new Date(Date.now() + 60 * 60 * 1000);
      expect(canCancelBooking(future)).toBe(true);
    });

    it("blocks cancel when class has already started", () => {
      const past = new Date(Date.now() - 60 * 1000);
      expect(canCancelBooking(past)).toBe(false);
    });
  });

  describe("getHeadcount", () => {
    const bookings = [
      { status: "BOOKED" },
      { status: "BOOKED" },
      { status: "CANCELLED" },
      { status: "ATTENDED" },
    ];

    it("counts only BOOKED status (not CANCELLED, not ATTENDED)", () => {
      expect(getHeadcount(bookings as never)).toBe(2);
    });

    it("returns 0 when all bookings are cancelled", () => {
      const all = [{ status: "CANCELLED" }, { status: "CANCELLED" }];
      expect(getHeadcount(all as never)).toBe(0);
    });
  });
});
