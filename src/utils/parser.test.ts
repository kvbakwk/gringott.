const { parseMoney, parseDate, parseTime, parseMonth } = require("./parser");

test('money parser', () => {
  expect(parseMoney(0.001)).toBe("0,00");
  expect(parseMoney(0.01)).toBe("0,01");
  expect(parseMoney(0.1)).toBe("0,10");
  expect(parseMoney(1)).toBe("1,00");
  expect(parseMoney(10)).toBe("10,00");
  expect(parseMoney(100)).toBe("100,00");
  expect(parseMoney(1000)).toBe("1 000,00");
  expect(parseMoney(10000)).toBe("10 000,00");
  expect(parseMoney(100000)).toBe("100 000,00");
  expect(parseMoney(1000000)).toBe("1 000 000,00");
  expect(parseMoney(1000000000)).toBe("1 000 000 000,00");
  expect(parseMoney(1000000000000)).toBe("1 000 000 000 000,00");
});

test('date parser', () => {
  expect(parseDate(new Date(2025, 0, 1, 0, 0, 0, 0))).toBe("01.01.2025");
  expect(parseDate(new Date(2025, 1, 29, 0, 0, 0, 0))).toBe("01.03.2025");
  expect(parseDate(new Date(2025, 11, 31, 23, 59, 59, 999))).toBe("31.12.2025");
});

test('time parser', () => {
  expect(parseTime(new Date(2025, 0, 1, 0, 0, 0, 0))).toBe("00:00");
  expect(parseTime(new Date(2025, 11, 31, 23, 59, 59, 999))).toBe("23:59");
});

test('month parser', () => {
  expect(parseMonth(0)).toBe("styczeń");
  expect(parseMonth(1)).toBe("luty");
  expect(parseMonth(2)).toBe("marzec");
  expect(parseMonth(3)).toBe("kwiecień");
  expect(parseMonth(4)).toBe("maj");
  expect(parseMonth(5)).toBe("czerwiec");
  expect(parseMonth(6)).toBe("lipiec");
  expect(parseMonth(7)).toBe("sierpień");
  expect(parseMonth(8)).toBe("wrzesień");
  expect(parseMonth(9)).toBe("październik");
  expect(parseMonth(10)).toBe("listopad");
  expect(parseMonth(11)).toBe("grudzień");
});