import { z } from "zod";

export const COLLEGE_EMAIL_DOMAIN = "@msruas.ac.in";

const collegeEmailValidation = z
  .string()
  .email("Please enter a valid email address")
  .refine(
    (val) => val.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN),
    {
      message: "Access restricted: Only MSRUAS college email addresses ending in @msruas.ac.in are allowed.",
    }
  );

export const loginSchema = z.object({
  email: collegeEmailValidation,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: collegeEmailValidation,
    roll_number: z.string().min(3, "Roll number must be at least 3 characters"),
    hostel_block: z.string().min(1, "Please select or enter your hostel block"),
    room_number: z.string().min(1, "Please enter your room number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password must match password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
