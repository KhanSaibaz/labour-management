import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { closePopup, SolidButton } from "@solidxai/core-ui";
import { useDispatch } from "react-redux";

const GenerateSalarySlip = (e: any): React.JSX.Element => {
    const dispatch = useDispatch();

    const slipRef = useRef<HTMLDivElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const data = e?.formData;

    const labour = data?.labourCode || {};

    const formatAmount = (amount: number | string) => {
        return Number(amount || 0).toLocaleString("en-IN");
    };

    const handleGenerateSlip = async () => {
        if (!slipRef.current) return;

        try {
            setIsSubmitting(true);

            const dataUrl = await toPng(slipRef.current, {
                cacheBust: true,
                pixelRatio: 2,
            });

            const link = document.createElement("a");

            link.download = `${labour?.name || "salary-slip"}-${data?.salaryMonth}-${data?.salaryYear}.png`;

            link.href = dataUrl;

            link.click();

            dispatch(closePopup());
        } catch (error) {
            console.error("Failed to generate salary slip:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                padding: "24px",
                width: "100%",
                maxWidth: "500px",
            }}
        >
            {/* TITLE */}

            <div
                style={{
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Generate Salary Slip
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        color: "#6b7280",
                    }}
                >
                    Please click below to generate and download the salary slip.
                </p>
            </div>

            {/* 🔘 Buttons */}

            <div
                className="flex justify-start gap-3 pt-2"
            >
                {/* Cancel */}

                <SolidButton
                    type="button"
                    label="Cancel"
                    variant="secondary"
                    onClick={() => dispatch(closePopup())}
                />

                {/* Generate */}

                <SolidButton
                    type="button"
                    label="Generate Salary Slip"
                    loading={isSubmitting}
                    variant="primary"
                    onClick={handleGenerateSlip}
                />
            </div>

            {/* HIDDEN SALARY SLIP */}

            <div
                style={{
                    position: "fixed",
                    left: "-99999px",
                    top: 0,
                }}
            >
                <div
                    ref={slipRef}
                    id="salary-slip"
                    style={{
                        width: "850px",
                        background: "#ffffff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    {/* HEADER */}

                    <div
                        style={{
                            background: "#111827",
                            color: "#ffffff",
                            padding: "24px 32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                            }}
                        >
                            <img
                                src="/logo.jpeg"
                                alt="Company Logo"
                                style={{
                                    width: "80px",
                                    height: "55px",
                                    objectFit: "contain",
                                    background: "#ffffff",
                                    borderRadius: "10px",
                                    padding: "6px",
                                }}
                            />

                            <div>
                                <h1
                                    style={{
                                        margin: 0,
                                        fontSize: "30px",
                                        fontWeight: 700,
                                        color: "#ffffff",
                                    }}
                                >
                                    HM Electrical
                                </h1>

                                <p
                                    style={{
                                        margin: "4px 0 0",
                                        fontSize: "13px",
                                        opacity: 0.8,
                                    }}
                                >
                                    Employee Salary Slip
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    opacity: 0.7,
                                }}
                            >
                                Salary Month
                            </div>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: 700,
                                }}
                            >
                                {data?.salaryMonth} {data?.salaryYear}
                            </div>
                        </div>
                    </div>

                    {/* BODY */}

                    <div
                        style={{
                            padding: "32px",
                            background: "#ffffff",
                        }}
                    >
                        {/* EMPLOYEE INFO */}

                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "24px",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f9fafb",
                                    padding: "14px 18px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    borderBottom: "1px solid #e5e7eb",
                                }}
                            >
                                Employee Information
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px",
                                    padding: "20px",
                                }}
                            >
                                <Info
                                    label="Employee Name"
                                    value={labour?.name}
                                />

                                <Info
                                    label="Labour Code"
                                    value={labour?.labourCode}
                                />

                                <Info
                                    label="Role"
                                    value={labour?.role}
                                />

                                <Info
                                    label="Mobile Number"
                                    value={labour?.contactNumber}
                                />
                            </div>
                        </div>

                        {/* ATTENDANCE */}

                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "24px",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f9fafb",
                                    padding: "14px 18px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    borderBottom: "1px solid #e5e7eb",
                                }}
                            >
                                Attendance Details
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: "20px",
                                    padding: "20px",
                                }}
                            >
                                <Info
                                    label="Working Days"
                                    value={data?.workingDays}
                                />

                                <Info
                                    label="Present Days"
                                    value={data?.presentDays}
                                />

                                <Info
                                    label="Absent Days"
                                    value={data?.absent}
                                />
                            </div>
                        </div>

                        {/* SALARY DETAILS */}

                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f9fafb",
                                    padding: "14px 18px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    borderBottom: "1px solid #e5e7eb",
                                }}
                            >
                                Salary Details
                            </div>

                            <div
                                style={{
                                    padding: "20px",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                background: "#111827",
                                                color: "#ffffff",
                                            }}
                                        >
                                            <th style={tableHead}>
                                                Description
                                            </th>

                                            <th style={tableHead}>
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td style={tableCell}>
                                                Daily Wages
                                            </td>

                                            <td style={tableCell}>
                                                ₹ {formatAmount(labour?.dailyWages)}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={tableCell}>
                                                Overtime Amount
                                            </td>

                                            <td style={tableCell}>
                                                ₹ {formatAmount(data?.overtimeAmount)}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={tableCell}>
                                                Total Deduction
                                            </td>

                                            <td style={tableCell}>
                                                ₹ {formatAmount(data?.totalDeduction)}
                                            </td>
                                        </tr>

                                        <tr
                                            style={{
                                                background: "#f3f4f6",
                                                fontWeight: 700,
                                            }}
                                        >
                                            <td style={tableCell}>
                                                Net Salary
                                            </td>

                                            <td style={tableCell}>
                                                ₹ {formatAmount(data?.totalAmount)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FOOTER */}

                        <div
                            style={{
                                marginTop: "30px",
                                textAlign: "center",
                                color: "#6b7280",
                                fontSize: "12px",
                            }}
                        >
                            This is a computer generated salary slip.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Info = ({
    label,
    value,
}: {
    label: string;
    value: any;
}) => {
    return (
        <div>
            <div
                style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "6px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#111827",
                }}
            >
                {value || "-"}
            </div>
        </div>
    );
};

const tableHead: React.CSSProperties = {
    padding: "14px",
    textAlign: "left",
    fontSize: "14px",
};

const tableCell: React.CSSProperties = {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
};

export default GenerateSalarySlip;