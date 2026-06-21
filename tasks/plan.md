# Kirti Yoga — Build Plan

## Tasks

### T01 — Project foundation & auth setup
- Set up NextAuth.js v5 with credentials provider (email + password)
- Lib: prisma client singleton, auth config, bcrypt helpers
- Two roles: TEACHER, STUDENT
- Protected route middleware
- Login page (shared), redirect by role
- Status: completed ✅

### T02 — Database seed
- Seed script: create Kirti's teacher account + 3 sample students
- Status: pending
- Depends on: T01

### T03 — Teacher dashboard shell
- Layout with sidebar nav: Overview, Classes, Students, Invoices, Announcements
- Overview stats: total students, pending invoices count, this month revenue
- Status: pending
- Depends on: T01

### T04 — Class event CRUD (Teacher)
- Create/edit/cancel class events (title, date, time, description, amount per student)
- Class list view + upcoming calendar strip
- Status: pending
- Depends on: T03

### T05 — Attendance marking (Teacher side)
- After selecting a class event, show student checklist
- Mark/unmark attended per student
- Save attendance records
- Status: pending
- Depends on: T04

### T06 — Invoice generation
- API: generate invoices for all attendees of a class event
- Teacher can trigger "Generate Invoices" button after class
- Invoice list in teacher dashboard with filters (pending/paid)
- Mark UPI payment as received (manual)
- Status: pending
- Depends on: T05

### T07 — Student portal shell
- Layout: Pending Invoices, Payment History, My Classes, Announcements
- Student can mark own attendance for a class
- Status: pending
- Depends on: T01

### T08 — Razorpay payment integration
- Create Razorpay order via API route
- Embed Razorpay checkout on invoice pay button
- Webhook: verify signature, mark invoice as paid
- Status: pending
- Depends on: T06, T07

### T09 — WhatsApp reminders (Twilio)
- Send WhatsApp message to student phone after invoice is generated
- Message: class name, amount due, payment link
- Bulk send from teacher dashboard per class event
- Manual reminder button per student in invoice list
- Status: pending
- Depends on: T06

### T10 — Student management (Teacher)
- Add student manually (name, email, phone, password)
- Student self-registration page
- Student list with payment status badge
- Status: pending
- Depends on: T03

### T11 — Announcements
- Teacher: create/edit/delete announcements
- Student: read-only feed on dashboard
- Status: pending
- Depends on: T03, T07

### T12 — Polish & Vercel config
- .env.example with all required vars
- vercel.json if needed
- README with setup instructions
- Responsive mobile layout fixes
- Status: pending
- Depends on: T01-T11
