import { useState, useCallback, useMemo } from "react";
import { Chart } from "primereact/chart";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { useGetDashboardQuery } from "../../redux/dasboardApi";
import { AdvancePayment, Stat, InventoryItem } from './dashboard.types';

// ─── Chart Options ────────────────────────────────────────────────────────
const attendanceOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: "#888780" },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.06)" },
      ticks: { font: { size: 11 }, color: "#888780", maxTicksLimit: 5 },
      border: { display: false },
    },
  },
};

const salaryOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: "#888780" },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.06)" },
      ticks: { font: { size: 11 }, color: "#888780", maxTicksLimit: 5 },
      border: { display: false },
    },
  },
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}`,
      },
    },
  },
};

const formatAmount = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const currentMonthYear = new Date().toLocaleString("en-IN", {
  month: "long",
  year: "numeric",
});

// ─── Component ────────────────────────────────────────────────────────────
export const DashBoardPage = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refetch]);

  // ── Extract data ───────────────────────────────────────────────────────
  const dashboardData = (data as any)?.data || {};
  const {
    stats = [],
    attendanceData = null,
    donutData = null,
    salaryData = null,
    advancePayments = [],
    inventory = [],
    lastRefreshed = "N/A",
  } = dashboardData;

  // ✅ ALL useMemo hooks BEFORE any early return (Rules of Hooks)
  // Redux store freezes data (immutable). Chart.js needs mutable objects,
  // so JSON clone is required — otherwise "Cannot assign to read only" crash.
  const chartAttendance = useMemo(() => {
    if (!attendanceData) return null;
    return JSON.parse(JSON.stringify(attendanceData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(attendanceData)]);

  const chartDonut = useMemo(() => {
    if (!donutData) return null;
    return JSON.parse(JSON.stringify(donutData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(donutData)]);

  const chartSalary = useMemo(() => {
    if (!salaryData) return null;
    return JSON.parse(JSON.stringify(salaryData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(salaryData)]);

  const donutCounts = (chartDonut?.datasets?.[0]?.data as number[]) ?? [0, 0, 0];

  const card: React.CSSProperties = {
    background: "var(--surface-card, #fff)",
    borderRadius: "10px",
    padding: "1.25rem",
    border: "0.5px solid var(--surface-border, #dee2e6)",
    height: "100%",
  };

  // ✅ Early returns AFTER all hooks
  if (isLoading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center" }}>
        <i className="pi pi-exclamation-triangle" style={{ fontSize: "3rem", color: "#A32D2D" }} />
        <div>
          <h3 style={{ color: "var(--text-color)", marginBottom: "0.5rem" }}>Error Loading Dashboard</h3>
          <p style={{ color: "var(--text-color-secondary)", fontSize: "13px", margin: 0 }}>
            Something went wrong. Please try again.
          </p>
        </div>
        <Button label="Retry" icon="pi pi-refresh" onClick={handleRefresh} style={{ marginTop: "1rem" }} />
      </div>
    );
  }

  // ── Main Render ────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "1rem 1.25rem", background: "var(--surface-ground, #f8f9fa)", minHeight: "100%" }}>

        {/* ── Top Bar ── */}
        <div className="flex align-items-center justify-content-between mb-3">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: 0, color: "var(--text-color)" }}>
              Labour Dashboard
            </h2>
            <span style={{ fontSize: "13px", color: "var(--text-color-secondary)" }}>
              {currentMonthYear} &nbsp;·&nbsp;
              <span style={{ background: "#E6F1FB", color: "#185FA5", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 }}>
                Labour Admin
              </span>
            </span>
          </div>
          <div className="flex align-items-center gap-2">
            <span style={{ fontSize: "11px", color: "var(--text-color-secondary)" }}>
              Updated: {lastRefreshed}
            </span>
            <Button
              icon={`pi pi-refresh${isRefreshing ? " pi-spin" : ""}`}
              label="Refresh"
              size="small"
              outlined
              onClick={handleRefresh}
              disabled={isLoading}
              style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid mb-3">
          {stats.map((s: Stat, i: number) => (
            <div key={i} className="col-12 sm:col-6 md:col-4 lg:col-2">
              <div style={{ background: "var(--surface-card,#fff)", borderRadius: "10px", padding: "1rem 1.1rem", border: "0.5px solid var(--surface-border,#dee2e6)", height: "100%" }}>
                <div className="flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: "11px", color: "var(--text-color-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {s.label}
                  </span>
                  <span style={{ background: s.iconBg, color: s.iconColor, borderRadius: "8px", padding: "5px 7px", fontSize: "14px" }}>
                    <i className={s.icon} />
                  </span>
                </div>
                <div style={{ fontSize: "26px", fontWeight: 600, color: "var(--text-color)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "11px", color: s.subColor, marginTop: "5px" }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row 1: Attendance + Inventory Donut ── */}
        <div className="grid mb-3">

          {/* Attendance Bar Chart */}
          {chartAttendance && (
            <div className="col-12 md:col-8">
              <div style={card}>
                <div className="flex align-items-center justify-content-between mb-3">
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>
                    Monthly Attendance
                  </span>
                  <div className="flex gap-3">
                    {[{ color: "#378ADD", label: "Present" }, { color: "#E24B4A", label: "Absent" }].map((l) => (
                      <span key={l.label} className="flex align-items-center gap-1" style={{ fontSize: "11px", color: "var(--text-color-secondary)" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />
                        {l.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ height: "220px" }}>
                  <Chart type="bar" data={chartAttendance} options={attendanceOptions} style={{ height: "100%" }} />
                </div>
              </div>
            </div>
          )}

          {/* Inventory Donut */}
          {chartDonut && (
            <div className="col-12 md:col-4">
              <div style={card}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>
                  Inventory Ask Status
                </span>
                <div className="flex align-items-center gap-4 mt-3">
                  <div style={{ height: "180px", width: "180px", flexShrink: 0 }}>
                    <Chart type="doughnut" data={chartDonut} options={donutOptions} style={{ height: "100%", width: "220px" }} />
                  </div>
                  <div className="flex flex-column gap-3">
                    {[
                      { color: "#EF9F27", label: "Pending", count: donutCounts[0] },
                      { color: "#378ADD", label: "In Progress", count: donutCounts[1] },
                      { color: "#639922", label: "Completed", count: donutCounts[2] },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex align-items-center gap-2 mb-1">
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
                          <span style={{ fontSize: "12.5px", color: "var(--text-color-secondary)" }}>{item.label}</span>
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-color)", paddingLeft: "18px" }}>
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Salary Line Chart ── */}


        {/* ── Bottom Lists: Advance Payments + Inventory Alerts ── */}
        <div className="grid">

          {/* Advance Payments */}
          <div className="col-12 md:col-6">
            <div style={card}>
              <div className="flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>
                  Recent Advance Payments
                </span>
                <i className="pi pi-credit-card" style={{ fontSize: "14px", color: "var(--text-color-secondary)" }} />
              </div>
              {advancePayments?.length ? (
                advancePayments.map((p: AdvancePayment, i: number) => (
                  <div key={i}>
                    <div className="flex align-items-center justify-content-between py-2">
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-color)" }}>
                          {p.labourName}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "2px" }}>
                          {p.site} &nbsp;·&nbsp; {p.advanceMonth}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "1px" }}>
                          Deduction: {formatAmount(p.monthlyDeduction)}/mo
                        </div>
                      </div>
                      <div className="flex flex-column align-items-end gap-1">
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-color)" }}>
                          {formatAmount(p.totalPay)}
                        </span>
                        <span style={{ fontSize: "11px", color: p.balanceAmount > 0 ? "#854F0B" : "#3B6D11" }}>
                          Bal: {formatAmount(p.balanceAmount)}
                        </span>
                      </div>
                    </div>
                    {i < advancePayments.length - 1 && <Divider className="my-2" />}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "13px", color: "var(--text-color-secondary)", textAlign: "center", padding: "1rem 0" }}>
                  No advance payments
                </div>
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="col-12 md:col-6">
            <div style={card}>
              <div className="flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>
                  Inventory Alerts
                </span>
                <i className="pi pi-box" style={{ fontSize: "14px", color: "var(--text-color-secondary)" }} />
              </div>
              {inventory?.length ? (
                inventory.map((item: InventoryItem, i: number) => (
                  <div key={i}>
                    <div className="flex align-items-center justify-content-between py-2">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-color)" }}>
                          {item.productName}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "3px" }}>
                          {item.siteName}
                        </div>
                      </div>
                      <div className="flex align-items-end gap-1">
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-color)" }}>
                          {item.productQuantity}
                        </span>
                        <span style={{ fontSize: "14px", color: "#854F0B", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                          Units
                        </span>
                      </div>
                    </div>
                    {i < inventory.length - 1 && <Divider className="my-2" />}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "13px", color: "var(--text-color-secondary)", textAlign: "center", padding: "1rem 0" }}>
                  No inventory alerts
                </div>
              )}
            </div>
          </div>
        </div>

        {chartSalary && (
          <div className="mb-3">
            <div style={card}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>
                Monthly Salary Paid
              </span>
              <div style={{ height: "220px", marginTop: "1rem" }}>
                <Chart type="line" data={chartSalary} options={salaryOptions} style={{ height: "100%" }} />
              </div>
            </div>
          </div>
        )}

        <div style={{ height: "1.5rem" }} />
      </div>
    </div>
  );
};