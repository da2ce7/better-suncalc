/**
 * @file constraints/lunar.ts
 */

/** =================== Lunar Orbital and Positional Model =================== */

export const LUNAR = {
  EPOCH_J2000: {
    MEAN_LONGITUDE: 218.316, // Degrees
    MEAN_ANOMALY: 134.963, // Degrees
    MEAN_ARG_LATITUDE: 93.272, // Degrees
  },
  MOTION: {
    LONGITUDE: 13.176396, // Degrees/day
    ANOMALY: 13.064993, // Degrees/day
    ARG_LATITUDE: 13.22935, // Degrees/day
  },
  ORBIT: {
    SEMI_MAJOR_AXIS: 0.00256955529, // AU
    ECCENTRICITY: 0.0549,
    INCLINATION: 5.128, // Degrees
  },
  VISIBILITY: {
    ALTITUDE_THRESHOLD: 0.625, // Degrees (refraction + semi-diameter)
  },
};
