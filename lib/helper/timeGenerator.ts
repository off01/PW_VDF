/**
 * Calculates the date of tomorrow and returns it in the format 'YYYY-MM-DD'.
 *
 * This function first creates a date object representing the current day (today's date).
 * It then modifies this object to represent tomorrow's day, adding one day
 * to the current date. Finally, it formats tomorrow's date into the string format 'YYYY-MM-DD'.
 *
 * @returns {string} Datum zítřejšího dne ve formátu 'YYYY-MM-DD'.
 */

export function getTomorrowDate(): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
