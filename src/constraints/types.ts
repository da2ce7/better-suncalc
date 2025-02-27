/**
 * @file constraints/types.ts
 */

export interface OrbitalParameters {
  eccentricity: number;
  inclination: number;
  semiMajorAxis: number;
}

export interface CelestialBodyConstants {
  epoch: {
    meanLongitude: number;
    meanAnomaly: number;
  };
  motion: {
    longitude: number;
    anomaly: number;
  };
  orbit: OrbitalParameters;
}
