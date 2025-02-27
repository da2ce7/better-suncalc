import {
  DEGREES_TO_RADIANS,
  EARTH_OBLIQUITY_J2000,
  getPreciseTransitForCycle,
  JULIAN_EPOCH_J2000,
  longitudeToRadWest,
  PI,
  siderealTime,
  SUMMER_SOLSTICE_2000_JD,
  sunCoords,
  VERNAL_EQUINOX_2000_JD,
} from "../src";

const lwGreenwich = longitudeToRadWest(0); // Greenwich
const JD_PRECISION = 1e-6; // Days for Julian Dates (~0.0864 seconds)

describe("sunCoords", () => {
  test("computes sun coordinates at J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000;
    const { ra, dec } = sunCoords(jd_tt);
    // Approximate values from astronomical data for J2000
    // RA ≈ 18h 44m 53s = 281.2292° ≈ 4.9088 rad
    // Dec ≈ -23° 00' 16" = -23.0044° ≈ -0.4015 rad
    const expectedRA = 281.2292 * DEGREES_TO_RADIANS;
    const expectedDec = -23.0044 * DEGREES_TO_RADIANS;
    expect(ra).toBeCloseTo(expectedRA, 1);
    expect(dec).toBeCloseTo(expectedDec, 1);
  });

  test("at J2000 (jd_tt = JULIAN_EPOCH_J2000)", () => {
    const coords = sunCoords(JULIAN_EPOCH_J2000);
    expect(coords.dec).toBeDefined();
    expect(coords.ra).toBeDefined();
    expect(coords.dec).toBeCloseTo(-0.4, 1);
  });

  /** Tests for sunCoords */
  test("sunCoords at vernal equinox 2000", () => {
    const jd_tt = VERNAL_EQUINOX_2000_JD;
    const { ra, dec } = sunCoords(jd_tt);
    expect(ra).toBeCloseTo(0, 2); // RA ≈ 0 at equinox
    expect(dec).toBeCloseTo(0, 2); // Dec ≈ 0 at equinox
  });

  test("sunCoords at summer solstice 2000", () => {
    const jd_tt = SUMMER_SOLSTICE_2000_JD;
    const { ra, dec } = sunCoords(jd_tt);
    expect(ra).toBeCloseTo(PI / 2, 2); // RA ≈ 90°
    expect(dec).toBeCloseTo(EARTH_OBLIQUITY_J2000, 2); // Dec ≈ obliquity
  });

  test("transit time has hour angle close to zero (Greenwich)", () => {
    const transitJD = getPreciseTransitForCycle(1, lwGreenwich);
    const evaluator = (jd_tt: number): number => {
      const c = sunCoords(jd_tt);
      const gmst = siderealTime(jd_tt, 0);
      const lst = gmst - lwGreenwich;
      return lst - c.ra; // Hour angle
    };
    const hourAngle = evaluator(transitJD);
    expect(hourAngle).toBeCloseTo(0, JD_PRECISION);
  });
});
