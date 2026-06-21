# Kirti Yoga — Product Specification

## Overview

A two-sided web app for a yoga teacher (Kirti) to manage classes, attendance, and per-class billing for ~30 students. Deployed on Vercel.

## Users

| Role | Description |
|------|-------------|
| **Teacher (admin)** | Kirti — manages everything |
| **Student** | Up to ~30 students — limited portal access |

---

## Core Features

### 1. Authentication
- Kirti logs in with email + password (single admin account, seeded)
- Students log in with email + password
- Students can self-register via public signup page, OR Kirti adds them manually from the admin dashboard
- Role-based routing: teacher → `/dashboard`, student → `/student`

### 2. Class Event Management (Teacher)
- Kirti creates a class event: title, date, time, description
- Events appear on a calendar/schedule view visible to all
- Kirti can cancel or edit events (posts a notice to students)
- Fixed schedule — no seat-limited booking

### 3. Attendance Tracking
- After a class, Kirti can mark attendance for all students (checklist per event)
- Students can also self-mark attendance from their portal (for the same event)
- Attendance record: student ↔ event ↔ present/absent

### 4. Per-Class Billing (core flow)
- After a class event, Kirti marks it as "billing trigger" (or it's automatic after attendance is marked)
- System creates a **pending invoice** for each student who attended
- Invoice: student, event, amount (set per class or per event), status (pending/paid)
- Student portal shows all pending invoices with a "Pay Now" button

### 5. Payments
- **Online (Razorpay):** Student clicks "Pay Now" → Razorpay checkout opens → on success, invoice marked as paid via webhook
- **Offline (UPI walk-in):** Kirti can manually mark any invoice as paid from the admin dashboard
- Payment history visible to both teacher and student

### 6. WhatsApp Reminders
- After a class is billed, system sends a WhatsApp message to each student with a pending invoice
- Message includes: class name, amount due, and a payment link
- Reminder can also be triggered manually by Kirti per student or in bulk
- Uses Twilio WhatsApp API

### 7. Announcements / Updates
- Kirti can post text announcements (title + body)
- Announcements appear on every student's dashboard as a notice board
- Kirti can delete/edit announcements

### 8. Admin Dashboard (Teacher View)
- Overview: total students, this month's revenue, unpaid invoices count
- Student list with payment status
- Upcoming events
- Quick actions: create class, send reminder, add student

### 9. Student Portal
- Pending invoices with Pay button
- Payment history
- Upcoming classes (calendar)
- Announcements from teacher
- Own attendance record

---

## Data Models

### User
- id, name, email, password (hashed), role (TEACHER | STUDENT), phone, createdAt

### ClassEvent
- id, title, description, date, time, amount (price per student for this class), cancelledAt, createdAt

### Attendance
- id, userId (student), classEventId, markedBy (TEACHER | STUDENT), createdAt

### Invoice
- id, studentId, classEventId, amount, status (PENDING | PAID), paidAt, paymentMethod (RAZORPAY | UPI), razorpayOrderId, razorpayPaymentId, createdAt

### Announcement
- id, title, body, createdAt, updatedAt

---

## Success Criteria

- Kirti can see at a glance who owes money (pending invoices)
- Students receive WhatsApp messages after class with payment link
- Students can pay online via Razorpay
- Kirti can mark offline UPI payments as received
- One-click deploy to Vercel with environment variables

---

## Out of Scope

- Seat-limited class booking
- Video/media uploads
- AI chatbot
- Complex analytics / reporting
- Multi-teacher support
- Native mobile app
