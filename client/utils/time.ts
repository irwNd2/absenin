import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const dateFormat = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const timeFormat = (date: Date) => {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const combineDateTime = (date: Date, time: Date) => {
  // Extract date components
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // Note: months are 0-indexed
  const day = date.getUTCDate();

  // Extract time components
  const hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();
  const seconds = time.getUTCSeconds();
  const milliseconds = time.getUTCMilliseconds();

  // Create a new Date object combining the date and time components
  const combinedDate = new Date(
    Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
  );

  // Return the combined date as an ISO string
  return combinedDate.toISOString();
};

export const formatDateWithDayName = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "EEEE, dd MMM yyyy", { locale: id });
};

export const getHour = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "HH:mm");
};
