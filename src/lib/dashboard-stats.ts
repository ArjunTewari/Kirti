type InvoiceRow = {
  status: string;
  amount: number;
  paidAt: Date | null;
};

export type DashboardStats = {
  totalStudents: number;
  pendingInvoicesCount: number;
  thisMonthRevenue: number;
  pendingAmount: number;
};

export function computeDashboardStats(
  totalStudents: number,
  invoices: InvoiceRow[]
): DashboardStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const pending = invoices.filter((i) => i.status === "PENDING");

  const thisMonthRevenue = invoices
    .filter(
      (i) =>
        i.status === "PAID" &&
        i.paidAt &&
        i.paidAt >= monthStart &&
        i.paidAt < monthEnd
    )
    .reduce((sum, i) => sum + i.amount, 0);

  return {
    totalStudents,
    pendingInvoicesCount: pending.length,
    thisMonthRevenue,
    pendingAmount: pending.reduce((sum, i) => sum + i.amount, 0),
  };
}
