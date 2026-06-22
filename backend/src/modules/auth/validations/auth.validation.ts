import { z } from "zod";

export const registerSchema = z.object({
  name: z // ← ADD
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be maximum 50 characters" }),
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

export const resetPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),

  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .min(6, { message: "New password must be at least 6 characters" }),
});
