export function formatDateToDateInputString(dateData: string) {
  const date = new Date(dateData);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format as readable strings for the consultation input
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { formattedDate, formattedTime };
}

export function decodeInputDateAndTimeToDate(
  dateInput: string,
  timeInput: string
) {
  return `${dateInput} ${timeInput || "00:00"}:00`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function segregateDateTime(dateTimeString: string): {
  date: string;
  time: string;
} {
  const date = new Date(dateTimeString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
