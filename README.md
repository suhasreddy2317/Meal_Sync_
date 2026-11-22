# Meal_Sync_

## MealSync — Intelligent Food and Dining Management

AI-powered Smart Mess Management System for efficient meal planning, attendance tracking and food wastage reduction.

> **Smarter Meals. Seamless Management.**  
> A world-class, premium SaaS-style Mess Management System engineered with **Next.js 14 App Router**, **TypeScript**, **Supabase PostgreSQL**, **Tailwind CSS**, and **Recharts**. Designed with modern minimalism, soft neubrutalism, high-definition food photography, and glassmorphic card layouts to eliminate institutional food waste, streamline student dining, and empower mess administrators.

---

## 🎨 Design System & Brand Identity

MealSync was crafted from the ground up to break away from generic college dashboard templates, delivering a commercial-grade SaaS experience:

- **Primary Brand Yellow**: `#FFC83D` (Active states, primary CTA accents, indicators)
- **Secondary Yellow**: `#FFD66B` (Hover highlights, subtle glows)
- **Deep Black**: `#151515` (Fixed navigation sidebars, headers, prominent typography)
- **Background Cream**: `#FFF9F3` (Gentle, warm, non-straining canvas)
- **Card Background**: `#FFFFFF` with `#EEE8E0` light borders & soft neubrutalist shadows
- **Soft Semantic Accents**:
  - Green (`#DDF5E8` / `#43B978`) – Current Balance & positive indicators
  - Purple (`#E9E2FF`) – Average Rating trend highlights
  - Orange (`#FFE9CC`) – Quick actions and alert notifications
  - Red (`#FDE8E8` / `#EF6464`) – Pending tickets and complaint resolution
- **Interactive Visuals**: Realistic culinary photography across 4 daily meals (*Breakfast, Lunch, Evening Snacks, Dinner*), Recharts attendance analytics with current-day highlights, and interactive modal dialogs.

---

## 📱 Student Dashboard Architecture

1. **A. Left Fixed Dark Sidebar (`#151515`)**:
   - Official MealSync plate-and-sync brand logo & *"Smarter Meals. Seamless Management."* tagline.
   - 9 accessible navigation views:
     - 📊 `Dashboard` (`/student/dashboard`)
     - 📅 `Weekly Menu` (`/student/menu`)
     - 🍽️ `My Meals` (`/student/my-meals`)
     - ⭐ `Feedback` (`/student/feedback`)
     - ⚠️ `Complaints` (`/student/complaints`)
     - 💳 `Payments` (`/student/payments`)
     - 🔔 `Notifications` (`/student/notifications`)
     - 👤 `Profile` (`/student/profile`)
     - ⚙️ `Settings` (`/student/settings`)
   - Interactive Help & Support card with hostel contact info.

2. **B. Top Navigation Header**:
   - Search bar with live autocomplete modal.
   - Dynamic notification bell with unread badge counter.
   - Profile badge with avatar, name, and role selector.

3. **C. Welcome & Date Header**:
   - Time-of-day greeting ("*Good Evening, [Name]! 👋*").
   - Live calendar widget displaying date, week number, and day of year.

4. **D. 4 Core Metric Cards**:
   - **Meals This Month**: `18 / 22` with an 82% progress bar.
   - **Current Balance**: `₹450` with an instant top-up recharge modal (+₹100, +₹250, +₹500, +₹1,000).
   - **Average Rating**: `4.6 / 5` with positive trend indicators.
   - **Pending Complaints**: `1` with quick ticket tracking.

5. **E. Today's Menu Section**:
   - 4 horizontal culinary cards featuring photography:
     - 🌅 **Breakfast**: South Indian Idli with Chutney (8:00 AM – 10:00 AM)
     - ☀️ **Lunch**: Steamed Rice with Sambar & Curry (12:30 PM – 2:30 PM)
     - ☕ **Evening Snacks**: Masala Tea with Crisp Biscuits (5:00 PM – 6:00 PM)
     - 🌙 **Dinner**: Fresh Roti with Shahi Paneer Curry (7:30 PM – 9:30 PM)
   - Clickable cards opening meal detail dialogs with calories, nutrition, and dining confirmation.

6. **F. Meal Attendance Analytics**:
   - Interactive weekly bar chart (Mon–Sun, 0–100%) highlighting today's attendance.
   - Date range selector (This Week, Last Week, Past Month).

7. **G. Quick Actions**:
   - 4 soft-background shortcut cards: *Mark Meal [Today]*, *Raise Complaint*, *Top Up Wallet*, *Give Feedback*.

