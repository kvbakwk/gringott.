import { z } from "zod";

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        amount?: string[];
        fromWalletId?: string[];
        methodId?: string[];
        toWalletId?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: number;
  type: "access" | "refresh";
  expiresAt: Date;
};

export const LoginFormSchema = z.object({
  email: z.email({ message: "wpisany adres e-mail jest niepoprawny" }).trim(),
  password: z
    .string()
    .min(1, { message: "wpisane hasło jest za krótkie" })
    .trim(),
});

export const NewTransferFormSchema = z.object({
  amount: z
    .number({ message: "wpisz kwotę" })
    .nonnegative({ message: "kwota nie może być ujemna" })
    .multipleOf(0.01, {
      message: "kwota musi mieć maksymalnie 2 miejsca po przecinku",
    }),
  methodId: z
    .int({ message: "zaznacz poprawną metodę" })
    .nonnegative({ message: "zaznacz poprawną metodę" }),
  fromWalletId: z
    .int({ message: "zaznacz poprawny portfel" })
    .nonnegative({ message: "zaznacz poprawny portfel" }),
  toWalletId: z
    .int({ message: "zaznacz poprawny portfel" })
    .nonnegative({ message: "zaznacz poprawny portfel" }),
});
