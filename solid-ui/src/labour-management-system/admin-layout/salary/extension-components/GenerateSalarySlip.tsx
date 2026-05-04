import {
  SolidButton,
  closePopup,
  solidPost
} from "@solidxai/core-ui";

import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";

const GenerateSalarySlip = ({ context }: any) => {
  const dispatch = useDispatch();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const rowData = context?.rowData;

  // ✅ Validate rowData on mount
  useEffect(() => {
    if (!rowData?.id || !rowData?.name) {
      setError("Invalid employee data. Please select a valid employee.");
      setIsValid(false);
      toast.current?.show({
        severity: "warn",
        summary: "Invalid Data",
        detail: "Employee data is missing",
        life: 3000,
      });
    }
  }, [rowData]);

  const handleCalculate = async () => {
    try {
      // 🔍 Clear previous errors
      setError(null);

      // ✅ Validate before submission
      if (!rowData?.id) {
        throw new Error("Employee ID is required");
      }

      setLoading(true);

      // 🔥 Payload from selected row
      const payload = {
        employeeId: rowData.id,
        employeeName: rowData.name || "Unknown",
      };

      // 📡 API call with better error handling
      const response = await solidPost(
        "/salary/generate-salary-slip",
        payload
      );

      // ✅ Check if response indicates success
      // if (response?.statusCode === 200 || response?.success === true) {
      //   toast.current?.show({
      //     severity: "success",
      //     summary: "Success",
      //     detail: response?.message || "Salary slip generated successfully",
      //     life: 3000,
      //   });

      //   // ✅ Close popup after brief delay (no hard reload)
      //   setTimeout(() => {
      //     dispatch(closePopup());
      //   }, 1500);
      // } else {
      //   // Handle non-standard success response
      //   const errorMsg = response?.message || response?.error || "Unknown error occurred";
      //   throw new Error(errorMsg);
      // }

    } catch (error: any) {
      console.error("[GenerateSalarySlip] Error:", error);

      // 🔴 Extract error message
      let errorDetail = "Failed to generate salary slip";

      if (error?.response?.data?.message) {
        errorDetail = error.response.data.message;
      } else if (error?.message) {
        errorDetail = error.message;
      } else if (typeof error === "string") {
        errorDetail = error;
      }

      setError(errorDetail);

      toast.current?.show({
        severity: "error",
        summary: "Generation Failed",
        detail: errorDetail,
        life: 4000,
      });

    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle cancel with cleanup
  const handleCancel = () => {
    setError(null);
    dispatch(closePopup());
  };

  return (
    <div className="p-4 min-h-64 flex flex-col justify-between">
      <Toast ref={toast} />

      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Generate Salary Slip
        </h2>

        {/* Employee Info */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Employee Details</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                Name: <span className="text-gray-700">{rowData?.name || "N/A"}</span>
              </p>
              <p className="text-sm font-medium">
                ID: <span className="text-gray-700">{rowData?.id || "N/A"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              <strong>⚠️ Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <SolidButton
          type="button"
          label="Cancel"
          variant="secondary"
          onClick={handleCancel}
          disabled={loading}
        />

        <SolidButton
          type="button"
          label={loading ? "Generating..." : "Generate"}
          variant="primary"
          loading={loading}
          disabled={!isValid || loading}
          onClick={handleCalculate}
        />
      </div>
    </div>
  );
};

export default GenerateSalarySlip;