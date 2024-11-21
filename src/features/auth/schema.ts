import { z } from "zod";

export const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(8, "Minimum 8 characters are required"),
});

export const signupSchema = z.object({
   name: z.string().min(3, "Minimum 3 characters are required"),
   email: z.string().email(),
   password: z.string().min(8, "Minimum 8 characters are required"),
});