import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Некорректный email").max(255, "Email слишком длинный"),
  password: z
    .string()
    .min(8, "Пароль минимум 8 символов")
    .max(72, "Пароль максимум 72 символа"),
});

export const registerSchema = z
  .object({
    email: z.email("Некорректный email").max(255, "Email слишком длинный"),
    password: z
      .string()
      .min(8, "Пароль минимум 8 символов")
      .max(72, "Пароль максимум 72 символа"),
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
