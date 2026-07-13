# Shree Shree Group — Microfinance Management System

Enterprise-grade daily-collection microfinance management application with clean architecture, database independence, and mobile-first responsive design.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma (SQLite / PostgreSQL / MySQL / SQL Server) |
| Auth | JWT, bcrypt, Role-Based Access Control |
| Frontend | React 19, TypeScript, Vite |
| UI | Custom CSS (Material-inspired, dark/light mode) |
| Icons | Lucide React |
| APIs | RESTful, Zod validation, Winston logging |

---

## Quick Start

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

**Login:** `http://localhost:5173` → `admin@shreeshree.com` / `Admin@123`

No external database needed — SQLite is pre-configured. To switch databases, change `DATABASE_URL` in `backend/.env` and run `npx prisma db push`.

---

## Feature List

### Authentication & Security
- JWT token-based authentication
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed attempts
- Rate limiting on auth endpoints (10 req/15min)
- Password reset by admin
- CSRF protection via Helmet

### User Management
- 5 roles: SUPER_ADMIN, ADMIN, MANAGER, STAFF, VIEWER
- Create / Edit / Delete users
- Activate / Deactivate users (inactive = cannot login)
- Lock / Unlock accounts
- Reset user passwords
- Assign staff to one or more areas

### Role-Based Access Control (RBAC)
Every API endpoint and frontend page checks user role:

| Role | Access |
|------|--------|
| SUPER_ADMIN | Full system access, settings, permanent delete |
| ADMIN | Operations except system settings |
| MANAGER | Approve loans, monitor staff |
| STAFF | Assigned customers & collections only |
| VIEWER | Read-only reports |

### Area-Based Access
- Create areas (Area 1, Area 2, etc.)
- Assign staff to areas
- Staff only see customers/collections in their assigned areas
- Area-wise reporting

### Customer Management
Complete customer profile with:

| Field | Required |
|-------|----------|
| Customer ID | Auto-generated (SSG-2026-XXXX) |
| Photo | Optional |
| Name | Yes |
| Father's Name | Yes |
| Mobile | Yes |
| Alternate Mobile | No |
| Aadhaar Number | Yes (unique) |
| PAN | No |
| Address | Yes |
| Village | Yes |
| District | Yes |
| State | Yes |
| PIN Code | Yes |
| Occupation | Yes |
| Monthly Income | No |
| Guarantor Details | No |
| Aadhaar Copy / Documents | Optional (future) |

**Statuses:** Pending → Active → Closed / Blacklisted

**Search:** By name, mobile, Aadhaar, or customer ID.

### Loan Management

#### Loan Application Workflow
```
Staff submits loan → PENDING_APPROVAL
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          APPROVED     REJECTED    RETURNED
              ↓            FOR CORRECTION
            ACTIVE
```

- Auto-generated loan number: `LN-2026-XXXXXX`
- Maximum loan: ₹50,000 (configurable)
- Pre-defined amounts: ₹5K / ₹10K / ₹12.5K / ₹15K / ₹20K / ₹25K / ₹30K / ₹33K / ₹40K / ₹50K

#### Auto Calculation Rules
| Item | Formula | Example (₹10,000) |
|------|---------|-------------------|
| File Charge | 3% of amount | ₹300 |
| Disbursed Amount | Amount − File Charge | ₹9,700 |
| Daily Collection | 1.2% of amount per day | ₹120/day |
| Total Recovery | Amount × 120% | ₹12,000 |
| Tenure | 100 days | 100 days |

#### Loan Renewal
- If not fully paid in 100 days → 20% renewal charge on remaining balance
- Auto-creates a new renewal loan for 100 more days
- Full history maintained with parent-child loan links

### Daily Collection Module
- Staff sees only assigned customers
- Each customer shows: today's amount, pending, days remaining, total paid, outstanding
- Record collection with auto-receipt generation
- Real-time updates visible to admin

### Receipt System
- Auto-generated receipt number: `RCP-XXXXXX`
- Contains: company name, loan number, customer name, amount, date/time, collector name, remaining balance
- QR Code slot ready for future

### Dashboard
8 stat cards with real-time data:

| Metric | Description |
|--------|-------------|
| Today's Collection | Sum of all collections today |
| Monthly Collection | Current month total |
| Active Loans | Count of ACTIVE loans |
| Pending Approvals | Loans awaiting approval |
| Overdue Loans | Past 100-day tenure |
| Total Customers | Active customers |
| Total Profit | Recovered − Disbursed + Renewal charges |
| Total Outstanding | Sum of all outstanding balances |

### Reports (6 types)
- **Daily Collection** — summary by date
- **Monthly Collection** — summary by month/year
- **Outstanding Report** — all active loans with balances
- **Defaulter Report** — loans overdue beyond tenure
- **Profit Report** — P&L for a date range
- **Renewal Report** — all renewed loans with history

### Global Search
Single search box across: customers, loans, collections, areas, users.

### System Settings (editable by SUPER_ADMIN)

| Setting | Default |
|---------|---------|
| Company Name | Shree Shree Group |
| File Charge % | 3% |
| Renewal Charge % | 20% |
| Maximum Loan | ₹50,000 |
| Minimum Loan | ₹5,000 |
| Loan Tenure | 100 days |
| Interest Rate | 20% |
| Currency | INR |
| Language | en |

