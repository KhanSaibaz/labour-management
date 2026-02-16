┌─────────────────────────────┐
│        USERS                │
├─────────────────────────────┤
│ PK_id                       │
│ full_name                   │
│ username (UNIQUE)           │
│ email (UNIQUE)              │
│ mobile                      │
│ password                    │
│ user_type                   │
│ is_active                   │
│ last_login                  │
│ deleted_at                  │
│ created_at                  │
│ updated_at                  │
│ FK_created_by               │
└─────────────────────────────┘
         │
         │ 1:1
         ↓
┌─────────────────────────────┐         ┌─────────────────────────────┐
│      LB_USERS               │─────────│    WORK_TYPES (Master)      │
├─────────────────────────────┤   M:1   ├─────────────────────────────┤
│ PK_id                       │         │ PK_id                       │
│ FK_user_id (UNIQUE)         │         │ name (UNIQUE)               │
│ FK_work_type_id             │         │ description                 │
│ employee_code (UNIQUE)      │         │ is_active                   │
│ joining_date                │         │ display_order               │
│ date_of_birth               │         │ deleted_at                  │
│ gender                      │         │ created_at                  │
│ blood_group                 │         │ updated_at                  │
│ marital_status              │         │ FK_created_by               │
│ emergency_contact           │         └─────────────────────────────┘
│ permanent_address           │
│ current_address             │
│ aadhaar_number              │
│ pan_number                  │
│ bank_account_number         │
│ bank_ifsc_code              │
│ bank_name                   │
│ bank_branch                 │
│ upi_id                      │
│ daily_wage                  │
│ remarks                     │
│ is_active                   │
│ deleted_at                  │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
         │
         ├──────────────┬──────────────┬──────────────┬──────────────┐
         │ 1:M          │ 1:M          │ 1:M          │ 1:M          │ 1:M
         ↓              ↓              ↓              ↓              ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ LB_USER_DOCS     │ │LB_USER_ATTENDANCE│ │LB_USER_SALARY    │ │LB_USER_ADVANCES  │ │LB_USER_DEDUCTIONS│
├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ PK_id            │ │ PK_id            │ │ PK_id            │ │ PK_id            │ │ PK_id            │
│ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │
│ FK_doc_type_id   │ │ FK_site_id       │ │ salary_month     │ │ advance_date     │ │ deduction_type   │
│ document_number  │ │ attendance_date  │ │ salary_year      │ │ amount           │ │ deduction_month  │
│ file_name        │ │ status           │ │ present_days     │ │ reason           │ │ deduction_year   │
│ file_path        │ │ check_in_time    │ │ half_days        │ │ remarks          │ │ amount           │
│ file_size_kb     │ │ check_out_time   │ │ absent_days      │ │ repayment_status │ │ reason           │
│ mime_type        │ │ working_hours    │ │ working_days     │ │ start_month      │ │ remarks          │
│ upload_date      │ │ overtime_hours   │ │ daily_wage       │ │ start_year       │ │ FK_advance_id    │
│ expiry_date      │ │ location         │ │ basic_salary     │ │ monthly_deduction│ │ FK_approved_by   │
│ is_verified      │ │ remarks          │ │ overtime_amount  │ │ total_repaid     │ │ approved_at      │
│ FK_verified_by   │ │ FK_approved_by   │ │ allowances       │ │ balance_amount   │ │ deleted_at       │
│ verified_at      │ │ approved_at      │ │ gross_salary     │ │ FK_approved_by   │ │ created_at       │
│ remarks          │ │ deleted_at       │ │ total_deductions │ │ approved_at      │ │ FK_created_by    │
│ deleted_at       │ │ created_at       │ │ net_salary       │ │ deleted_at       │ └──────────────────┘
│ created_at       │ │ updated_at       │ │ file_name        │ │ created_at       │
│ FK_uploaded_by   │ │ FK_marked_by     │ │ file_path        │ │ FK_created_by    │
└──────────────────┘ └──────────────────┘ │ file_size_kb     │ └──────────────────┘
         │                    UNIQUE:      │ payment_date     │
         │                    (user,site,  │ payment_status   │
         │                    date)        │ payment_mode     │
         │                                 │ transaction_ref  │
         ↓                                 │ remarks          │
