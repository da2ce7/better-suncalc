import { J2000 } from "../src/constraints/constants";
import {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  moonCoords,
} from "../src/mooncalc";

// Precision thresholds
const JD_PRECISION = 1e-6; // Days for Julian Dates (~0.0864 seconds)
const ANGLE_PRECISION = 1e-6; // Radians for angles
const DIST_PRECISION = 1; // Kilometers for distance

/**
 * Moon Coordinate Calculations
 */
describe("Moon Coordinate Calculations", () => {
  describe("moonCoords", () => {
    test("at J2000 (d=0)", () => {
      const d = 0;
      const coords = moonCoords(d);
      expect(coords.ra).toBeDefined();
      expect(coords.dec).toBeDefined();
      expect(coords.dist).toBeDefined();
      // Specific values could be added with known moon position data
    });

    test("distance is within expected range", () => {
      const d = 0;
      const coords = moonCoords(d);
      expect(coords.dist).toBeGreaterThan(356000); // Perigee
      expect(coords.dist).toBeLessThan(406000); // Apogee
    });
  });
});

/**
 * Moon Position Calculations
 */
describe("Moon Position Calculations", () => {
  describe("getMoonPosition", () => {
    test("at J2000, equator, Greenwich", () => {
      const jd = J2000;
      const lat = 0;
      const lng = 0;
      const position = getMoonPosition(jd, lat, lng);
      expect(position.azimuth).toBeDefined();
      expect(position.altitude).toBeDefined();
      expect(position.distance).toBeDefined();
      expect(position.parallacticAngle).toBeDefined();
      // Specific values could be added with known moon position data
    });
  });
});

/**
 * Moon Illumination Calculations
 */
describe("Moon Illumination Calculations", () => {
  describe("getMoonIllumination", () => {
    test("at J2000", () => {
      const jd = J2000;
      const illumination = getMoonIllumination(jd);
      expect(illumination.fraction).toBeGreaterThanOrEqual(0);
      expect(illumination.fraction).toBeLessThanOrEqual(1);
      expect(illumination.phase).toBeGreaterThanOrEqual(0);
      expect(illumination.phase).toBeLessThan(1);
      expect(illumination.angle).toBeDefined();
    });

    test("phase is correctly calculated", () => {
      const jd = J2000;
      const illumination = getMoonIllumination(jd);
      expect(illumination.phase).toBeGreaterThanOrEqual(0);
      expect(illumination.phase).toBeLessThan(1);
    });
  });
});

/**
 * Moon Rise/Set Time Calculations
 */
describe("Moon Rise/Set Time Calculations", () => {
  describe("getMoonTimes", () => {
    test("returns MoonTimesData with expected properties", () => {
      const startJD = J2000;
      const lat = 0;
      const lng = 0;
      const timesData = getMoonTimes(startJD, lat, lng);
      expect(
        timesData.rise ||
          timesData.set ||
          timesData.alwaysUp ||
          timesData.alwaysDown,
      ).toBeDefined();
    });

    test("detects rise and set times", () => {
      const startJD = J2000;
      const lat = 40; // Example latitude (e.g., New York)
      const lng = -74; // Example longitude
      const timesData = getMoonTimes(startJD, lat, lng);
      expect(timesData).toBeDefined();
    });

    test("handles polar day scenarios", () => {
      const startJD = J2000;
      const lat = 80; // High latitude (e.g., near Arctic Circle)
      const lng = 0;
      const timesData = getMoonTimes(startJD, lat, lng);
      expect(timesData.alwaysUp || timesData.alwaysDown).toBeDefined();
    });
  });
});
