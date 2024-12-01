import { isIncomeCategory, isOutcomeCategory } from "./db-actions/category";
import { isBankMethod, isCashMethod } from "./db-actions/method";
import { getWalletsIdsByUserId, isCashWallet } from "./db-actions/wallet";

export const validateWalletName = (name: string): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(name);
};

export const validateWalletBalance = (balance: number): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(balance.toString());
};

export const validateFullname = (fullname: string): boolean => {
  const pattern =
    /[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\s[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+/;
  return pattern.test(fullname);
};

export const validateEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const pattern = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&]{8,}$/;
  return pattern.test(password);
};

export const validatePasswords = (
  password1: string,
  password2: string
): boolean => {
  return password1 == password2;
};

export const validateTransactionDate = (date: string): boolean => {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return pattern.test(date);
};

export const validateTransactionAmount = (amount: number): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(amount.toString());
};

export const validateTransactionDescription = (
  description: string
): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(description);
};

export const validateTransactionAcrossPerson = (receiver: string): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(receiver);
};

export const validateTransactionWalletId = async (
  walletId: number,
  userId: number
): Promise<boolean> => {
  return (
    !isNaN(walletId) &&
    !isNaN(userId) &&
    (await getWalletsIdsByUserId(userId))
      .map((wallet) => wallet.id)
      .includes(walletId)
  );
};

export const validateTransactionMethodId = async (
  methodId: number,
  walletId: number
): Promise<boolean> => {
  return (
    !isNaN(methodId) &&
    !isNaN(walletId) &&
    (((await isCashWallet(walletId)) && (await isCashMethod(methodId))) ||
      (!(await isCashWallet(walletId)) && (await isBankMethod(methodId))))
  );
};

export const validateTransactionCategoryId = async (
  categoryId: number,
  income: boolean
): Promise<boolean> => {
  return (
    !isNaN(categoryId) && (((await isIncomeCategory(categoryId)) && income) ||
    ((await isOutcomeCategory(categoryId)) && !income))
  );
};
