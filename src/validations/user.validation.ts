import { z } from "zod";

const registerUserSchema = z
  .object({
    name: z.string().max(100),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    timezone: z.string().default("UTC"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type registerUserRequest = z.infer<typeof registerUserSchema>;

const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  timezone: z.string().default("UTC"),
});

type loginUserRequest = z.infer<typeof loginUserSchema>;

export {
  registerUserSchema,
  registerUserRequest,
  loginUserRequest,
  loginUserSchema,
};
