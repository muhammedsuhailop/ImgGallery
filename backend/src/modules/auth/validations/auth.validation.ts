import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .trim()
    .email({ message: "Invalid email format" }),

  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number must be at least 10 characters" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .trim()
    .email({ message: "Invalid email format" }),

  password: z.string().min(1, { message: "Password is required" }),
});
