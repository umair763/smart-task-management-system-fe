import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters long.")
    .regex(/[a-z]/, "Must include at least 1 lowercase letter.")
    .regex(/[A-Z]/, "Must include at least 1 uppercase letter.")
    .regex(/\d/, "Must include at least 1 number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must include at least 1 special character."
    ),
  bio: z.string().optional(),
  profileImage: z.any().optional(),
});
