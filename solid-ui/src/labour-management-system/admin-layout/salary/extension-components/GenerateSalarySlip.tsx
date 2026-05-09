import { closePopup, logger } from "@solidxai/core-ui";
import { useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
// import { useMoveToCheckerMutation, useValidateApplicationMutation } from "../../../redux/applicationApi";
import { Toast } from "primereact/toast";

type Step = "initial" | "validating" | "errors" | "passed" | "sending" | "done";

interface ValidationResponse {
  success: boolean;
  errors: string[];
}

const GenerateSalarySlip = (e: any): React.JSX.Element => {
  const dispatch = useDispatch();

  // const [validateApplication] = useValidateApplicationMutation();
  // const [moveToChecker] = useMoveToCheckerMutation();

  const [step, setStep] = useState<Step>("initial");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toast = useRef<Toast>(null);

  // ── STEP 1: Validate ────────────────────────────────────────────────────────




  // ── Render ──────────────────────────────────────────────────────────────────
  const renderBody = () => {
    // ── Spinner (validating / sending) ───────────────────────────
    if (step === "validating" || step === "sending") {
      return (
        <div className="flex flex-column align-items-center justify-content-center py-6 gap-3">
          <ProgressSpinner style={{ width: 50, height: 50 }} />
          <p className="text-600 m-0">
            {step === "validating" ? "Validating application..." : "Sending to Checker..."}
          </p>
        </div>
      );
    }

    // ── Initial ──────────────────────────────────────────────────
    if (step === "initial") {
      return (
        <div className="flex flex-column gap-4">
          <div className="text-600">
            <p className="mb-2 font-medium">You are about to send this application to Checker.</p>
            <p className="m-0">
              The system will first validate all application details.
              If any issues are found, you will need to fix them before proceeding.
            </p>
          </div>

          <div className="p-3 border-1 border-round bg-yellow-50 border-yellow-300">
            <div className="flex align-items-center gap-2 mb-2">
              <i className="pi pi-exclamation-triangle text-yellow-600" />
              <b>Confirmation Required</b>
            </div>
            <p className="m-0">Are you sure you want to validate & send this application to Checker?</p>
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined size="small" onClick={() => dispatch(closePopup())} />
            <Button label="Validate" icon="pi pi-check" severity="success" size="small" />
          </div>
        </div>
      );
    }

    // ── Validation Errors ────────────────────────────────────────
    if (step === "errors") {
      return (
        <div className="flex flex-column gap-3">
          <div className="w-full p-3 border-round-lg bg-red-50 border-1 border-red-200">
            <div className="flex align-items-center gap-2 mb-3">
              <i className="pi pi-exclamation-triangle text-red-500 text-lg" />
              <span className="font-semibold text-red-700">Validation Errors</span>
            </div>
            <div className="flex flex-column gap-2">
              {validationErrors.map((error, i) => (
                <Message
                  key={i}
                  severity="error"
                  content={<span style={{ fontSize: 14, fontWeight: 600 }}>- {error}</span>}
                />
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-600">
            <i className="pi pi-info-circle mr-2" />
            Please resolve the errors above before sending to Checker.
          </div>

          {/* ✅ Buttons so user isn't stuck */}
          {/* <div className="flex justify-content-end gap-2 mt-2">
            <Button label="Close" icon="pi pi-times" severity="secondary" outlined onClick={() => dispatch(closePopup())} />
            <Button label="Re-validate" icon="pi pi-refresh" severity="warning" onClick={handleValidate} />
          </div> */}
        </div>
      );
    }

    // ── Validation Passed ────────────────────────────────────────
    if (step === "passed") {
      return (
        <div className="flex flex-column align-items-center gap-3 p-2">
          <Message
            severity="success"
            text="Validation successful. You can now send the application to the Checker."
            className="w-full"
          />
          <div className="flex justify-content-center gap-3 pt-2">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined size="small" onClick={() => dispatch(closePopup())} />
            <Button label="Send to Checker" icon="pi pi-send" severity="success" size="small"  />
          </div>
        </div>
      );
    }

    // ── Done ─────────────────────────────────────────────────────
    if (step === "done") {
      return (
        <div className="flex flex-column align-items-center justify-content-center py-5 gap-3">
          <i className="pi pi-check-circle text-green-500" style={{ fontSize: "3rem" }} />
          <p className="text-lg font-semibold text-green-700 m-0">Application sent to Checker!</p>
          <p className="text-sm text-600 m-0">Refreshing page...</p>
        </div>
      );
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      {/* Header */}
      <div className="px-4 py-2 secondary-border-bottom flex align-items-center justify-content-between">
        <h5 className="m-0">Validate & Send to Checker</h5>
        <Button
          icon="pi pi-times"
          onClick={() => dispatch(closePopup())}
          size="small"
          severity="secondary"
          text
          style={{ height: 30, width: 30 }}
        />
      </div>

      <div className="p-4">{renderBody()}</div>
    </div>
  );
};

export default GenerateSalarySlip;