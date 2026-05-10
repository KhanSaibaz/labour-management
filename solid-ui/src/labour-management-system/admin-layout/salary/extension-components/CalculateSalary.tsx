import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { closePopup } from '@solidxai/core-ui/dist/redux/features/popupSlice';
import { SolidAutocomplete, SolidButton, SolidInput, solidPost } from '@solidxai/core-ui';
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

export const CalculateSalary = ({ context }: any) => {
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    // 🔍 Month search
    const searchMonth = (e: any) => {
        const query = e.query.toLowerCase();
        const filtered = months.filter((m) =>
            m.label.toLowerCase().includes(query)
        );
        setSuggestions(filtered);
    };

    const handleCalculateSalary = async (values: any) => {
        try {
            const payload = {
                month: values.month.value,
                year: Number(values.year),
            };

            await solidPost(`/salary/calculate-salary`, payload);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Salary calculated successfully',
                life: 3000,
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error: any) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.message || 'Failed to calculate salary',
                life: 3000,
            });
        }
    };
    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 px-3 py-5" style={{height:"360px"}}>

            <Toast ref={toast} />

            <Formik
                initialValues={{
                    month: null,
                    year: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    await handleCalculateSalary(values);
                    setSubmitting(false);
                }}
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                    <Form className="flex flex-column gap-4">

                        {/* 🔥 Title */}
                        <h2 className="text-center text-xl m-0 font-semibold text-gray-800">
                            Calculate Salary
                        </h2>

                        {/* 🔽 Month */}
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
                                onChange={(e: any) => setFieldValue('month', e.value)}
                            />

                            {touched.month && errors.month && (
                                <span className="text-red-500 text-xs">
                                    {errors.month as any}
                                </span>
                            )}
                        </div>

                        {/* 🔢 Year */}
                        <div className="flex flex-column gap-2 w-full">
                            <label className="text-sm font-medium text-gray-700">
                                Enter Year
                            </label>

                            <SolidInput
                                type="text"
                                value={values.year}
                                onChange={(e: any) => setFieldValue('year', e.target.value)}
                                placeholder="Enter year (e.g. 2026)"
                                className="w-full"
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

                            {/* Calculate */}
                            <SolidButton
                                type="submit"
                                label="Calculate"
                                loading={isSubmitting}
                                variant="primary"
                            />

                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
