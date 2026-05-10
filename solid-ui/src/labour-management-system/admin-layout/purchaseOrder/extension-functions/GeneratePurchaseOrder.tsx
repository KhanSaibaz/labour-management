import React, { useState } from 'react';
import { closePopup, SolidButton, solidGet, } from '@solidxai/core-ui';
import { useDispatch } from 'react-redux';

const GeneratePurchaseOrder = (props: any): React.JSX.Element => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const formData = props?.formData
    const id = formData.id;
    const poNo = formData?.poNo;

    const handleGeneratePurchaseOrder = async () => {

        try {

            setIsLoading(true);

            const response = await solidGet(
                `/purchase-order/generate-purchase-order?poNo=${poNo}&id=${id}`,
                {
                    responseType: 'blob',
                }
            );

            // ================= CREATE DOWNLOAD =================

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement('a');

            link.href = url;

            link.setAttribute(
                'download',
                `${poNo}.xlsx`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
            dispatch(closePopup())


        } catch (error: any) {

            console.error(error);

        } finally {

            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px", width: "100%", }} >

            {/* HEADER */}

            <div style={{ marginBottom: "20px" }}>

                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Generate Purchase Order
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        color: "#6b7280",
                    }}
                >
                    Please click below to generate
                    and download the purchase order.
                </p>

            </div>

            {/* ACTIONS */}

            <div className="flex justify-start gap-3 pt-2">

                <SolidButton
                    type="button"
                    label="Cancel"
                    variant="secondary"
                    onClick={() =>
                        dispatch(closePopup())
                    }
                />

                <SolidButton
                    type="button"
                    label="Generate Purchase Order"
                    loading={isLoading}
                    variant="primary"
                    onClick={
                        handleGeneratePurchaseOrder
                    }
                />

            </div>

        </div>
    );
};

export default GeneratePurchaseOrder;