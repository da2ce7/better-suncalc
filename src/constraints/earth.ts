/**
 * @file constraints/earth.ts
 */

/** =============== Earth Orientation and Orbital Parameters ================ */

import { JULIAN_EPOCH_J2000 } from "./time";

export const EARTH = {
  OBLIQUITY_J2000: 23.4392911, // IAU 2006 value in degrees
  PERIHELION: {
    LONGITUDE: 102.9372, // Degrees (J2000)
    EPOCH: JULIAN_EPOCH_J2000,
  },
  ORBIT: {
    ECCENTRICITY: 0.0167086,
    TROPICAL_YEAR: 365.2422, // Days
  },
};

/** ================ Sidereal Time and Earth Rotation ================= */

export const SIDEREAL = {
  GMST: {
    BASE: 280.46061837, // Degrees
    DRIFT_RATE: 360.98564736628, // Degrees/day
  },
  GENERAL: {
    ROTATION_RATE: 360.9856235, // Degrees/day (Verified against IERS)
  },
};

/** =============== Atmospheric Refraction Models ================ */

export const REFRACTION = {
  STANDARD: {
    HORIZON: -0.833,
    TWILIGHTS: [-6, -12, -18],
    LUNAR: 0.625,
  },
  SAEMUNDSSON: {
    MIN_ALTITUDE: -0.83,
    COEFFICIENT: 0.017,
    ALTITUDE_OFFSET: 10.3,
    DENOMINATOR_OFFSET: 5.11,
  },
};
