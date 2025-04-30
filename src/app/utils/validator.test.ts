const {
  validateWalletName,
  validateWalletBalance,
  validateFullname,
  validateEmail,
  validatePassword,
} = require("./validator");

test("wallet name validate", () => {
  expect(validateWalletName("")).toBe(false);
  expect(validateWalletName("test")).toBe(true);
  expect(validateWalletName("testtesttesttesttest")).toBe(true);
  expect(validateWalletName("testtesttesttesttestx")).toBe(false);
});

test("wallet balance validate", () => {
  expect(validateWalletBalance(-1)).toBe(false);
  expect(validateWalletBalance(0)).toBe(true);
  expect(validateWalletBalance(1)).toBe(true);

  expect(validateWalletBalance(0.01)).toBe(true);
  expect(validateWalletBalance(0.001)).toBe(false);
});

test("fullname validate", () => {
  expect(validateFullname("")).toBe(false);
  expect(validateFullname("A")).toBe(false);
  expect(validateFullname("Aa")).toBe(false);
  expect(validateFullname("Aa ")).toBe(false);
  expect(validateFullname("Aa A")).toBe(false);
  expect(validateFullname("Aa Aa")).toBe(true);
  expect(validateFullname("Aaaaaaaaaaaaaaaaaaaa Aaaaaaaaaaaaaaaaaaa")).toBe(true);
  expect(validateFullname("Aaaaaaaaaaaaaaaaaaaa Aaaaaaaaaaaaaaaaaaaa")).toBe(false);
});

test("email validate", () => {
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("a")).toBe(false);
  expect(validateEmail("a@")).toBe(false);
  expect(validateEmail("a@a")).toBe(false);
  expect(validateEmail("a@a.")).toBe(false);
  expect(validateEmail("a@a.a")).toBe(false);
  expect(validateEmail("a@a.aa")).toBe(true);
  expect(validateEmail("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@a.aa")).toBe(true);
  expect(validateEmail("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@a.aa")).toBe(false);
});

test("password validate", () => {
  expect(validatePassword("")).toBe(false);
  expect(validatePassword("a")).toBe(false);
  expect(validatePassword("aaaaaaa")).toBe(false);
  expect(validatePassword("aaaaaaaa")).toBe(false);
  expect(validatePassword("a1aaaaaa")).toBe(false);
  expect(validatePassword("aaAaaaaa")).toBe(false);
  expect(validatePassword("a1Aaaaaa")).toBe(true);
  expect(validatePassword("a1Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBe(true);
  expect(validatePassword("a1Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBe(false);
});
