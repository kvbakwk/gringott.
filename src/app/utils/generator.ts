import { TransactionT } from "./db-actions/transaction";

export function generateTimeLimits(): {
  week: { startOfWeek: Date; endOfWeek: Date };
  month: { startOfMonth: Date; endOfMonth: Date };
  year: { startOfYear: Date; endOfYear: Date };
} {
  function getWeekStartEnd() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }
  function getMonthStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 2, 0);
    return { startOfMonth, endOfMonth };
  }
  function getYearStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 2, 0, 0);
    return { startOfYear, endOfYear };
  }

  return {
    week: getWeekStartEnd(),
    month: getMonthStartEnd(),
    year: getYearStartEnd(),
  };
}

export function generateAllDaysFromOldestTransactionToToday(
  transactions: TransactionT[]
): Date[] {
  const days: Date[] = [];
  const time: Date = new Date();
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);
  time.setMilliseconds(0);

  if (transactions.length)
    while (
      time.getTime() >=
      transactions
        .sort(
          (a: TransactionT, b: TransactionT) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0]
        .date.getTime() -
        86400000
    ) {
      days.push(new Date(time));
      time.setTime(time.getTime() - 86400000);
    }
  else days.push(new Date());
  return days;
}
