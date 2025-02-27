import {
  addTime,
  approxJulianCycle,
  approxTransit,
  declination,
  DEGREES_TO_RADIANS,
  EARTH_OBLIQUITY_J2000,
  eclipticLongitude,
  getPosition,
  getPreciseJulianCycle,
  getPreciseTransitForCycle,
  getSetJ,
  getTimes,
  hourAngle,
  JULIAN_EPOCH_J2000,
  PI,
  rightAscension,
  SOLAR_MEAN_ANOMALY,
  solarDeclinationRate,
  solarMeanAnomaly,
  SUMMER_SOLSTICE_2000_JD,
  sunCoords,
  VERNAL_EQUINOX_2000_JD,
} from "../src";

describe("suncalc functions", () => {
  // Reset the times array before each test to ensure a clean state
  beforeEach(() => {
    // Since 'times' is a module-level variable, we can't reset it directly.
    // Testing addTime will append to it, so we rely on Jest's isolation per test.
  });

  /** Tests for solarMeanAnomaly */
  test("solarMeanAnomaly at J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000;
    const expected = SOLAR_MEAN_ANOMALY.OFFSET_DEG * DEGREES_TO_RADIANS; // 357.5291° in radians
    const result = solarMeanAnomaly(jd_tt);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("solarMeanAnomaly one day after J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000 + 1;
    const expected =
      (SOLAR_MEAN_ANOMALY.OFFSET_DEG + SOLAR_MEAN_ANOMALY.RATE_DEG_PER_DAY) *
      DEGREES_TO_RADIANS;
    const result = solarMeanAnomaly(jd_tt);
    expect(result).toBeCloseTo(expected, 5);
  });

  /** Tests for eclipticLongitude */
  test("eclipticLongitude at J2000 mean anomaly", () => {
    const M_deg = SOLAR_MEAN_ANOMALY.OFFSET_DEG;
    const M_rad = M_deg * DEGREES_TO_RADIANS;
    const C =
      DEGREES_TO_RADIANS *
      (1.9148 * Math.sin(M_rad) +
        0.02 * Math.sin(2 * M_rad) +
        0.0003 * Math.sin(3 * M_rad));
    const P = DEGREES_TO_RADIANS * 102.9372; // Perihelion longitude
    const expected = M_rad + C + P + PI;
    const result = eclipticLongitude(M_rad);
    expect(result).toBeCloseTo(expected, 5);
  });

  /** Tests for rightAscension */
  test("rightAscension at vernal equinox (l=0, b=0)", () => {
    const l = 0;
    const b = 0;
    const expected = 0;
    const result = rightAscension(l, b);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("rightAscension at summer solstice (l=90°, b=0)", () => {
    const l = 90 * DEGREES_TO_RADIANS;
    const b = 0;
    const expected = PI / 2;
    const result = rightAscension(l, b);
    expect(result).toBeCloseTo(expected, 5);
  });

  /** Tests for declination */
  test("declination at vernal equinox (l=0, b=0)", () => {
    const l = 0;
    const b = 0;
    const expected = 0;
    const result = declination(l, b);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("declination at summer solstice (l=90°, b=0)", () => {
    const l = 90 * DEGREES_TO_RADIANS;
    const b = 0;
    const expected = EARTH_OBLIQUITY_J2000;
    const result = declination(l, b);
    expect(result).toBeCloseTo(expected, 5);
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

  /** Tests for solarDeclinationRate */
  test("solarDeclinationRate at vernal equinox", () => {
    const jd_tt = VERNAL_EQUINOX_2000_JD;
    const rate = solarDeclinationRate(jd_tt);
    expect(rate).toBeGreaterThan(0); // Increasing at equinox
    expect(rate).toBeCloseTo(0.007, 3); // Approx 0.007 rad/day
  });

  test("solarDeclinationRate at summer solstice", () => {
    const jd_tt = SUMMER_SOLSTICE_2000_JD;
    const rate = solarDeclinationRate(jd_tt);
    expect(rate).toBeCloseTo(0, 3); // Near zero at maximum
  });

  /** Tests for addTime */
  test("addTime adds event to getTimes", () => {
    addTime(-10, "customRise", "customSet");
    const jd_tt = VERNAL_EQUINOX_2000_JD;
    const lat = 40;
    const lng = 0;
    const times = getTimes(jd_tt, lat, lng);
    expect(times).toHaveProperty("customRise");
    expect(times).toHaveProperty("customSet");
    expect(times.customRise).toBeLessThan(times.solarNoon);
    expect(times.customSet).toBeGreaterThan(times.solarNoon);
  });

  /** Tests for getPosition */
  test("getPosition at equator, vernal equinox, near noon", () => {
    const jd_tt = VERNAL_EQUINOX_2000_JD;
    const lat = 0;
    const lng = 0;
    const { altitude } = getPosition(jd_tt, lat, lng);
    expect(altitude * (180 / PI)).toBeCloseTo(90, 1); // Near zenith
  });

  /** Tests for approxJulianCycle */
  test("approxJulianCycle near J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000;
    const lw = 0;
    const n = approxJulianCycle(jd_tt, lw);
    expect(n).toBe(0); // At J2000, cycle ≈ 0
  });

  /** Tests for approxTransit */
  test("approxTransit at J2000, Greenwich", () => {
    const H = 0;
    const lw = 0;
    const n = 0;
    const jd = approxTransit(H, lw, n);
    expect(jd).toBeCloseTo(JULIAN_EPOCH_J2000 + 0.5, 2); // Noon on J2000
  });

  /** Tests for getPreciseTransitForCycle */
  test("getPreciseTransitForCycle near J2000", () => {
    const n = 0;
    const lw = 0;
    const jd = getPreciseTransitForCycle(n, lw);
    expect(jd).toBeGreaterThan(JULIAN_EPOCH_J2000);
    expect(jd).toBeLessThan(JULIAN_EPOCH_J2000 + 1);
  });

  /** Tests for getPreciseJulianCycle */
  test("getPreciseJulianCycle near J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000;
    const lw = 0;
    const { julianCycle, transitJD } = getPreciseJulianCycle(jd_tt, lw);
    expect(julianCycle).toBe(0);
    expect(transitJD).toBeCloseTo(JULIAN_EPOCH_J2000 + 0.5, 1);
  });

  /** Tests for hourAngle */
  test("hourAngle at horizon, equator, equinox", () => {
    const h = 0; // Horizon
    const phi = 0; // Equator
    const dec = 0; // Equinox
    const H = hourAngle(h, phi, dec);
    expect(H).toBeCloseTo(PI / 2, 5); // 90° from meridian
  });

  /** Tests for getSetJ */
  test("getSetJ for sunset at vernal equinox", () => {
    const h = -0.833 * DEGREES_TO_RADIANS; // Sunset altitude
    const lw = 0;
    const phi = 0;
    const dec = 0;
    const n = approxJulianCycle(VERNAL_EQUINOX_2000_JD, lw);
    const jd = getSetJ(h, lw, phi, dec, n);
    expect(jd).toBeGreaterThan(VERNAL_EQUINOX_2000_JD);
    expect(jd - VERNAL_EQUINOX_2000_JD).toBeCloseTo(0.25, 1); // ~6 hours
  });

  /** Tests for getTimes */
  test("getTimes at equator on vernal equinox", () => {
    const jd_tt = VERNAL_EQUINOX_2000_JD;
    const lat = 0;
    const lng = 0;
    const times = getTimes(jd_tt, lat, lng);
    const duration = (times.sunset - times.sunrise) * 24; // Hours
    expect(duration).toBeCloseTo(12, 1); // ~12 hours day length
    expect(times.sunrise).toBeLessThan(times.solarNoon);
    expect(times.solarNoon).toBeLessThan(times.sunset);
  });
});
