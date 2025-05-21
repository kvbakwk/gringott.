const {
  validateWalletName,
  validateWalletBalance,
  validateFullname,
  validateEmail,
  validatePassword,
  validatePasswords,
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateSubjectName,
} = require("./validator");

const { generateRandomString } = require("./generator")

test("wallet name validate", () => {
  expect(validateWalletName("")).toBeFalsy();
  expect(validateWalletName("test")).toBeTruthy();
  expect(validateWalletName("testtesttesttesttest")).toBeTruthy();
  expect(validateWalletName("testtesttesttesttestx")).toBeFalsy();
});
test("wallet balance validate", () => {
  expect(validateWalletBalance(-1)).toBeFalsy();
  expect(validateWalletBalance(0)).toBeTruthy();
  expect(validateWalletBalance(1)).toBeTruthy();

  expect(validateWalletBalance(0.01)).toBeTruthy();
  expect(validateWalletBalance(0.001)).toBeFalsy();
});

test("fullname validate", () => {
  expect(validateFullname("")).toBeFalsy();
  expect(validateFullname("A")).toBeFalsy();
  expect(validateFullname("Aa")).toBeFalsy();
  expect(validateFullname("Aa ")).toBeFalsy();
  expect(validateFullname("Aa A")).toBeFalsy();
  expect(validateFullname("Aa Aa")).toBeTruthy();
  expect(validateFullname("Aaaaaaaaaaaaaaaaaaaa Aaaaaaaaaaaaaaaaaaa")).toBeTruthy();
  expect(validateFullname("Aaaaaaaaaaaaaaaaaaaa Aaaaaaaaaaaaaaaaaaaa")).toBeFalsy();
});
test("email validate", () => {
  expect(validateEmail("")).toBeFalsy();
  expect(validateEmail("a")).toBeFalsy();
  expect(validateEmail("a@")).toBeFalsy();
  expect(validateEmail("a@a")).toBeFalsy();
  expect(validateEmail("a@a.")).toBeFalsy();
  expect(validateEmail("a@a.a")).toBeFalsy();
  expect(validateEmail("a@a.aa")).toBeTruthy();
  expect(validateEmail("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@a.aa")).toBeTruthy();
  expect(validateEmail("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@a.aa")).toBeFalsy();
});

test("password validate", () => {
  expect(validatePassword("")).toBeFalsy();
  expect(validatePassword("a")).toBeFalsy();
  expect(validatePassword("aaaaaaa")).toBeFalsy();
  expect(validatePassword("aaaaaaaa")).toBeFalsy();
  expect(validatePassword("a1aaaaaa")).toBeFalsy();
  expect(validatePassword("aaAaaaaa")).toBeFalsy();
  expect(validatePassword("a1Aaaaaa")).toBeTruthy();
  expect(validatePassword("a1Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeTruthy();
  expect(validatePassword("a1Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeFalsy();
});
test("passwords validate", () => {
  expect(validatePasswords("a", "a")).toBeTruthy();
  expect(validatePasswords("a", "b")).toBeFalsy();
});

test("transaction date validate", () => {
  expect(validateTransactionDate(new Date())).toBeTruthy();
  expect(validateTransactionDate(null)).toBeFalsy();
});
test("transaction amount validate", () => {
  expect(validateTransactionAmount(-1)).toBeFalsy();
  expect(validateTransactionAmount(0)).toBeTruthy();
  expect(validateTransactionAmount(1)).toBeTruthy();
  expect(validateTransactionAmount(0.01)).toBeTruthy();
  expect(validateTransactionAmount(0.001)).toBeFalsy();
});
test("transaction description validate", () => {
  expect(validateTransactionDescription("")).toBeFalsy();
  expect(validateTransactionDescription("a")).toBeTruthy();
  expect(validateTransactionDescription("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeTruthy();
  expect(validateTransactionDescription("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeFalsy();
})

test("subject name validate", () => {
  expect(validateSubjectName("")).toBeFalsy();
  expect(validateSubjectName("a")).toBeTruthy();
  expect(validateSubjectName("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeTruthy();
  expect(validateSubjectName("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBeFalsy();
})