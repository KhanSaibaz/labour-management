import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { closePopup, SolidAutocomplete, SolidButton, solidPost } from '@solidxai/core-ui';
import html2pdf from "html2pdf.js";
import "./SalarySlip.css";
import numberToWords from "number-to-words";

const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
];

const validationSchema = Yup.object({
    month: Yup.object().required('Month is required'),
    year: Yup.string()
        .required('Year is required')
        .matches(/^\d{4}$/, 'Enter valid 4 digit year'),
});



export const GenerateGovernmentSalarySlip = () => {
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);

    const currentDate = new Date();

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [slipData, setSlipData] = useState<any[]>([]);
    const [companyData, setCompanyData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const searchMonth = (e: any) => {
        const query = e.query.toLowerCase();

        const filtered = months.filter((m) =>
            m.label.toLowerCase().includes(query)
        );

        setSuggestions(filtered);
    };

    const downloadPDF = async (): Promise<void> => {
        try {
            setLoading(true);

            const element = document.getElementById("salary-slip-pdf");

            if (!element) {
                console.error("PDF element not found");
                return;
            }

            const firstEmployee = slipData[0];

            const month = firstEmployee?.salaryMonth || "month";
            const year = firstEmployee?.salaryYear || "year";

            const fileName = `salary-slip-${month}${year}.pdf`;

            const options = {
                margin: 0,
                filename: fileName,
                image: {
                    type: "jpeg" as const,
                    quality: 0.7,
                },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait" as const,
                },
                pagebreak: {
                    mode: ["css", "legacy"],
                },
            };

            await html2pdf().set(options).from(element).save();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSalarySlip = async (values: any) => {
        try {
            const payload = {
                month: values.month.value,
                year: Number(values.year),
            };

            const response = await solidPost(
                `/government-salary-slip/generate-slips`,
                payload
            );

            const compnayDetails = [{
                companyName: response?.data?.data?.companyName,
                companyAddress: response?.data?.data?.companyAddress,
                SalaryMonth: response?.data?.data?.title
            }]
            setCompanyData(compnayDetails)

            setSlipData(response?.data?.data?.data)

            downloadPDF()


        } catch (error: any) {
            console.error(error);

            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail:
                    error?.message ||
                    'Failed to generate government salary slip',
                life: 3000,
            });
        }
    };



    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 px-3 py-5" style={{ height: "360px" }}>

            <Toast ref={toast} />

            <Formik
                initialValues={{
                    month: {
                        label: currentDate.toLocaleString('default', {
                            month: 'long',
                        }),
                        value: currentDate.toLocaleString('default', {
                            month: 'long',
                        }),
                    },
                    year: currentDate.getFullYear().toString(),
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    await handleGenerateSalarySlip(values);
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    setFieldValue,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <Form className="flex flex-column gap-4">

                        <h2 className="text-center text-xl m-0 font-semibold text-gray-800">
                            Generate Government Salary Slip
                        </h2>

                        <div className="flex flex-column gap-2 w-full">
                            <label className="text-sm font-medium text-gray-700">
                                Select Month
                            </label>

                            <SolidAutocomplete
                                value={values.month}
                                suggestions={suggestions}
                                completeMethod={searchMonth}
                                field="label"
                                dropdown
                                className="w-full"
                                onChange={(e: any) =>
                                    setFieldValue('month', e.value)
                                }
                            />

                            {touched.month && errors.month && (
                                <span className="text-red-500 text-xs">
                                    {errors.month as any}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-column gap-2 w-full">
                            <label className="text-sm font-medium text-gray-700">
                                Enter Year
                            </label>

                            <input
                                type="text"
                                value={values.year}
                                onChange={(e: any) =>
                                    setFieldValue('year', e.target.value)
                                }
                                placeholder="Enter year (e.g. 2026)"
                                className="p-inputtext p-component w-full"
                            />

                            {touched.year && errors.year && (
                                <span className="text-red-500 text-xs">
                                    {errors.year}
                                </span>
                            )}
                        </div>

                        {/* 🔘 Buttons */}
                        <div className="flex justify-start gap-3 pt-2">

                            {/* Cancel */}
                            <SolidButton
                                type="button"
                                label="Cancel"
                                variant="secondary"
                                onClick={() => dispatch(closePopup())}
                            />

                            {/* Generate */}
                            <SolidButton
                                type="submit"
                                label="Generate"
                                loading={isSubmitting}
                                variant="primary"
                            />

                        </div>

                    </Form>
                )}
            </Formik>

            <div className="salary-slip-wrapper">

                <div id="salary-slip-pdf">
                    {slipData.map((emp: any) => (
                        <div className="salary-slip" key={emp.id}>
                            <div className="company-header">
                                <h1>{companyData[0]?.companyName || "HM ELECTRICAL"} </h1>

                                <p>
                                    {companyData[0]?.companyAddress ||   "GRD Floor, A-85 Sion Naik Nagar, LBS Marg, Sion West,Mumbai, Maharashtra - 400022"} 
                                </p>

                                <h2>
                                    {companyData[0]?.title ||  `Salary Slip for the Month of ${emp.salaryMonth} - ${emp.salaryYear}`} 
                                </h2>
                            </div>

                            <table className="employee-table">
                                <tbody>
                                    <tr>
                                        <td>EMPLOYEE NAME</td>
                                        <td>{emp.name}</td>
                                    </tr>

                                    <tr>
                                        <td>DEPARTMENT</td>
                                        <td>{emp.department}</td>
                                    </tr>

                                    <tr>
                                        <td>LOCATION</td>
                                        <td>{emp.location}</td>
                                    </tr>

                                    <tr>
                                        <td>UAN NO</td>
                                        <td>{emp.labourUan}</td>
                                    </tr>

                                    <tr>
                                        <td>CATEGORY</td>
                                        <td>{emp.category}</td>
                                    </tr>

                                    <tr>
                                        <td>DAYS WORKED</td>
                                        <td>{emp.daysWorked}</td>
                                    </tr>

                                    <tr>
                                        <td>DAILY RATE</td>
                                        <td>{emp.dailyRate}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="salary-table">
                                <thead>
                                    <tr>
                                        <th colSpan={2}>EARNINGS</th>
                                        <th colSpan={2}>DEDUCTIONS</th>
                                    </tr>

                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Basic Wages</td>
                                        <td>{emp.basicWages}</td>

                                        <td>PF ({emp.pf}%)</td>
                                        <td>{emp.pfAmount}</td>
                                    </tr>

                                    <tr>
                                        <td>HRA ({emp.hra}%)</td>
                                        <td>{emp.hraAmount}</td>

                                        <td>Professional Tax</td>
                                        <td>{emp.professionalTax}</td>
                                    </tr>

                                    <tr>
                                        <td>Other Allowance</td>
                                        <td>{emp.otherAllowance}</td>

                                        <td>ESIC</td>
                                        <td>{emp.esic}</td>
                                    </tr>

                                    <tr>
                                        <td>Incentive</td>
                                        <td>{emp.incentive}</td>

                                        <td>Other Deduction</td>
                                        <td>{emp.otherDeduction}</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <strong>GROSS EARNINGS</strong>
                                        </td>

                                        <td>
                                            <strong>{emp.grossEarning}</strong>
                                        </td>

                                        <td>
                                            <strong>TOTAL DEDUCTION</strong>
                                        </td>

                                        <td>
                                            <strong>{emp.totalDeduction}</strong>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <strong>NET PAY</strong>
                                        </td>

                                        <td>
                                            <strong>{emp.netPay}</strong>
                                        </td>

                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="words">
                                <strong>In Words:</strong>{" "}
                                {numberToWords.toWords(Math.round(emp.netPay)).replace(
                                    /\b\w/g,
                                    (char: string) => char.toUpperCase()
                                )}{" "}
                                Rupees Only
                            </div>

                            <div className="note">
                                NOTE: THIS IS COMPUTER GENERATED SLIP. SIGNATURE NOT REQUIRED.
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};