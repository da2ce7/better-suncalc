/*
  mooncalc.ts
  Contains functions to calculate moon position, illumination, and rise/set times using Julian Dates.
  All temporal parameters and results are in Terrestrial Time (TT) Julian days.
*/

import { LUNAR } from "./constraints/lunar";
import { AU_TO_KM, DEGREES_TO_RADIANS, PI } from "./constraints/math";
import { JULIAN_EPOCH_J2000 } from "./constraints/time";
import {
  Days,
  Degrees,
  Hours,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import { calculateLunarCoordinates } from "./mooncoords";
import { sunCoords } from "./suncalc";
import { computeHourAngleAtRef } from "./transits";
import {
  altitude,
  astroRefraction,
  azimuth,
  latitudeToRad,
  longitudeToRadWest,
} from "./utils";

/* ==================== Moon Types ==================== */

export type MoonPositionData = {
  azimuth: Radians;
  altitude: Radians;
  distance: number; // Ideally Kilometers
  parallacticAngle: Radians;
};

export type MoonIlluminationData = {
  fraction: number;
  phase: number;
  angle: Radians;
};

export type MoonTimesData = {
  rise?: JulianDayTT;
  set?: JulianDayTT;
  alwaysUp?: boolean;
  alwaysDown?: boolean;
};

/* ==================== Moon Calculations ==================== */

export function getMoonPosition(
  jd: JulianDayTT,
  lat: Degrees,
  lng: Degrees,
): MoonPositionData {
  const lw = longitudeToRadWest(lng) as Radians;
  const phi = latitudeToRad(lat) as Radians;
  const d = (jd - JULIAN_EPOCH_J2000) as Days;

  const coords = calculateLunarCoordinates(jd);
  const ra = coords.ra as Radians;
  const dec = coords.dec as Radians;

  const M = (DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d)) as Radians;
  const meanDist = (LUNAR.ORBIT.SEMI_MAJOR_AXIS * AU_TO_KM) as number;
  const variationCoeff = (LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE *
    meanDist) as number;
  const dist = (meanDist - variationCoeff * Math.cos(M)) as number;

  const H = computeHourAngleAtRef(jd, lw, ra) as Radians;
  let h = altitude(H, phi, dec) as Radians;
  const pa = Math.atan2(
    Math.sin(H),
    Math.tan(phi) * Math.cos(dec) - Math.sin(dec) * Math.cos(H),
  ) as Radians;

  h = (h + astroRefraction(h)) as Radians;

  return {
    azimuth: azimuth(H, phi, dec) as Radians,
    altitude: h,
    distance: dist,
    parallacticAngle: pa,
  };
}

export function getMoonIllumination(jd: JulianDayTT): MoonIlluminationData {
  const d = (jd - JULIAN_EPOCH_J2000) as Days;
  const s = sunCoords(jd);
  const mCoords = calculateLunarCoordinates(jd);
  const mRa = mCoords.ra as Radians;
  const mDec = mCoords.dec as Radians;

  const M = (DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d)) as Radians;
  const meanDist = (LUNAR.ORBIT.SEMI_MAJOR_AXIS * AU_TO_KM) as number;
  const variationCoeff = (LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE *
    meanDist) as number;
  const mDist = (meanDist - variationCoeff * Math.cos(M)) as number;

  const sdist = (1 * AU_TO_KM) as number;
  const phi = Math.acos(
    Math.sin(s.dec) * Math.sin(mDec) +
      Math.cos(s.dec) * Math.cos(mDec) * Math.cos(s.ra - mRa),
  ) as Radians;
  const inc = Math.atan2(
    sdist * Math.sin(phi),
    mDist - sdist * Math.cos(phi),
  ) as Radians;
  const angle = Math.atan2(
    Math.cos(s.dec) * Math.sin(s.ra - mRa),
    Math.sin(s.dec) * Math.cos(mDec) -
      Math.cos(s.dec) * Math.sin(mDec) * Math.cos(s.ra - mRa),
  ) as Radians;

  return {
    fraction: (1 + Math.cos(inc)) / 2,
    phase: 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / PI,
    angle: angle,
  };
}

export function getMoonTimes(
  startJD: JulianDayTT,
  lat: Degrees,
  lng: Degrees,
): MoonTimesData {
  const hc = (LUNAR.VISIBILITY.ALTITUDE_THRESHOLD *
    DEGREES_TO_RADIANS) as Radians;

  let previousAlt = (getMoonPosition(startJD, lat, lng).altitude -
    hc) as Radians;
  let rise: JulianDayTT | undefined, set: JulianDayTT | undefined;
  let extremumSign = 0;

  const HOURS_IN_DAY = 24 as Hours;
  const HALF_DAY = 12;

  for (let hour = 0; hour < HOURS_IN_DAY; hour++) {
    const currentTime = (startJD + hour / HOURS_IN_DAY) as JulianDayTT;
    const nextTime = (currentTime + 1 / HOURS_IN_DAY) as JulianDayTT;
    const nextAlt = (getMoonPosition(nextTime, lat, lng).altitude -
      hc) as Radians;

    if (Math.sign(previousAlt) === Math.sign(nextAlt)) {
      previousAlt = nextAlt;
      continue;
    }

    const x1 = hour;
    const x2 = hour + 1;
    const y1 = previousAlt;
    const y2 = nextAlt;
    const a = ((y1 + y2) / 2 -
      getMoonPosition(
        (startJD + (hour + HALF_DAY) / HOURS_IN_DAY) as JulianDayTT,
        lat,
        lng,
      ).altitude) as Radians;
    const b = (y2 - y1) as Radians;

    const xe = -b / (2 * a);
    const ye = ((a * xe + b) * xe + y1) as Radians;

    if (Math.abs(xe) <= 1) {
      const crossTime = (startJD + (hour + xe) / HOURS_IN_DAY) as JulianDayTT;
      if (previousAlt < 0) {
        if (!rise) rise = crossTime;
        else set = crossTime;
      } else {
        if (!set) set = crossTime;
        else rise = crossTime;
      }
    }

    if (Math.abs(ye) > Math.abs(extremumSign)) {
      extremumSign = ye;
    }

    previousAlt = nextAlt;
  }

  const result: MoonTimesData = {};
  if (rise !== undefined) result.rise = rise;
  if (set !== undefined) result.set = set;

  if (rise === undefined && set === undefined) {
    result[extremumSign > 0 ? "alwaysUp" : "alwaysDown"] = true;
  }

  return result;
}
