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
- Status: completed ✅
- Depends on: T01

### T03 — Teacher dashboard shell
- Layout with sidebar nav: Overview, Classes, Students, Invoices, Announcements
- Overview stats: total students, pending invoices count, this month revenue
- Status: completed ✅
- Depends on: T01

### T04 — Class event CRUD + booking (Teacher & Student)
- Create/edit/cancel class events: title, date, time, description, capacity (max seats)
- Class list view with headcount (booked / capacity)
- Cancel event → WhatsApp notification to booked students
- Students can book / cancel a spot from their portal
- Kirti sees live headcount per class
- Status: completed ✅
- Depends on: T03

### T05 — Attendance marking (Teacher + Student)
- After class, Kirti marks attendance from booked-student checklist
- Students can self-mark attendance from portal
- Save attendance records
- Status: pending
- Depends on: T04

### T06 — Invoice generation (Monthly subscription + Registration)
- Payment model: monthly subscription (8 classes/month) + one-time registration fee
- Kirti generates monthly invoices for all active students in one click
- Registration invoice auto-generated when Kirti adds a student
- Invoice list with filters (pending/paid, REGISTRATION/MONTHLY)
- Kirti manually marks UPI payments as received
- Status: pending
- Depends on: T05

### T07 — Student portal shell
- Layout: Book Classes, Pending Invoices, Payment History, Announcements, Attendance
- Student books / cancels class spots
- Student sees own invoice history and attendance record
- Status: pending
- Depends on: T01

### T08 — Razorpay payment integration
- Create Razorpay order via API route
- Embed Razorpay checkout on invoice pay button
- Webhook: verify signature, mark invoice as paid
- Status: pending
- Depends on: T06, T07

### T09 — WhatsApp reminders (Twilio) — VERY IMPORTANT
Two types:
- Class reminders: Kirti sends upcoming class info to all / booked students
  (message: class title, date, time)
- Payment reminders: students with pending invoices
  (message: month, amount, payment link)
- Manual trigger per-class or bulk; also auto-trigger on invoice generation
- Status: pending
- Depends on: T06

### T10 — Student management (Teacher)
- Add student manually (name, email, phone, temp password)
- Auto-generate registration invoice on add
- Student self-registration page
- Student list with subscription status badge
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
