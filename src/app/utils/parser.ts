export function parseMoney(value: number): string {
  return value.toFixed(2).toString().replace(".", ",");
}

export function parseDate(date: Date, withTime: boolean): string {
  const outdate =
    date.getDate().toString().padStart(2, "0") +
    "." +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    date.getFullYear();
  const outtime =
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0");

  if (withTime) return outdate + " " + outtime;
  return outdate;
}
