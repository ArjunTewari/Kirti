import { hashPassword } from "@/lib/auth-helpers";

export type SeedUser = {
  name: string;
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT";
  phone: string;
};

const RAW_USERS = [
  {
    name: "Kirti Sharma",
    email: "kirti@yoga.com",
    password: "Yoga@1234",
    role: "TEACHER" as const,
    phone: "+919876543210",
  },
  {
    name: "Priya Mehta",
    email: "priya@student.com",
    password: "Student@1234",
    role: "STUDENT" as const,
    phone: "+919123456781",
  },
  {
    name: "Rahul Verma",
    email: "rahul@student.com",
    password: "Student@1234",
    role: "STUDENT" as const,
    phone: "+919123456782",
  },
  {
    name: "Ananya Singh",
    email: "ananya@student.com",
    password: "Student@1234",
    role: "STUDENT" as const,
    phone: "+919123456783",
  },
];

export async function buildSeedUsers(): Promise<SeedUser[]> {
  return Promise.all(
    RAW_USERS.map(async (u) => ({
      ...u,
      password: await hashPassword(u.password),
    }))
  );
}
