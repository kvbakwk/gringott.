export function parseMoney(value: number): string {
  return value
    .toFixed(2)
    .toString()
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function parseDate(date: Date): string {
  const outdate =
    date.getDate().toString().padStart(2, "0") +
    "." +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    date.getFullYear();

  return outdate;
}

export function parseTime(date: Date): string {
  const outtime =
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0");

  return outtime;
}

export function parseMonth(number: number): string {
  switch (number) {
    case 0:
      return "styczeń";
    case 1:
      return "luty";
    case 2:
      return "marzec";
    case 3:
      return "kwiecień";
    case 4:
      return "maj";
    case 5:
      return "czerwiec";
    case 6:
      return "lipiec";
    case 7:
      return "sierpień";
    case 8:
      return "wrzesień";
    case 9:
      return "październik";
    case 10:
      return "listopad";
    case 11:
      return "grudzień";
    default:
      return "";
  }
}