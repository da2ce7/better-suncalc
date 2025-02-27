/**
 * @file constraints/sol.ts
 */

/** ==================== Solar Orbital and Positional Model ==================== */

export const SOLAR = {
  EPOCH_J2000: {
    MEAN_LONGITUDE: 280.46646, // Degrees (NASA JPL Horizons)
    MEAN_ANOMALY: 357.5291, // Degrees
    ECLIPTIC_OBLIQUITY: 23.4392911, // Degrees
  },
  MOTION: {
    LONGITUDE: 0.98564736, // Degrees per day
    ANOMALY: 0.98560028, // Degrees per day
    LONGITUDE_CENTURIAL: 36000.76982779, // Degrees per Julian century
  },
  EQUATION_OF_CENTER: [1.9148, 0.02, 0.0003],
  REFRACTION: {
    STANDARD_ALTITUDE: -0.833, // Classic horizon threshold
    TWILIGHTS: [-6, -12, -18], // Civil, nautical, astronomical
  },
};
