import {
  addTime,
  dateToJulian,
  getPosition,
  getTimes,
  solarMeanAnomaly,
  sunCoords,
} from "../src";
import {
  DEGREES_TO_RADIANS,
  JULIAN_EPOCH_J2000,
  SOLAR_EVENT_DEFINITIONS,
} from "../src/constraints/constants";

// Helper to reset the times array before each test
beforeEach(() => {
  // Reset times to default SOLAR_EVENT_DEFINITIONS
  const resetTimes = () => {
    // Access the internal 'times' via a hack since it's not exported
    (getTimes as any).times = [...SOLAR_EVENT_DEFINITIONS];
  };
  resetTimes();
});

describe("solarMeanAnomaly", () => {
  test("calculates mean anomaly at J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000; // 2451545.0 TT
    const M = solarMeanAnomaly(jd_tt);
    // At J2000, d = 0, so M = 357.5291° in radians
    const expectedM = 357.5291 * DEGREES_TO_RADIANS;
    expect(M).toBeCloseTo(expectedM, 4);
  });

  test("calculates mean anomaly one day after J2000", () => {
    const jd_tt = JULIAN_EPOCH_J2000 + 1;
    const M = solarMeanAnomaly(jd_tt);
    // M increases by 0.98560028° per day
    const expectedM = (357.5291 + 0.98560028) * DEGREES_TO_RADIANS;
    expect(M).toBeCloseTo(expectedM, 4);
  });
});

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
});

describe("getPosition", () => {
  test("computes sun position at J2000 for Greenwich", () => {
    const jd_tt = JULIAN_EPOCH_J2000; // January 1, 2000, 12:00 TT
    const lat = 51.48; // Greenwich latitude
    const lng = 0; // Greenwich longitude
    const position = getPosition(jd_tt, lat, lng);
    // At solar noon (adjusted), azimuth ≈ 180°, altitude ≈ 15.5°
    const expectedAzimuth = 180 * DEGREES_TO_RADIANS;
    const expectedAltitude = 15.5 * DEGREES_TO_RADIANS;
    expect(position.azimuth).toBeCloseTo(expectedAzimuth, 1);
    expect(position.altitude).toBeCloseTo(expectedAltitude, 1);
  });
});

describe("getTimes", () => {
  test("computes sun times for March 20, 2000, at Greenwich", () => {
    const date = new Date(Date.UTC(2000, 2, 20, 0, 0, 0)); // March 20, 2000, 00:00 UTC
    const jd_tt = dateToJulian(date); // Approx 2451623.50074 TT
    const lat = 51.48;
    const lng = 0;
    const times = getTimes(jd_tt, lat, lng);

    // Approximate times from astronomical data
    // Solar noon ≈ 12:00 UTC ≈ JD TT 2451624.00074
    // Sunrise ≈ 6:03 UTC ≈ JD TT 2451623.752823
    // Sunset ≈ 18:10 UTC ≈ JD TT 2451624.257684
    const expectedSolarNoon = 2451624.00074;
    const expectedSunrise = 2451623.752823;
    const expectedSunset = 2451624.257684;

    expect(times.solarNoon).toBeCloseTo(expectedSolarNoon, 2);
    expect(times.sunrise).toBeCloseTo(expectedSunrise, 2);
    expect(times.sunset).toBeCloseTo(expectedSunset, 2);

    // Check symmetry: (sunrise + sunset) / 2 ≈ solarNoon
    const midpoint = (times.sunrise + times.sunset) / 2;
    expect(midpoint).toBeCloseTo(times.solarNoon, 3);
  });

  test("handles polar summer (always up) at 80°N on June 21, 2000", () => {
    const date = new Date(Date.UTC(2000, 5, 21, 0, 0, 0)); // June 21, 2000
    const jd_tt = dateToJulian(date); // Approx 2451701.825 TT
    const lat = 80; // High northern latitude
    const lng = 0;
    const times = getTimes(jd_tt, lat, lng);

    // In Arctic summer, sun should not set
    expect(times.sunrise).toBeLessThan(times.sunset);
    expect(times.solarNoon).toBeDefined();
    // Sunrise should be before the start of the day, indicating always up
    expect(times.sunrise).toBeLessThan(jd_tt);
  });

  test("handles polar winter (always down) at 80°N on December 21, 2000", () => {
    const date = new Date(Date.UTC(2000, 11, 21, 0, 0, 0)); // December 21, 2000
    const jd_tt = dateToJulian(date); // Approx 2451885.5 TT
    const lat = 80;
    const lng = 0;
    const times = getTimes(jd_tt, lat, lng);

    // In Arctic winter, sun should not rise
    expect(times.sunset).toBeLessThan(times.sunrise);
    expect(times.nadir).toBeDefined();
    // Sunset should be before the day, indicating always down
    expect(times.sunset).toBeLessThan(jd_tt);
  });
});

describe("addTime and getTimes with custom events", () => {
  test("computes custom times correctly", () => {
    const date = new Date(Date.UTC(2000, 2, 20, 0, 0, 0));
    const jd_tt = dateToJulian(date);
    const lat = 51.48;
    const lng = 0;

    addTime(-20, "customRise", "customSet");
    const times = getTimes(jd_tt, lat, lng);

    expect(times.customRise).toBeDefined();
    expect(times.customSet).toBeDefined();
    expect(times.customRise).toBeLessThan(times.customSet);
    // Custom event at -20° should occur before sunrise (-0.833°)
    expect(times.customRise).toBeLessThan(times.sunrise);
    expect(times.customSet).toBeGreaterThan(times.sunset);
  });
});
