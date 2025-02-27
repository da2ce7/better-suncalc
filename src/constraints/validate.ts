/**
 * @file constraints/validate.ts
 */

import { EARTH } from "./earth";
import { LUNAR } from "./lunar";
import { SOLAR } from "./sol";

// Verify key astronomical relationships
console.assert(
  EARTH.OBLIQUITY_J2000 === SOLAR.EPOCH_J2000.ECLIPTIC_OBLIQUITY,
  "Obliquity values must match between Earth and Solar models",
);

console.assert(
  LUNAR.VISIBILITY.ALTITUDE_THRESHOLD === 0.625,
  "Lunar visibility threshold must account for refraction + semi-diameter",
);
