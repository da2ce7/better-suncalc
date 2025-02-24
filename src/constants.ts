/*
  constants.ts

  Contains mathematical and astronomical constants used throughout the library.
*/

export const PI = Math.PI;
export const sin = Math.sin;
export const cos = Math.cos;
export const tan = Math.tan;
export const asin = Math.asin;
export const acos = Math.acos;
export const atan = Math.atan2;

export const rad = PI / 180;

// Date/time constants
export const dayMs = 1000 * 60 * 60 * 24;
export const J1970 = 2440588; // Julian day at Unix epoch: 1970-01-01
export const J2000 = 2451545; // Julian day at 2000-01-01

// Earth constants
export const e = rad * 23.4397; // Earth's obliquity in radians

// Sun times base offset
export const J0 = 0.0009;
