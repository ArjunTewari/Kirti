import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(p: string) {
  return bcrypt.hash(p, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysAhead(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function setTime(date: Date, h: number, m = 0) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database…");

  // ── Users ──────────────────────────────────────────────
  const teacherPwd = await hash("Yoga@1234");
  const studentPwd = await hash("Student@1234");

  const teacher = await prisma.user.upsert({
    where: { email: "kirti@yoga.com" },
    update: {},
    create: { name: "Kirti Sharma", email: "kirti@yoga.com", password: teacherPwd, role: "TEACHER", phone: "+91-98765-43210" },
  });
  console.log(`  ✓ TEACHER ${teacher.name}`);

  const studentData = [
    { name: "Priya Mehta",    email: "priya@student.com",   phone: "+91-98001-11111" },
    { name: "Rahul Verma",    email: "rahul@student.com",   phone: "+91-98002-22222" },
    { name: "Ananya Singh",   email: "ananya@student.com",  phone: "+91-98003-33333" },
    { name: "Meera Kapoor",   email: "meera@student.com",   phone: "+91-98004-44444" },
    { name: "Arjun Nair",     email: "arjun@student.com",   phone: "+91-98005-55555" },
    { name: "Deepika Rao",    email: "deepika@student.com", phone: "+91-98006-66666" },
    { name: "Sanjay Gupta",   email: "sanjay@student.com",  phone: "+91-98007-77777" },
    { name: "Kavya Pillai",   email: "kavya@student.com",   phone: "+91-98008-88888" },
    { name: "Vikram Tiwari",  email: "vikram@student.com",  phone: "+91-98009-99999" },
    { name: "Pooja Joshi",    email: "pooja@student.com",   phone: "+91-98010-10101" },
    { name: "Rohit Bansal",   email: "rohit@student.com",   phone: "+91-98011-11000" },
    { name: "Divya Menon",    email: "divya@student.com",   phone: "+91-98012-12000" },
  ];

  const students = [];
  for (const s of studentData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, password: studentPwd, role: "STUDENT" },
    });
    students.push(user);
    console.log(`  ✓ STUDENT ${user.name}`);
  }

  // ── Announcements ──────────────────────────────────────
  const announcements = [
    { title: "New Batch Starting July 1st", body: "A new beginner batch for Hatha Yoga is starting July 1st. Timing: 7:00 AM – 8:00 AM. Limited to 12 seats. Register soon!" },
    { title: "Midsummer Retreat – June 28", body: "Join us for a special 3-hour restorative yoga and meditation retreat on June 28th. Mat, props, and herbal tea included. RSVP by June 25." },
    { title: "Class Rescheduled – June 24 (Tue)", body: "Evening Vinyasa on June 24th is moved to 7:30 PM instead of 6:30 PM due to a venue booking. Please adjust your schedules accordingly." },
    { title: "Yin Yoga Workshop Added", body: "We're adding an extra Yin & Restore session every last Saturday of the month. First session: June 28, 10 AM – 12 PM. Open to all levels." },
    { title: "Invoices for June are Ready", body: "Monthly invoices for June 2026 have been generated. Please clear dues before June 30th. UPI payments accepted — scan the QR at the studio." },
    { title: "Studio Closed June 26 (Public Holiday)", body: "The studio will remain closed on June 26th on account of a public holiday. Regular classes resume June 27th. Stay tuned for a makeup class announcement." },
  ];

  for (const a of announcements) {
    const exists = await prisma.announcement.findFirst({ where: { title: a.title } });
    if (!exists) {
      await prisma.announcement.create({ data: a });
    }
  }
  console.log(`  ✓ ${announcements.length} announcements`);

  // ── Class events ────────────────────────────────────────
  type ClassDef = { title: string; description: string; capacity: number };
  const classDefs: ClassDef[] = [
    { title: "Morning Hatha Yoga",     description: "Gentle sun salutations, standing poses, and breathwork. Great for all levels.", capacity: 20 },
    { title: "Evening Vinyasa Flow",   description: "Dynamic flowing sequences synced with breath. Intermediate level.", capacity: 15 },
    { title: "Weekend Yin & Restore",  description: "Long-held passive poses to release deep connective tissue. All welcome.", capacity: 25 },
    { title: "Power Flow Yoga",        description: "High-energy athletic yoga blending strength and flexibility.", capacity: 12 },
    { title: "Pranayama & Meditation", description: "Focused breathwork and guided mindfulness meditation. Beginners welcome.", capacity: 18 },
  ];

  // Past classes: 30 classes over last 60 days
  const pastClassDates: { def: ClassDef; date: Date }[] = [];
  for (let i = 60; i >= 2; i -= 2) {
    const def = classDefs[Math.floor(Math.random() * 3)]; // cycle through first 3
    pastClassDates.push({ def, date: setTime(daysAgo(i), i % 2 === 0 ? 6 : 18, 30) });
  }

  // Upcoming: 12 classes over next 30 days
  const upcomingDates: { def: ClassDef; date: Date }[] = [];
  const upcomingSlots = [1, 3, 5, 6, 8, 10, 12, 14, 15, 17, 19, 21];
  upcomingSlots.forEach((d, i) => {
    const def = classDefs[i % classDefs.length];
    upcomingDates.push({ def, date: setTime(daysAhead(d), d % 2 === 0 ? 18 : 6, 30) });
  });

  const createdPastClasses = [];
  for (const { def, date } of pastClassDates) {
    const existing = await prisma.classEvent.findFirst({ where: { date, title: def.title } });
    if (!existing) {
      const c = await prisma.classEvent.create({ data: { title: def.title, description: def.description, date, capacity: def.capacity } });
      createdPastClasses.push(c);
    } else {
      createdPastClasses.push(existing);
    }
  }

  const createdUpcoming = [];
  for (const { def, date } of upcomingDates) {
    const existing = await prisma.classEvent.findFirst({ where: { date, title: def.title } });
    if (!existing) {
      const c = await prisma.classEvent.create({ data: { title: def.title, description: def.description, date, capacity: def.capacity } });
      createdUpcoming.push(c);
    } else {
      createdUpcoming.push(existing);
    }
  }
  console.log(`  ✓ ${createdPastClasses.length} past classes, ${createdUpcoming.length} upcoming classes`);

  // ── Attendance for past classes ─────────────────────────
  let attendanceCount = 0;
  for (const cls of createdPastClasses) {
    // 60–90% of students attend each past class
    const attendees = students.filter((_, i) => (i + cls.capacity) % 3 !== 0);
    for (const s of attendees) {
      const exists = await prisma.attendance.findUnique({ where: { studentId_classEventId: { studentId: s.id, classEventId: cls.id } } });
      if (!exists) {
        await prisma.attendance.create({ data: { studentId: s.id, classEventId: cls.id, markedBy: "TEACHER" } });
        attendanceCount++;
      }
    }
  }
  console.log(`  ✓ ${attendanceCount} attendance records`);

  // ── Bookings for upcoming classes ──────────────────────
  let bookingCount = 0;
  for (const cls of createdUpcoming) {
    const bookers = students.filter((_, i) => i < cls.capacity - 2);
    for (const s of bookers) {
      const exists = await prisma.classBooking.findUnique({ where: { studentId_classEventId: { studentId: s.id, classEventId: cls.id } } });
      if (!exists) {
        await prisma.classBooking.create({ data: { studentId: s.id, classEventId: cls.id, status: "BOOKED" } });
        bookingCount++;
      }
    }
  }
  console.log(`  ✓ ${bookingCount} bookings`);

  // ── Invoices ────────────────────────────────────────────
  const months = ["2026-04", "2026-05", "2026-06"];
  const monthlyFee = 2500;
  const regFee = 1000;

  let invoiceCount = 0;
  for (const s of students) {
    // Registration invoice — first 8 PAID, rest PENDING
    const regIdx = students.indexOf(s);
    const regPaid = regIdx < 8;
    const regExists = await prisma.invoice.findFirst({ where: { studentId: s.id, type: "REGISTRATION" } });
    if (!regExists) {
      await prisma.invoice.create({
        data: {
          studentId: s.id, type: "REGISTRATION", amount: regFee,
          status: regPaid ? "PAID" : "PENDING",
          paidAt: regPaid ? daysAgo(45 - regIdx * 3) : null,
          paymentMethod: regPaid ? "UPI" : null,
        },
      });
      invoiceCount++;
    }

    // Monthly invoices — April fully paid, May mostly paid, June pending
    for (const [mi, month] of months.entries()) {
      const isPaid = mi === 0 || (mi === 1 && regIdx < 9);
      const exists = await prisma.invoice.findFirst({ where: { studentId: s.id, type: "MONTHLY", month } });
      if (!exists) {
        await prisma.invoice.create({
          data: {
            studentId: s.id, type: "MONTHLY", month, amount: monthlyFee,
            status: isPaid ? "PAID" : "PENDING",
            paidAt: isPaid ? daysAgo(30 - mi * 10) : null,
            paymentMethod: isPaid ? "UPI" : null,
          },
        });
        invoiceCount++;
      }
    }
  }
  console.log(`  ✓ ${invoiceCount} invoices`);

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
