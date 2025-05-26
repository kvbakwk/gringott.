import {
  getWalletsByUserId,
  getWalletsIdsByUserId,
  isWalletCash,
} from "./db-actions/wallet";
import { getSubjectsIdsByUserId } from "./db-actions/subject";
import { isCategoryIncome, isCategoryOutcome } from "./db-actions/category";
import { isMethodBank, isMethodCash } from "./db-actions/method";

export const validateWalletName = (name: string): boolean => {
  const pattern = /^.{1,20}$/;
  return pattern.test(name);
};
export const validateWalletBalance = (balance: number): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(balance.toString());
};

export const validateFullname = (fullname: string): boolean => {
  const pattern =
    /[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\s[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+/;
  return pattern.test(fullname) && fullname.length <= 40;
};
export const validateEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email) && email.length <= 50;
};
export const validatePassword = (password: string): boolean => {
  const pattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&]{8,100}$/;
  return pattern.test(password);
};
export const validatePasswords = (
  password1: string,
  password2: string
): boolean => {
  return password1 == password2;
};

export const validateTransactionDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
export const validateTransactionAmount = (amount: number): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(amount.toString());
};
export const validateTransactionDescription = (
  description: string
): boolean => {
  const pattern = /^.{1,64}$/;
  return pattern.test(description);
};
export const validateTransactionSubjectId = async (
  subjectId: number,
  userId: number
): Promise<boolean> => {
  return (
    !isNaN(subjectId) &&
    !isNaN(userId) &&
    (await getSubjectsIdsByUserId(userId))
      .map((subject) => subject.id)
      .includes(subjectId)
  );
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
    (((await isWalletCash(walletId)) && (await isMethodBank(methodId))) ||
      (!(await isWalletCash(walletId)) && (await isMethodBank(methodId))))
  );
};
export const validateTransactionCategoryId = async (
  categoryId: number,
  income: boolean
): Promise<boolean> => {
  return (
    !isNaN(categoryId) &&
    (((await isCategoryIncome(categoryId)) && income) ||
      ((await isCategoryOutcome(categoryId)) && !income))
  );
};

export const validateSubjectName = (name: string): boolean => {
  const pattern = /^.{1,40}$/;
  return pattern.test(name);
};
export const validateSubjectAddress = (address: string): boolean => {
  const pattern = /^.{0,50}$/;
  return pattern.test(address);
};
export const validateSubjectNormal = (normal: boolean): boolean => {
  return typeof normal === "boolean";
};
export const validateSubjectAtm = (atm: boolean): boolean => {
  return typeof atm === "boolean";
};

export const validateTradeAtm = (atm: boolean): boolean => {
  return typeof atm === "boolean";
};
export const validateTradeWalletId = async (
  walletId: number,
  userId: number
): Promise<boolean> => {
  return (
    !isNaN(walletId) &&
    !isNaN(userId) &&
    (await getWalletsByUserId(userId))
      .filter((wallet) => wallet.wallet_type_id === 2)
      .map((wallet) => wallet.id)
      .includes(walletId)
  );
};
export const validateTradeDeposit = (atm: boolean): boolean => {
  return typeof atm === "boolean";
};
export const validateTradeUserMethodId = async (
  methodId: number,
  deposit: boolean
): Promise<boolean> => {
  return (
    !isNaN(methodId) &&
    ((deposit && (await isMethodCash(methodId))) ||
      (!deposit && (await isMethodBank(methodId))))
  );
};
export const validateTradeDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
export const validateTradeAmount = (amount: number): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(amount.toString());
};
export const validateTradeSubjectId = async (
  subjectId: number,
  userId: number
): Promise<boolean> => {
  return (
    !isNaN(subjectId) &&
    !isNaN(userId) &&
    (await getSubjectsIdsByUserId(userId))
      .map((subject) => subject.id)
      .includes(subjectId)
  );
};
export const validateTradeSubjectMethodId = async (
  methodId: number,
  deposit: boolean
): Promise<boolean> => {
  return (
    !isNaN(methodId) &&
    ((deposit && (await isMethodBank(methodId))) ||
      (!deposit && (await isMethodCash(methodId))))
  );
};
