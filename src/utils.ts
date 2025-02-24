import { dayMs, J1970, J2000 } from "./constants";

/**
 * Converts a Date object to Julian date.
 * @param date - The date to convert.
 * @returns Julian date as a floating point number.
 */
export function toJulian(date: Date): number {
  return date.valueOf() / dayMs - 0.5 + J1970;
}

/**
 * Converts a Julian date to a Date object.
 * @param j - Julian date to convert.
 * @returns Corresponding Date object.
 */
export function fromJulian(j: number): Date {
  return new Date((j + 0.5 - J1970) * dayMs);
}

/**
 * Converts a Date to days since the J2000 epoch.
 * @param date - Date to convert.
 * @returns Days since J2000 epoch.
 */
export function toDays(date: Date): number {
  return toJulian(date) - J2000;
}

/**
 * Adds hours to a Date object.
 * @param date - Original date.
 * @param h - Hours to add.
 * @returns New Date object advanced by h hours.
 */
export function hoursLater(date: Date, h: number): Date {
  return new Date(date.valueOf() + (h * dayMs) / 24);
}