### Audit Trail
Every action is logged: user, date/time, old value, new value, IP address. Nothing disappears permanently.

### Soft Delete
- Delete = move to trash (isDeleted flag)
- Only SUPER_ADMIN can permanently hard-delete
- All queries automatically filter out deleted records

### Notifications (infrastructure ready)
- SMS / WhatsApp / Email slots prepared
- Triggers: loan approved, collection received, reminder, overdue, renewal

---

## Application Flow

### 1. Login
```
User → Login Page → Enter Email + Password → JWT Issued → Redirect to Dashboard
```
- Inactive or locked accounts are rejected
- 5 failed attempts = auto lock

### 2. Customer Lifecycle
```
Create Customer (Staff/Admin) → Status: PENDING
         ↓
Apply Loan → Status: PENDING_APPROVAL
         ↓
Admin Approves → Customer: ACTIVE, Loan: ACTIVE
         ↓
Daily Collections (Staff) → Receipt Generated
         ↓
Loan Fully Paid → Customer: CLOSED, Loan: CLOSED
         ↓
OR Default → Loan Renewed → New Loan Created
```

### 3. Collection Flow
```
Staff logs in → Sees assigned customers → Selects customer
       ↓
Shows loan details (daily amount, outstanding, days remaining)
       ↓
Enters collection amount → Records payment
       ↓
Receipt auto-generated → Outstanding updated
       ↓
If fully paid → Loan & Customer marked CLOSED
```

### 4. Loan Renewal Flow
```
Customer fails to complete in 100 days
       ↓
Admin clicks "Renew" on loan detail page
       ↓
System calculates: Outstanding × 20% renewal charge
       ↓
New loan created with Renewal Number
       ↓
Old loan marked RENEWED → Full history preserved
```

### 5. Admin Dashboard
```
Super Admin / Admin logs in
       ↓
Sees: Today's Collection, Monthly Collection, Pending Approvals
       ↓
Pending Approvals → Quick approve/reject/return
       ↓
Drill down: Customers → Loans → Collections
       ↓
Reports: Generate any of 6 report types
```

---

## Database Portability

To switch databases, change the provider and `DATABASE_URL` in `backend/.env`, then:

```bash
npx prisma db push
```

Supported:
```env
# SQLite (default — no setup needed)
DATABASE_URL="file:./dev.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/shreeshree"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/shreeshree"

# SQL Server
DATABASE_URL="sqlserver://localhost:1433;database=shreeshree;user=sa;password=pass;trustServerCertificate=true"
```

No business logic changes needed — the Repository and Service layers abstract all database access.

---

## Project Structure

```
backend/
├── prisma/schema.prisma          — 13 data models
├── src/
│   ├── config/                   — App config, logger, Prisma client
│   ├── middleware/               — Auth, RBAC, validation, audit, rate limiter, error handler
│   ├── repositories/            — Data access layer (Repository Pattern)
│   ├── services/                — Business logic layer
│   ├── controllers/             — HTTP request handlers
│   ├── routes/                  — API route definitions
│   ├── validators/              — Zod input validation schemas
│   ├── types/                   — TypeScript interfaces
│   ├── utils/                   — Helpers, error classes
│   └── seeds/seed.ts            — Auto-seeds admin + defaults
│
frontend/
├── src/
│   ├── components/layout/       — AppLayout, Sidebar, Header, MobileBottomNav
│   ├── components/common/       — DataTable, Modal, Loading, StatCard
│   ├── context/                 — AuthContext, ThemeContext
│   ├── services/api.ts          — Axios API client (all endpoints)
│   ├── styles/global.css        — Full responsive theme (dark/light, mobile)
│   └── pages/                   — Login, Dashboard, Customers, Loans, Collections,
│                                   Users, Areas, Reports, Settings
```

---

## API Endpoints

| Group | Endpoints | Auth |
|-------|-----------|------|
| Auth | POST `/api/auth/login`, GET `/api/auth/profile`, PUT `/api/auth/change-password` | Public / Authenticated |
| Users | CRUD + status/lock/unlock/reset-password | SUPER_ADMIN, ADMIN |
| Areas | CRUD | SUPER_ADMIN, ADMIN |
| Customers | CRUD + search | All roles (scoped) |
| Loans | CRUD + approve/reject/return/renew/calculate | All roles (scoped) |
| Collections | CRUD + today stats | All roles (scoped) |
| Dashboard | stats, monthly-chart, area-wise, staff-performance | All roles |
| Reports | daily, monthly, ledger, outstanding, defaulters, renewals, profit | All roles |
| Settings | CRUD | SUPER_ADMIN |
| Search | GET `/api/search?q=` | All roles |
| Expenses | CRUD | SUPER_ADMIN, ADMIN |

---

## Future-Ready Infrastructure

- Multi-branch / Multi-company architecture ready
- Online payment gateway slot prepared
- UPI / QR code collection
- SMS / WhatsApp / Email notification system
- Offline sync capability
- Document OCR, GPS tracking, Biometric login
- AI-based defaulter prediction

---

## License & Contact

**Shree Shree Group** — Internal Enterprise Application
