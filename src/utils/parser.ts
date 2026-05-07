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
      return "w styczniu";
    case 1:
      return "w lutym";
    case 2:
      return "w marcu";
    case 3:
      return "w kwietniu";
    case 4:
      return "w maju";
    case 5:
      return "w czerwcu";
    case 6:
      return "w lipcu";
    case 7:
      return "w sierpniu";
    case 8:
      return "we wrześniu";
    case 9:
      return "w październiku";
    case 10:
      return "w listopadzie";
    case 11:
      return "w grudniu";
    default:
      return "";
  }
}