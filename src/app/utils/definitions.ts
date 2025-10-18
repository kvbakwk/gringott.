import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ message: "wpisany adres e-mail jest niepoprawny" }).trim(),
  password: z
    .string()
    .min(8, { message: "wpisane hasło jest niepoprawne" })
    .regex(/[a-zA-Z]/, { message: "wpisane hasło jest niepoprawne" })
    .regex(/[0-9]/, { message: "wpisane hasło jest niepoprawne" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "wpisane hasło jest niepoprawne",
    })
    .trim(),
  remember: z.any(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        remember?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: number;
  expiresAt: Date;
};
