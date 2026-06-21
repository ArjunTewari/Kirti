import { computeDashboardStats } from "@/lib/dashboard-stats";

const now = new Date();
const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

describe("computeDashboardStats", () => {
  const invoices = [
    { status: "PENDING", amount: 500, paidAt: null, updatedAt: thisMonth },
    { status: "PENDING", amount: 300, paidAt: null, updatedAt: thisMonth },
    { status: "PAID", amount: 800, paidAt: thisMonth, updatedAt: thisMonth },
    { status: "PAID", amount: 600, paidAt: lastMonth, updatedAt: lastMonth },
  ];

  it("counts total students", () => {
    const stats = computeDashboardStats(5, invoices as never);
    expect(stats.totalStudents).toBe(5);
  });

  it("counts pending invoices", () => {
    const stats = computeDashboardStats(5, invoices as never);
    expect(stats.pendingInvoicesCount).toBe(2);
  });

  it("sums this-month revenue (PAID invoices with paidAt in current month)", () => {
    const stats = computeDashboardStats(5, invoices as never);
    expect(stats.thisMonthRevenue).toBe(800);
  });

  it("total pending amount", () => {
    const stats = computeDashboardStats(5, invoices as never);
    expect(stats.pendingAmount).toBe(800);
  });
});
