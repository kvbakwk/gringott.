import { TransactionT } from "./db-actions/transaction";
import { TradeT } from "./db-actions/trade";

export function generateTimeLimits(): {
  week: { startOfWeek: Date; endOfWeek: Date };
  month: { startOfMonth: Date; endOfMonth: Date };
  previousMonth: { startOfMonth: Date; endOfMonth: Date };
  year: { startOfYear: Date; endOfYear: Date };
  previousYear: { startOfYear: Date; endOfYear: Date };
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
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
    return { startOfMonth, endOfMonth };
  }
  function getPreviousMonthStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const startOfMonth = new Date(year, month ? month - 1 : 11, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return { startOfMonth, endOfMonth };
  }
  function getYearStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 0, 23, 59, 59);
    return { startOfYear, endOfYear };
  }
  function getPreviousYearStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year - 1, 0, 1);
    const endOfYear = new Date(year, 0, 0, 23, 59, 59);
    return { startOfYear, endOfYear };
  }

  return {
    week: getWeekStartEnd(),
    month: getMonthStartEnd(),
    previousMonth: getPreviousMonthStartEnd(),
    year: getYearStartEnd(),
    previousYear: getPreviousYearStartEnd(),
  };
}

export function generateAllDaysFromOldestTransactionToToday(
  transactions: TransactionT[],
  trades: TradeT[]
): Date[] {
  const days: Date[] = [];
  const time: Date = new Date();
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);
  time.setMilliseconds(0);

  if (transactions.length || (transactions.length && trades.length))
    while (
      time.getTime() >=
        transactions
          .sort(
            (a: TransactionT, b: TransactionT) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0]
          .date.getTime() -
          86400000 ||
      (trades.length &&
        time.getTime() >=
          trades
            .sort(
              (a: TradeT, b: TradeT) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )[0]
            .date.getTime() -
            86400000)
    ) {
      days.push(new Date(time));
      time.setTime(time.getTime() - 86400000);
    }
  else days.push(new Date());
  return days;
}
