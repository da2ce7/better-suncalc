/**
 * @file constraints/brands/index.ts
 * @module brands
 * @description Type-safe astronomical units through branded types.
 *
 * ## Naming Convention Standards
 *
 * 1. **Capitalization**: Pascal for for multi-word brands
 * 2. **Suffix Notation**:
 *    - `_TT` = Terrestrial Time
 *    - `_UT1` = Universal Time 1
 *    - `_UTC` = Coordinated Universal Time
 * 3. **Abbreviations**:
 *    - `AstronomicalUnits` = Astronomical Unit
 *    - `JD` = Julian Date
 *    - `MJD` = Modified Julian Date
 * 4. **Compound Units**:
 *    - `Per` separator: `DegreesPerHour`
 *    - `_` for multi-slash: `ElectronsPerCubicMeter`
 * 5. **Special Cases**:
 *    - `RedshiftZ` (dimensionless)
 *    - `PlasmaBeta` (unitless ratio)
 *
 * ## Complete Brand Catalog (155 types)
 *
 * ### Angular Systems (27 types)
 * - Angles: Degrees, Radians, Arcminutes, Arcseconds, Radians_Ecliptic, Radians_Equatorial,
 *   Radians_Galactic, Radians_Horizontal, Altitude, Azimuth, ParallacticAngle
 * - Rates: DegreesPerSecond, DegreesPerHour, DegreesPerJulianYear, DegreesPerJulianCentury,
 *   ArcsecondsPerYear, MilliarcsecondsPerYear, MicroarcsecondsPerYear, RadiansPerTTSecond, RevolutionsPerMinute,
 *   DegreesPerSecondSquared, RadiansPerSiderealDay, EclipticLongitudeRate,
 *   ArcsecondsPerOrbit, DegreesPerDay, DegreesPerDayTT, DegreesPerSiderealDay

 * ### Temporal Metrics (46 types)
 * - Epochs: J2000DateTT,J2000DateUT1,JulianDateTT,JulianDateUT1,ModifiedJulianDateUTC,UnixEpochSecondsUTC,
 *   UnixEpochMillisecondsUTC,BesselianEpoch,JulianEpoch,GPSTimeSeconds,TAISeconds,J2000CenturyDateTT
 * - Intervals: Milliseconds,Seconds,Minutes,Hours,TerrestrialDays,SiderealDays,JulianYear,
 *   JulianCentury,TT_Seconds,TAI_Seconds,TDB_Seconds,LightTravelTimeSeconds,GPS_Seconds,AUPerSecond,
 *   MillisecondsPerJulianCentury
 * - Rates: SolarMassesPerYear,KilometersPerSecond,FractionOfC,SecondsPerOrbit,R_sPerSecond,KilogramsPerSecond,
 *   DM_AnnihilationRate,MagnitudeDeclinePerMinute,SFRDensity,MetallicityRate,HubbleFlowRate,
 *   keVPerSecond,NeutrinoFluxRate,CosmicRayFlux,AtmospheresLossRate

 * ### Spatial Metrics (13 types)
 * - Distances: Meters,Kilometers,AstronomicalUnits,LightSeconds,LightYears,Parsecs,
 *   SolarRadii,LunarDistances,HubbleLengths,Kiloparsecs,RedshiftZ,GravitationalRadii,WavelengthMeters

 * ### Fundamental Physics (23 types)
 * - Mass/Energy: Kilograms,SolarMass,EarthMasses,JupiterMasses,Joules,Ergs,kWh
 * - Radiometry: SolarLuminosity, SolarIrradiance
 * - Thermodynamics: Kelvin,keV_Temperature,Hectopascal
 * - Dynamics: MetersPerSecondSquared, GCRS_Gravity
 * - E&M: Tesla,Coulombs,ElementalChargeFlux
 * - Others: Janskys,ElectronsPerCubicMeter,PlasmaBeta,Strain,Metallicity,IceMassFraction,RedshiftVelocity

 * ### Misc Physics (2 types)
 * - Volumetric Rates: MetersCubedPerSecondSquared
 * - Perspective Scaling: ParsecsPerKilometer

 * @example
 * // Import individual categories
 * import { Degrees, SolarMass } from './brands';
 *
 * // Import all brands (Tree-shaking recommended)
 * import * as AstroUnits from './brands';
 */

// Core exports maintain original file structure
export * from "./angles";
export * from "./angular-rates";
export * from "./dates";
export * from "./distances";
export * from "./other-rates";
export * from "./physical";
export * from "./temporal";
