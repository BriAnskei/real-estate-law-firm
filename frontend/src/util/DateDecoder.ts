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
