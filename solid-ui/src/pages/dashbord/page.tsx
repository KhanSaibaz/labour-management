import { useState, useCallback } from "react";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";

// ─── Types (mapped to actual entities) ─────────────────────────────────────

interface DashboardData {
    stats: Stat[];
    attendanceData: ChartData;
    donutData: ChartData;
    salaryData: ChartData;
    advancePayments: AdvancePayment[];
    inventory: InventoryItem[];
    recentLabours: Labour[];
    lastRefreshed: string;
}

interface Stat {
    label: string; value: string; sub: string;
    subColor: string; icon: string; iconBg: string; iconColor: string;
}

interface ChartData { labels: string[]; datasets: any[]; }

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

// ─── Data Generator ──────────────────────────────────────────────────────────
const generateData = (): DashboardData => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const totalLabours = rand(78, 95);
    const presentToday = rand(60, totalLabours);
    const absentToday = totalLabours - presentToday;
    const attendancePct = ((presentToday / totalLabours) * 100).toFixed(1);
    const absentPct = (100 - parseFloat(attendancePct)).toFixed(1);
    const salaryPaid = rand(200, 280);
    const pendingSalary = rand(5, 18);
    const invPending = rand(5, 20);
    const invNewReqs = rand(2, 8);
    const activeSites = rand(4, 8);

    const timeStr = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    const statuses: Array<"Pending" | "Paid"> = ["Pending", "Paid"];
    const rs = () => statuses[rand(0, 1)];

    return {
        lastRefreshed: timeStr,

        stats: [
            { label: "Total Labours", value: `${totalLabours}`, sub: `Across ${activeSites} sites`, subColor: "#185FA5", icon: "pi pi-users", iconBg: "#E6F1FB", iconColor: "#185FA5" },
            { label: "Present Today", value: `${presentToday}`, sub: `${attendancePct}% attendance`, subColor: "#3B6D11", icon: "pi pi-check-circle", iconBg: "#EAF3DE", iconColor: "#3B6D11" },
            { label: "Absent Today", value: `${absentToday}`, sub: `${absentPct}% absent`, subColor: "#A32D2D", icon: "pi pi-times-circle", iconBg: "#FCEBEB", iconColor: "#A32D2D" },
            { label: "Salary Paid", value: `₹${salaryPaid / 10}L`, sub: `${pendingSalary} pending`, subColor: "#854F0B", icon: "pi pi-wallet", iconBg: "#FAEEDA", iconColor: "#854F0B" },
            { label: "Inventory Pending", value: `${invPending}`, sub: `${invNewReqs} new requests`, subColor: "#A32D2D", icon: "pi pi-box", iconBg: "#FCEBEB", iconColor: "#A32D2D" },
            { label: "Active Sites", value: `${activeSites}`, sub: "All operational", subColor: "#3B6D11", icon: "pi pi-map-marker", iconBg: "#EAF3DE", iconColor: "#3B6D11" },
        ],

        attendanceData: {
            labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            datasets: [
                { label: "Present", data: [rand(1600, 1900), rand(1500, 1850), rand(1600, 1800), rand(1700, 1900), rand(1580, 1800), presentToday * rand(20, 22)], backgroundColor: "#378ADD", borderRadius: 4, barPercentage: 0.65 },
                { label: "Absent", data: [rand(200, 380), rand(280, 400), rand(200, 320), rand(180, 280), rand(280, 400), absentToday * rand(18, 22)], backgroundColor: "#E24B4A", borderRadius: 4, barPercentage: 0.65 },
            ],
        },

        donutData: {
            labels: ["Pending", "In Progress", "Completed"],
            datasets: [{ data: [rand(8, 20), rand(5, 15), rand(25, 45)], backgroundColor: ["#EF9F27", "#378ADD", "#639922"], borderWidth: 0, hoverOffset: 6 }],
        },

        salaryData: {
            labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            datasets: [{
                label: "Salary Paid (₹)",
                data: [rand(180000, 220000), rand(200000, 230000), rand(210000, 240000), rand(205000, 235000), rand(215000, 245000), salaryPaid * 1000],
                borderColor: "#378ADD", backgroundColor: "rgba(55,138,221,0.08)", borderWidth: 2,
                pointBackgroundColor: "#378ADD", pointRadius: 4, fill: true, tension: 0.4,
            }],
        },

        // ── AdvancePayment entity fields ────────────────────────────────────────
        advancePayments: [
            { labourName: "Raju Yadav", site: "Site A", advanceMonth: "Mar 2026", repaymentStatus: rs(), totalPay: rand(3, 9) * 1000, balanceAmount: rand(1, 5) * 1000, monthlyDeduction: rand(500, 2000) },
            { labourName: "Mohan Lal", site: "Site C", advanceMonth: "Mar 2026", repaymentStatus: rs(), totalPay: rand(3, 9) * 1000, balanceAmount: rand(1, 5) * 1000, monthlyDeduction: rand(500, 2000) },
            { labourName: "Suresh Kumar", site: "Site B", advanceMonth: "Feb 2026", repaymentStatus: rs(), totalPay: rand(2, 6) * 1000, balanceAmount: rand(1, 4) * 1000, monthlyDeduction: rand(500, 1500) },
            { labourName: "Ramesh Singh", site: "Site D", advanceMonth: "Feb 2026", repaymentStatus: rs(), totalPay: rand(4, 8) * 1000, balanceAmount: rand(2, 5) * 1000, monthlyDeduction: rand(500, 2000) },
        ],

        // ── InventoryManagement entity fields ───────────────────────────────────
        inventory: [
            { siteName: 'Site A', productName: "Safety Helmets", productQuantity: rand(2, 8) },
            { siteName: 'Site B', productName: "Safety Helmets", productQuantity: rand(2, 8) },
            { siteName: 'Site C', productName: "Safety Helmets", productQuantity: rand(2, 8) },
            { siteName: 'Site D', productName: "Safety Helmets", productQuantity: rand(2, 8) },
            { siteName: 'Site E', productName: "Safety Helmets", productQuantity: rand(2, 8) },
        ],

        recentLabours: [
            { name: "Vikram Patel", workType: "Mason", site: "Site A", joinDate: "Mar 10" },
            { name: "Deepak Verma", workType: "Electrician", site: "Site C", joinDate: "Mar 14" },
            { name: "Santosh Mishra", workType: "Carpenter", site: "Site B", joinDate: "Mar 17" },
            { name: "Ravi Kumar", workType: "Helper", site: "Site E", joinDate: "Mar 22" },
        ],
    };
};

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
    const [data, setData] = useState<DashboardData>(generateData);
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = useCallback(() => {
        setSpinning(true);
        setTimeout(() => { setData(generateData()); setSpinning(false); }, 600);
    }, []);

    const { stats, attendanceData, donutData, advancePayments, inventory, recentLabours, lastRefreshed } = data;
    const donutCounts = donutData.datasets[0].data as number[];

    const card: React.CSSProperties = {
        background: "var(--surface-card, #fff)",
        borderRadius: "10px",
        padding: "1.25rem",
        border: "0.5px solid var(--surface-border, #dee2e6)",
        height: "100%",
    };

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
                    {stats.map((s, i) => (
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
                                    {[{ color: "#378ADD", label: "Present" }, { color: "#E24B4A", label: "Absent" }].map((l) => (
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
                            {advancePayments.map((p, i) => (
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
                            {inventory.map((item, i) => (
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
                            {recentLabours.map((l, i) => (
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