┌──────────────────┐                      │ deleted_at       │
│  DOCUMENT_TYPES  │                      │ created_at       │
│    (Master)      │                      │ updated_at       │
├──────────────────┤                      │ FK_generated_by  │
│ PK_id            │                      │ FK_approved_by   │
│ name (UNIQUE)    │                      └──────────────────┘
│ description      │                      UNIQUE: (user,month,year)
│ allowed_ext      │
│ max_file_size_mb │
│ is_mandatory     │
│ is_active        │
│ display_order    │
│ created_at       │
└──────────────────┘


┌─────────────────────────────┐
│         ROLES               │
├─────────────────────────────┤
│ PK_id                       │
│ name (UNIQUE)               │
│ description                 │
│ permissions (JSON)          │
│ is_active                   │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
         │
         │ M:M
         ↓
┌─────────────────────────────┐
│       USER_ROLES            │
│      (Junction)             │
├─────────────────────────────┤
│ PK_id                       │
│ FK_user_id                  │
│ FK_role_id                  │
│ assigned_at                 │
│ FK_assigned_by              │
└─────────────────────────────┘
         │
         │ M:1
         ↓
      (USERS)


┌─────────────────────────────┐
│          SITES              │
│       (Projects)            │
├─────────────────────────────┤
│ PK_id                       │
│ site_code (UNIQUE)          │
│ site_name                   │
│ client_name                 │
│ client_contact              │
│ site_address                │
│ site_type                   │
│ start_date                  │
│ expected_end_date           │
│ actual_end_date             │
│ project_value               │
│ status                      │
│ FK_site_incharge_id         │
│ remarks                     │
│ is_active                   │
│ deleted_at                  │
│ created_at                  │
│ updated_at                  │
│ FK_created_by               │
└─────────────────────────────┘
         │
         │ 1:M
         ↓
┌─────────────────────────────┐
│  SITE_LABOUR_ASSIGNMENTS    │
├─────────────────────────────┤
│ PK_id                       │
│ FK_site_id                  │
│ FK_lb_user_id               │
│ assignment_date             │
│ end_date                    │
│ daily_wage_override         │
│ role_at_site                │
│ is_active                   │
│ remarks                     │
│ created_at                  │
│ FK_created_by               │
└─────────────────────────────┘


┌─────────────────────────────┐
│    INVENTORY_CATEGORIES     │
├─────────────────────────────┤
│ PK_id                       │
│ name (UNIQUE)               │
│ description                 │
│ FK_parent_category_id       │
│ is_active                   │
│ display_order               │
│ deleted_at                  │
│ created_at                  │
│ updated_at                  │
│ FK_created_by               │
└─────────────────────────────┘
         │
         │ 1:M
         ↓
┌─────────────────────────────┐
│     INVENTORY_ITEMS         │
├─────────────────────────────┤
│ PK_id                       │
│ FK_category_id              │
│ item_code (UNIQUE)          │
│ item_name                   │
│ description                 │
│ unit_of_measurement         │
│ current_quantity            │
│ minimum_quantity            │
│ maximum_quantity            │
│ unit_price                  │
│ location                    │
│ supplier_name               │
│ supplier_contact            │
│ is_active                   │
│ deleted_at                  │
│ created_at                  │
│ updated_at                  │
│ FK_created_by               │
└─────────────────────────────┘
         │
         ├──────────────┬──────────────┐
         │ 1:M          │ 1:M          │
         ↓              ↓              │