8. **H. Recent Activity & Timeline**:
   - Chronological dining timeline with colored status pills.

9. **I. Promotional Banner**:
   - Dark `#151515` banner: *"Enjoy your meals! Healthy food. Happy you."* with chef illustration and meal pass button.

---

## 🌟 Key Functional Features (FR1 – FR10)

1. **FR1 — Role-Based Authentication & Dashboards**:
   - Secure student registration (hostel block, room number, roll number).
   - Server-guarded route redirection with zero client-side role privilege escalation.
   - Dedicated SaaS interfaces for Students and Mess Administrators.

2. **FR2 — 7-Day Rolling Menu Management**:
   - Admin CRUD for breakfast, lunch, and dinner with dish categories and vegetarian tags.
   - Rolling 7-day student calendar view.

3. **FR3 — Meal Planning & Cutoff Enforcement**:
   - "Will You Eat?" Yes/No declarations per meal.
   - Live client-side countdown timer and strict server-side cutoff time validation (locks submissions at configured deadlines).
   - Real-time aggregation of expected dining headcounts.

4. **FR4 — Food Quantity & Wastage Tracking**:
   - Post-meal logs for prepared and leftover weights (kg / portions).
   - Automated stored calculation: $\text{Wastage \%} = (\text{Leftover} / \text{Prepared}) \times 100$.
   - Validations preventing negative values and leftover exceeding prepared quantity.

5. **FR5 — Meal Ratings & Qualitative Feedback**:
   - 1 to 5 star ratings and reviews unlocked strictly when meal serving begins.
   - Database uniqueness constraint enforcing exactly one rating per student per meal.

6. **FR6 — In-App Notifications**:
   - Automated PostgreSQL trigger and server-action fan-out generating alerts for all registered students upon menu publication or modification.
   - Unread badge counter and mark-as-read inbox.

7. **FR7 — Reporting & Visual Analytics**:
   - Recharts-powered interactive analytics across 7-day and 30-day horizons.
   - Prepared vs. Leftover quantities, daily wastage trends, and dining turnout tracking.

8. **FR8 — Prescriptive AI Quality & Wastage Rules**:
   - Explainable rule engine flagging excess wastage (>15% reduction advice), recurring day-of-week trends, and replacement warnings for poorly rated dishes (<3.0 stars).

9. **FR9 — Explainable AI Demand Prediction**:
   - Ensembled forecast blending 4-cycle same-weekday Weighted Moving Averages (weights: 0.4, 0.3, 0.2, 0.1) and turnout-adjusted planned opt-ins.
   - Target batch cooking recommendations with a 5% kitchen buffer.

10. **FR10 — Pantry Inventory & Recipe Matching**:
    - Real-time grocery stock levels with minimum threshold alerts.
    - Dynamic recipe compatibility engine scoring $\ge 70\%$ match with in-stock ingredients.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js 18+ or 20+ installed
- npm 9+ or yarn/pnpm

### 1. Installation
Clone repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If Supabase credentials are not yet linked, the application automatically uses the high-fidelity local repository with 25 seeded students and 21 days of menus).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

No reusable demo passwords are included in this documentation. Configure authorized accounts in your own Supabase environment.

## 🗄️ Database Migrations & Supabase Setup

To apply the schema to a Supabase PostgreSQL instance:
1. Navigate to the SQL Editor in your Supabase Dashboard.
2. Execute the migrations in order:
   - `supabase/migrations/001_initial_schema.sql` (Tables, constraints, indexes)
   - `supabase/migrations/002_rls_policies.sql` (Row Level Security policies)
   - `supabase/migrations/003_triggers_and_functions.sql` (Triggers and notification fan-outs)
3. Execute `supabase/seed.sql` to populate 15 grocery items, 8 authentic recipes, 25 student profiles, and historical records.

Direct database utility scripts require `SUPABASE_DB_HOST` and `SUPABASE_DB_PASSWORD` from your own Supabase project settings. The OTP delivery test also requires `TEST_EMAIL`; it sends a test code to that address.

---

## 🧪 Automated Testing

Execute the comprehensive 20-test acceptance suite verifying FR1 through FR10:
```bash
npx tsx tests/acceptance.test.ts
```

All 20 mandatory acceptance criteria pass with full programmatic verification.

---

## 🚢 Deployment to Vercel

1. Push code to your GitHub/GitLab repository.
2. Import project in Vercel.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**. Vercel will build and host the Next.js App Router application automatically.
