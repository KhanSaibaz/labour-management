import { useState, useCallback } from "react";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { useGetDashboardQuery } from "../../redux/dasboardApi";

// ─── Types (mapped to actual entities) ─────────────────────────────────────

interface Stat {
    label: string; value: string; sub: string;
    subColor: string; icon: string; iconBg: string; iconColor: string;
}


// Matches AdvancePayment entity
// `name` is a ManyToOne to Labour — we store labourName as the display string
interface AdvancePayment {
    labourName: string;           // from name: Labour (relation)
    site: string;                 // display helper
    advanceMonth: string;         // entity: advanceMonth (Date)
    repaymentStatus: string;      // entity: repaymentStatus (default "Pending")
    totalPay: number;             // entity: totalPay
    balanceAmount: number;        // entity: balanceAmount
    monthlyDeduction: number;     // entity: monthlyDeduction
}

// Matches InventoryManagement entity
interface InventoryItem {
    siteName: string;
    productName: string;          // entity: productName
    productQuantity: number;      // entity: productQuantity (stored as varchar, parsed to number for display)
}

interface Labour {
    name: string; workType: string; site: string; joinDate: string;
}

// ─── Static chart options ────────────────────────────────────────────────────
const attendanceOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index" as const, intersect: false } },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#888780" } },
        y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { font: { size: 11 }, color: "#888780", maxTicksLimit: 5 }, border: { display: false } },
    },
};

const donutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: "70%",
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}` } } },
};

const avatarColors = ["#E6F1FB", "#EAF3DE", "#FAEEDA", "#FCEBEB", "#F1EFE8"];
const avatarTextColors = ["#185FA5", "#3B6D11", "#854F0B", "#A32D2D", "#5F5E5A"];
const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
const formatAmount = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Component ───────────────────────────────────────────────────────────────
export const DashBoardPage = () => {
    const { data, isLoading, refetch } = useGetDashboardQuery();
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = useCallback(() => {
        setSpinning(true);
        refetch();
        setTimeout(() => { setSpinning(false); }, 600);
    }, [refetch]);

    if (isLoading || !data) {
        return (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
        );
    }

    const { stats, attendanceData, donutData, advancePayments, inventory, recentLabours, lastRefreshed } = data;
    const donutCounts = (donutData?.datasets?.[0]?.data as number[]) ?? [0, 0, 0];

    const card: React.CSSProperties = {
        background: "var(--surface-card, #fff)",
        borderRadius: "10px",
        padding: "1.25rem",
        border: "0.5px solid var(--surface-border, #dee2e6)",
        height: "100%",
    };

    if (isLoading || !data || !data.donutData) {
        return (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
        );
    }

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
                            March 2026 &nbsp;·&nbsp;
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
                            icon={`pi pi-refresh${spinning ? " pi-spin" : ""}`}
                            label="Refresh"
                            size="small"
                            outlined
                            onClick={handleRefresh}
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
                                <div style={{ fontSize: "26px", fontWeight: 600, color: "var(--text-color)", lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: "11px", color: s.subColor, marginTop: "5px" }}>{s.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid mb-3">

                    {/* Attendance */}
                    <div className="col-12 md:col-8">
                        <div style={card}>
                            <div className="flex align-items-center justify-content-between mb-3">
                                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>Monthly Attendance</span>
                                <div className="flex gap-3">
                                    {[{ color: "#378ADD", label: "Present" }, { color: "#E24B4A", label: "Absent" }].map((l: { color: string; label: string }) => (
                                        <span key={l.label} className="flex align-items-center gap-1" style={{ fontSize: "11px", color: "var(--text-color-secondary)" }}>
                                            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />
                                            {l.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ height: "220px" }}>
                                <Chart type="bar" data={attendanceData} options={attendanceOptions} style={{ height: "100%" }} />
                            </div>
                        </div>
                    </div>

                    {/* Inventory Ask Donut */}
                    <div className="col-12 md:col-4">
                        <div style={card}>
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>Inventory Ask Status</span>
                            <div className="flex align-items-center gap-4 mt-3">
                                <div style={{ height: "180px", width: "250px", flexShrink: 0 }}>
                                    <Chart type="doughnut" data={donutData} options={donutOptions} style={{ height: "100%" }} />
                                </div>
                                <div className="flex flex-column gap-3">
                                    {[
                                        { color: "#EF9F27", label: "Pending", count: donutCounts[0] },
                                        { color: "#378ADD", label: "In Progress", count: donutCounts[1] },
                                        { color: "#639922", label: "Completed", count: donutCounts[2] },
                                    ].map((item: { color: string; label: string; count: number }) => (
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
                </div>

                {/* ── Bottom Lists ── */}
                <div className="grid">

                    {/* AdvancePayment — using entity fields */}
                    <div className="col-12 md:col-4">
                        <div style={card}>
                            <div className="flex align-items-center justify-content-between mb-2">
                                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>Recent Advance Payments</span>
                                <i className="pi pi-credit-card" style={{ fontSize: "14px", color: "var(--text-color-secondary)" }} />
                            </div>
                            {advancePayments.map((p: AdvancePayment, i: number) => (
                                <div key={i}>
                                    <div className="flex align-items-center justify-content-between py-2">
                                        <div>
                                            {/* labourName comes from the ManyToOne Labour relation */}
                                            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-color)" }}>{p.labourName}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "2px" }}>
                                                {p.site} &nbsp;·&nbsp; {p.advanceMonth}
                                            </div>
                                            {/* monthlyDeduction from entity */}
                                            <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "1px" }}>
                                                Deduction: {formatAmount(p.monthlyDeduction)}/mo
                                            </div>
                                        </div>
                                        <div className="flex flex-column align-items-end gap-1">
                                            {/* totalPay from entity */}
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-color)" }}>
                                                {formatAmount(p.totalPay)}
                                            </span>
                                            {/* balanceAmount from entity */}
                                            <span style={{ fontSize: "11px", color: p.balanceAmount > 0 ? "#854F0B" : "#3B6D11" }}>
                                                Bal: {formatAmount(p.balanceAmount)}
                                            </span>

                                        </div>
                                    </div>
                                    {i < advancePayments.length - 1 && <Divider className="my-2" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div style={card}>
                            <div className="flex align-items-center justify-content-between mb-3">
                                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>Inventory Alerts</span>
                                <i className="pi pi-box" style={{ fontSize: "14px", color: "var(--text-color-secondary)" }} />
                            </div>
                            {inventory.map((item: InventoryItem, i: number) => (
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
                                        <div className="flex  align-items-end gap-1">
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
                            ))}
                        </div>
                    </div>

                    {/* Recent Labours */}
                    <div className="col-12 md:col-4">
                        <div style={card}>
                            <div className="flex align-items-center justify-content-between mb-3">
                                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-color)" }}>Recently Added Labours</span>
                                <i className="pi pi-users" style={{ fontSize: "14px", color: "var(--text-color-secondary)" }} />
                            </div>
                            {recentLabours.map((l: Labour, i: number) => (
                                <div key={i}>
                                    <div className="flex align-items-center gap-3 py-2">
                                        <div style={{
                                            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                            background: avatarColors[i % avatarColors.length],
                                            color: avatarTextColors[i % avatarTextColors.length],
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "12px", fontWeight: 600,
                                        }}>
                                            {getInitials(l.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-color)" }}>{l.name}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-color-secondary)", marginTop: "2px" }}>
                                                {l.workType} · {l.site}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "11px", color: "var(--text-color-secondary)", whiteSpace: "nowrap" }}>
                                            {l.joinDate}
                                        </span>
                                    </div>
                                    {i < recentLabours.length - 1 && <Divider className="my-2" />}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div style={{ height: "1.5rem" }} />
            </div>
        </div>
    );
};