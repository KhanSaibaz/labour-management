import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { useGenerateSalarySlipsMutation } from "../../../../redux/governmentSalarySlipApi";
import { closePopup, showToast } from "@solidxai/core-ui";

export const GenerateGovernmentSalarySlip = () => {
    const toast = useRef<Toast>(null);
    const dispatch = useDispatch();
    const currentDate = new Date();
    const [month, setMonth] = useState<string | null>(
        currentDate.toLocaleString("default", { month: "long" })
    );
    const [year, setYear] = useState<number | null>(
        currentDate.getFullYear()
    );
    const [generateSlips, { isLoading }] = useGenerateSalarySlipsMutation();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].map((m) => ({ label: m, value: m }));

    const years = Array.from({ length: 10 }, (_, i) => {
        const y = currentDate.getFullYear() - i;
        return { label: y.toString(), value: y };
    });


    const handleGenerate = async () => {
        if (!month || !year) {
            showToast(
                toast,
                "error",
                "Validation Error",
                "Please select month and year"
            );
            return;
        }

        try {
            const res = await generateSlips({ month, year }).unwrap();
            showToast(toast, "success", "Success", res?.message);

        } catch (err: any) {
            showToast(
                toast,
                "error",
                "Error",
                err?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <h3 className="mb-3">Generate Salary Slip</h3>

            {/* Month */}
            <div className="mb-3">
                <label className="block mb-2">Select Month</label>
                <Dropdown
                    value={month}
                    options={months}
                    onChange={(e) => setMonth(e.value)}
                    placeholder="Select Month"
                    className="w-full"
                />
            </div>

            {/* Year */}
            <div className="mb-3">
                <label className="block mb-2">Select Year</label>
                <Dropdown
                    value={year}
                    options={years}
                    onChange={(e) => setYear(e.value)}
                    placeholder="Select Year"
                    className="w-full"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Close"
                    icon="pi pi-times"
                    outlined
                    severity="secondary"
                    onClick={() => dispatch(closePopup())}
                />

                <Button
                    label="Generate"
                    onClick={handleGenerate}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};