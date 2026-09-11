# Keeply

A SaaS-style warranty, guarantee, and subscription tracker. Track expiration dates, receive email reminders before products expire, and manage all your warranties in one place.

**Live app:** [https://keeply-silk.vercel.app/](https://keeply-silk.vercel.app/)

## Why Keeply?

Everyday products come with warranties, guarantees, and subscriptions — but remembering when they expire is almost impossible. Miss a warranty window and you lose hundreds of dollars. Forget a subscription renewal and get charged unexpectedly.

**Keeply solves this** by giving you a single dashboard to:

- **Track** all your warranties, guarantees, and subscriptions with purchase dates, durations, and auto-calculated expiration dates
- **Get reminded** via email before anything expires — 7 days before, 3 days before, and on expiry day
- **Upload receipts** and product images so you have proof of purchase ready when you need to file a claim
- **Click claim links** directly from reminder emails to start the warranty claim process immediately
- **Scan documents** with AI — upload a receipt, invoice, or guarantee paper and AI extracts product details automatically

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (Base UI) |
| Forms | React Hook Form + Zod |
| Database | Supabase PostgreSQL + Row Level Security |
| Auth | Supabase Auth (Google OAuth) |
| File Uploads | Cloudinary |
| Email | Resend |
| Cron | Supabase pg_cron + pg_net |
| AI Scan | Groq (qwen3.8-27b) + pdfjs-dist |
| Language | TypeScript |

## Features

### Product Management
- Create, edit, and delete products (warranties, guarantees, subscriptions)
- Upload receipt images and product photos (JPEG, PNG, WebP, PDF)
- Auto-calculated expiration dates from purchase date + duration
- Filter and search products by type, status, and name
- Product details page with remaining time display and receipt image

### AI Document Scan
- Scan receipts, invoices, and guarantee papers with AI
- Supports images (JPEG, PNG, WebP) and PDF files
- PDFs are automatically converted to images on the client before scanning
- AI extracts: product name, brand, category, purchase date, expiry date, duration, notes
- Auto-fills the product form with extracted data — review and save
- Powered by Groq (qwen3.8-27b) for fast, accurate extraction

### Email Notifications
- Automated cron job checks daily for expiring products
- Three reminder types: 7-day warning, 3-day final notice, expiry notification
- Professional email templates with product details and claim links
- Full email notification history with status tracking
- Test notification button on each product for demo/verification

### Dashboard
- Overview stats: total products, active, expiring soon, expired
- Upcoming expirations list sorted by nearest expiry

### Authentication & Security
- Google OAuth sign-in via Supabase
- Row Level Security — users can only see their own data
- Admin role for platform-wide management

## How to Test (Step by Step)

Open **[keeply-silk.vercel.app](https://keeply-silk.vercel.app/)** and follow these steps.

### Step 1 — Sign In

1. Click **Get started** or **Sign in**
2. Sign in with your Google account
3. You'll be redirected to the Dashboard

### Step 2 — Create Your First Product

1. Click **Products** in the navigation
2. Click **Add Product** button
3. Fill in the form:
   - **Name**: `MacBook Pro`
   - **Type**: Select `Warranty`
   - **Category**: Select `Electronics`
   - **Purchase date**: Select today's date
   - **Duration**: Enter `30` (30 days — short for testing)
   - **Receipt**: Upload any image (JPEG, PNG, or WebP)
   - **Product image** (optional): Upload another image
4. Click **Create Product**
5. You'll be redirected to the product details page

### Step 3 — Test AI Document Scan

1. Click **Products** in the navigation
2. Click **Add Product** button
3. Click **Scan Document** button
4. Upload the test PDF file: `public/SalesInvoiceSAP (5).pdf`
   - The PDF is converted to an image automatically
   - The image is uploaded to Cloudinary
   - AI analyzes the document and extracts product details
5. The form auto-fills with extracted data:
   - Product name, brand, category
   - Purchase date and expiry information
   - Notes from the document
6. Review the auto-filled fields, make adjustments if needed
7. Upload a receipt image (required) and product image (optional)
8. Click **Create Product**

> **Note:** You can also scan image files directly (JPEG, PNG, WebP) — no conversion needed.

### Step 4 — Verify the Product Details Page

On the product details page you should see:
- Product name and type/status badges
- Product image (if uploaded)
- Expiration date (auto-calculated: purchase date + duration)
- Remaining time display
- Receipt image (always shown)
- Action buttons: **Send Test Notification**, **Edit**, **Delete**

### Step 5 — Send a Test Email Notification

1. On the product details page, click **Send Test Notification** dropdown
2. Pick one of the three options:
   - **7 days before** — sends the 7-day warning email
   - **3 days before** — sends the 3-day final notice email
   - **Expired** — sends the expired notification email
3. Wait a moment — you'll see a success message: `Sent: 7 days before`
4. Check your email inbox (the one you signed in with) — you'll receive a professional email with:
   - Colored header (amber/orange/red depending on type)
   - Product details card
   - **View Product** button linking back to the product page
   - **Start Claim** button (if you set a claim URL)

### Step 6 — Check Email History

1. Click **Email History** in the navigation
2. You'll see the notification you just sent with:
   - Reminder type badge
   - Status (Sent/Failed)
   - Subject (links to the product)
   - Sent At timestamp
3. Try the filters: filter by status or reminder type
4. Click **Reset** to clear filters

### Step 7 — Create More Products (Test Different Scenarios)

Create a few more products to see the dashboard in action:

| Product | Type | Duration | Purpose |
|---------|------|----------|---------|
| `Netflix Subscription` | Subscription | `7` days | Expiring soon — shows in dashboard stats |
| `Phone Warranty` | Warranty | `365` days | Long-term — normal active product |
| `Headphones Guarantee` | Guarantee | `5` days | Very close to expiry |

### Step 8 — Test the Dashboard

1. Click **Dashboard** in the navigation
2. You'll see:
   - **Total products** count
   - **Active** count
   - **Expiring soon** count (products expiring within 7 days)
   - **Expired** count
   - **Upcoming expirations** list (nearest expiry first)

### Step 9 — Test Product Filters

1. Go to **Products**
2. Use the **type** dropdown to filter by Warranty, Guarantee, or Subscription
3. Use the **status** dropdown to filter by Active, Expired, or Cancelled
4. Use the **search** box to find products by name
5. Use the **sort** dropdown to sort by expiry date or name

### Step 10 — Test Edit and Delete

1. Open any product details page
2. Click **Edit** — change the name or duration, then save
3. Click **Delete** — confirm the deletion — product is removed

### Step 11 — Test Responsive Design

1. Resize the browser window to mobile width (< 768px)
2. The bottom navigation bar appears with tabs: Dashboard, Products, Email, Admin
3. Product list switches from table to card layout
4. Email history switches from table to card layout
5. The product form stacks fields vertically

## Test PDF for Scan

A sample invoice PDF is included for testing the AI scan feature:

```
public/SalesInvoiceSAP (5).pdf
```

Use this file when testing the **Scan Document** button on the Add Product page. The AI will extract product details from the invoice and auto-fill the form.

## Project Structure

```
keeply/
├── src/
│   ├── app/                    # Routes and layouts
│   │   ├── (workspace)/        # Authenticated route group
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── products/       # Product CRUD pages
│   │   │   ├── email-history/  # Notification history
│   │   │   └── admin/          # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── ai/             # AI document scan endpoint
│   │   │   ├── cron/           # Notification cron endpoint
│   │   │   ├── uploads/        # Cloudinary upload handler
│   │   │   └── test/           # Test email endpoint
│   │   └── auth/               # OAuth callback
│   ├── view/                   # Page-level UI components
│   ├── components/             # Shared UI components (shadcn/ui)
│   ├── services/               # Business logic
│   │   ├── products/           # Product CRUD + actions
│   │   ├── email/              # Resend email service
│   │   ├── cron/               # Notification processor
│   │   ├── admin/              # Admin queries
│   │   └── ai/                 # AI scan service (Groq)
│   ├── schemas/                # Zod validation schemas
│   ├── types/                  # TypeScript types
│   ├── lib/                    # Utilities (auth, date, supabase)
│   └── hooks/                  # React hooks
├── supabase/
│   └── migrations/             # SQL migration files
└── public/                     # Static assets
    └── SalesInvoiceSAP (5).pdf # Test PDF for AI scan
```

## License

This project is private and not licensed for distribution.
