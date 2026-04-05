import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useGenerateSalarySlipsMutation } from "../../../../redux/governmentSalarySlipApi";
import { showToast } from "@solidxai/core-ui";

export const GenerateGovernmentSalarySlip = () => {

    const toast = useRef<Toast>(null);
    const [generateSlips, { isLoading }] = useGenerateSalarySlipsMutation();

    const handleGenerate = async () => {
        try {
            const res = await generateSlips({
                month: "March",
                year: 2025
            }).unwrap();

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
        <div className="p-5">
            <Toast ref={toast} />
            <button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Salary Slip"}
            </button>
        </div>
    );
};