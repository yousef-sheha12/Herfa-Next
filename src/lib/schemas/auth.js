import z from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters."),
    email: z.string().email("Please enter a valid email address."),
    nationalId: z.string().optional(),
    serviceCategory: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.nationalId && !/^\d{15}$/.test(data.nationalId)) {
      ctx.addIssue({
        code: "custom",
        path: ["nationalId"],
        message: "National ID must be exactly 15 digits (UAE format).",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
