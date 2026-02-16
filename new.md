┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: DAILY ATTENDANCE                     │
├─────────────────────────────────────────────────────────────────┤
│  Supervisor marks attendance daily for each labour              │
│  ├── PRESENT (8 hours) = 1 day wage                            │
│  ├── HALF_DAY (4 hours) = 0.5 day wage                         │
│  ├── ABSENT = 0 wage                                            │
│  └── OVERTIME = Extra hours × overtime rate                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 STEP 2: MONTH-END CALCULATION                   │
├─────────────────────────────────────────────────────────────────┤
│  System calculates:                                             │
│  ├── Total Present Days = 22                                    │
│  ├── Total Half Days = 2                                        │
│  ├── Total Absent = 6                                           │
│  └── Working Days = 22 + (2 × 0.5) = 23 days                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 3: SALARY CALCULATION                     │
├─────────────────────────────────────────────────────────────────┤
│  Basic Salary = Working Days × Daily Wage                       │
│  Example: 23 days × ₹800 = ₹18,400                             │
│                                                                 │
│  + Overtime Amount (if any)                                     │
│  + Allowances (if any)                                          │
│  = GROSS SALARY                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│               STEP 4: DEDUCTIONS CALCULATION                    │
├─────────────────────────────────────────────────────────────────┤
│  A) ADVANCE DEDUCTIONS:                                         │
│     - Check pending advances for this labour                    │
│     - Deduct monthly installment                                │
│                                                                 │
│  B) OTHER DEDUCTIONS:                                           │
│     - Penalties                                                 │
│     - Damage costs                                              │
│     - Any other deductions for this month                       │
│                                                                 │
│  Total Deductions = Advance Recovery + Other Deductions         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 5: NET SALARY (FINAL)                     │
├─────────────────────────────────────────────────────────────────┤
│  NET SALARY = GROSS SALARY - TOTAL DEDUCTIONS                   │
│                                                                 │
│  Example:                                                       │
│  ₹18,400 (Gross) - ₹3,000 (Deductions) = ₹15,400 (Net)        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                STEP 6: SALARY SLIP GENERATION                   │
├─────────────────────────────────────────────────────────────────┤
│  Generate PDF with all details                                  │
│  Save to database + file storage                                │
│  Update advance balance                                         │
│  Mark as "Pending Payment"                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 7: PAYMENT                              │
├─────────────────────────────────────────────────────────────────┤
│  Admin/Accountant makes payment                                 │
│  Updates payment status to "PAID"                               │
│  Records payment date, mode, transaction reference              │
└─────────────────────────────────────────────────────────────────┘