┌──────────────────┐ ┌──────────────────┐
│INVENTORY_MOVEMENTS│ │ INVENTORY_ISSUES │
├──────────────────┤ ├──────────────────┤
│ PK_id            │ │ PK_id            │
│ FK_item_id       │ │ FK_item_id       │
│ movement_type    │ │ issued_to_type   │
│ quantity         │ │ FK_site_id       │
│ previous_qty     │ │ FK_lb_user_id    │
│ new_quantity     │ │ issue_date       │
│ movement_date    │ │ quantity_issued  │
│ reference_type   │ │ quantity_returned│
│ reference_id     │ │ return_date      │
│ unit_price       │ │ unit_price       │
│ total_value      │ │ total_value      │
│ supplier_name    │ │ issue_status     │
│ invoice_number   │ │ purpose          │
│ remarks          │ │ remarks          │
│ FK_approved_by   │ │ FK_issued_by     │
│ approved_at      │ │ FK_approved_by   │
│ deleted_at       │ │ deleted_at       │
│ created_at       │ │ created_at       │
│ FK_created_by    │ └──────────────────┘
└──────────────────┘


┌─────────────────────────────┐
│      SYSTEM_BACKUPS         │
├─────────────────────────────┤
│ PK_id                       │
│ backup_date                 │
│ backup_type                 │
│ file_name                   │
│ file_path                   │
│ file_size_mb                │
│ backup_status               │
│ error_message               │
│ retention_days              │
│ created_at                  │
└─────────────────────────────┘


┌─────────────────────────────┐
│        AUDIT_LOGS           │
├─────────────────────────────┤
│ PK_id                       │
│ entity_type                 │
│ entity_id                   │
│ action                      │
│ old_values (JSON)           │
│ new_values (JSON)           │
│ changed_fields (ARRAY)      │
│ ip_address                  │
│ user_agent                  │
│ FK_performed_by             │
│ performed_at                │
└─────────────────────────────┘








        ↓              ↓              ↓              ↓              ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ LB_USER_DOCS     │ │LB_USER_ATTENDANCE│ │LB_USER_SALARY    │ │LB_USER_ADVANCES  │ │LB_USER_DEDUCTIONS│
├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ PK_id            │ │ PK_id            │ │ PK_id            │ │ PK_id            │ │ PK_id            │
│ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │ │ FK_lb_user_id    │
│ FK_doc_type_id   │ │ FK_site_id       │ │ salary_month     │ │ advance_date     │ │ deduction_type   │
│ document_number  │ │ attendance_date  │ │ salary_year      │ │ amount           │ │ deduction_month  │
│ file_name        │ │ status           │ │ present_days     │ │ reason           │ │ deduction_year   │
│ file_path        │ │ check_in_time    │ │ half_days        │ │ remarks          │ │ amount           │
│ file_size_kb     │ │ check_out_time   │ │ absent_days      │ │ repayment_status │ │ reason           │
│ mime_type        │ │ working_hours    │ │ working_days     │ │ start_month      │ │ remarks          │
│ upload_date      │ │ overtime_hours   │ │ daily_wage       │ │ start_year       │ │ FK_advance_id    │
│ expiry_date      │ │ location         │ │ basic_salary     │ │ monthly_deduction│ │ FK_approved_by   │
│ is_verified      │ │ remarks          │ │ overtime_amount  │ │ total_repaid     │ │ approved_at      │
│ FK_verified_by   │ │ FK_approved_by   │ │ allowances       │ │ balance_amount   │ │ deleted_at       │
│ verified_at      │ │ approved_at      │ │ gross_salary     │ │ FK_approved_by   │ │ created_at       │
│ remarks          │ │ deleted_at       │ │ total_deductions │ │ approved_at      │ │ FK_created_by    │
│ deleted_at       │ │ created_at       │ │ net_salary       │ │ deleted_at       │ └──────────────────┘
│ created_at       │ │ updated_at       │ │ file_name        │ │ created_at       │
│ FK_uploaded_by   │ │ FK_marked_by     │ │ file_path        │ │ FK_created_by    │
└──────────────────┘ └──────────────────┘ │ file_size_kb     │ └──────────────────┘