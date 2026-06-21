import { computeDashboardStats } from "@/lib/dashboard-stats";

const now = new Date();
const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

describe("computeDashboardStats", () => {
  const invoices = [
    { status: "PENDING", amount: 1500, paidAt: null },
    { status: "PENDING", amount: 1500, paidAt: null },
    { status: "PAID", amount: 1500, paidAt: thisMonth },
    { status: "PAID", amount: 500, paidAt: lastMonth },
  ];

  it("counts total students", () => {
    const stats = computeDashboardStats(10, invoices as never);
    expect(stats.totalStudents).toBe(10);
  });

  it("counts pending invoices", () => {
    const stats = computeDashboardStats(10, invoices as never);
    expect(stats.pendingInvoicesCount).toBe(2);
  });

  it("sums this-month revenue (PAID invoices paidAt in current month)", () => {
    const stats = computeDashboardStats(10, invoices as never);
    expect(stats.thisMonthRevenue).toBe(1500);
  });

  it("total pending amount", () => {
    const stats = computeDashboardStats(10, invoices as never);
    expect(stats.pendingAmount).toBe(3000);
  });
});
