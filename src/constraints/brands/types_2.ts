// ==========================
// === Primitive Literals ===
// ==========================

import { Brand } from '../types'
// (currently defined as)
// export type Brand<T, Tag> = { readonly _: Tag; value: T }

type TimeUnit = 'SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'YEARS' | 'JULIAN_CENTURIES' | 'JULIAN_YEARS' | 'MILLISECONDS'
type Timescale = 'TT' | 'TAI' | 'UTC' | 'GPS' | 'TDB' | 'SIDEREAL'
type AngleUnit = 'Degrees' | 'Radians' | 'Arcminutes' | 'Arcseconds' | 'Microarcseconds' | 'Milliarcseconds' | 'Revolutions'
type DistanceUnit = 'Meters' | 'Kilometers' | 'AstronomicalUnits' | 'Parsecs' | 'Kiloparsecs' | 'Megaparsecs' | 'LightYears' | 'LightSeconds' | 'LunarDistances' | 'SolarRadii' | 'GravitationalRadii' | 'HubbleLengths' | 'WavelengthMeters'
type PhysicalUnit = 'Kilograms' | 'SolarMasses' | 'EarthMasses' | 'JupiterMasses' | 'Joules' | 'Ergs' | 'kWh' | 'Kelvin' | 'keV' | 'Coulombs' | 'Tesla' | 'Hectopascal' | 'Janskys' | 'SolarLuminosity' | 'SolarIrradiance' | 'ElectronsPerCubicMeter' | 'ElementalChargeFlux' | 'Strain'
type FrameReference = 'Abstract' | 'SI' | 'IAU2012' | 'Altitude' | 'Azimuth' | 'Ecliptic' | 'Equatorial' | 'Galactic' | 'Horizontal' | 'Parallactic' | 'FocalPlane' | 'ITRF' | 'ICRF' | 'Selenographic' | 'GCRS' | 'ILRS2023' | `IAU2015`
type EpochReference = 'J2000' | 'B1950' | 'JulianEpoch' | 'ModifiedJulianEpoch' | 'UnixEpoch' | 'GPSEpoch' | 'TAIEpoch' | 'MeanOfDate' | 'IAU1958'
type ContextType = 'Geocentric' | 'Heliocentric' | 'Observed' | 'Mean'
type Classifier = 'Count' | 'RedshiftZ' | 'Orbit' | 'CosmicRayFlux' | 'NeutrinoFluxRate' | 'SFRDensity' | 'DM_AnnihilationRate' | 'HubbleFlowRate' | 'Magnitude' | 'Metallicity' | 'FractionOfC' | 'TimeDilationFactor' | 'GeometricAlbedo' | 'IceMassFraction'
type PhenomenonType = 'AtmosphericErosion' | 'DMA' | 'GammaRayBurst' | 'Supernova' | 'CosmicInflation' | 'MagnetosphericEjection'
type Exponent = 'InverseCubed' | 'InverseSquared' | `Inverse` | `Linear` | `Squared` | `Cubed`

// =========================
// === Base Constructors ===
// =========================

type ExponentBrand<T extends Exponent> = Brand<T, 'Exponent'>
type TemporalBrand<T extends TimeUnit> = Brand<T, 'Temporal'> //do not use directly, use `DurationBrand`
type TimescaleBrand<T extends Timescale> = Brand<T, 'Timescale'>
type SpatialBrand<T extends DistanceUnit> = Brand<T, 'Spatial'> //do not use directly, use `DistanceBrand`
type AngularBrand<T extends AngleUnit> = Brand<T, 'Angular'> //do not use directly, use `AngleBrand`
type PhysicalBrand<T extends PhysicalUnit> = Brand<T, 'Physical'>
type FrameBrand<T extends FrameReference> = Brand<T, 'Frame'>
type EpochBrand<T extends EpochReference> = Brand<T, 'Epoch'>
type ContextBrand<T extends ContextType> = Brand<T, 'Context'>
type CosmicPhenomenonBrand<T extends PhenomenonType> = Brand<T, 'PhenomenonType'>
type DimensionlessBrand<T extends Classifier> = Brand<T, 'Classifier'>
type AccumulatorBrand<T extends Classifier> = Brand<T, 'Classifier Accumulation'>

// ===========================
// === Common Constructors ===
// ===========================

type DurationBrand<T extends TimeUnit, TS extends Timescale> = TemporalBrand<T> & TimescaleBrand<TS>

type DistanceBrand<D extends DistanceUnit, F extends FrameReference> = SpatialBrand<D> & FrameBrand<F>

type AngleBrand<A extends AngleUnit, F extends FrameReference> = AngularBrand<A> & FrameBrand<F>

// ====================
// === Common Types ===
// ====================

type Duration = DurationBrand<TimeUnit, Timescale>

type Distance = DistanceBrand<DistanceUnit, FrameReference>

type Angle = AngleBrand<AngleUnit, FrameReference>

type Unit = PhysicalBrand<PhysicalUnit>

type Accumulator = AccumulatorBrand<Classifier>

type Classifiable = DimensionlessBrand<Classifier>

type Quantifiable = Unit | Duration | Distance | Angle | Accumulator

type Integrable = Angle | Distance | Duration

type Referenceable = EpochBrand<EpochReference>

// ==============================
// === Composite Constructors ===
// ==============================

type DimensionalComponent<Q extends Quantifiable, E extends Exponent> = {
    readonly quanta: Q
    readonly exponent: ExponentBrand<E>
}

type Dimensional = DimensionalComponent<Quantifiable, Exponent>

type AccumulationComponent<Q extends Quantifiable> = DimensionalComponent<Q, 'Linear'>

type Accumulation = AccumulationComponent<Quantifiable>

type RatioComponent<Num extends Dimensional, Denom extends Dimensional> = {
    readonly numerator: Num
    readonly denominator: Denom
}

type Ratio = RatioComponent<Dimensional, Dimensional>

type RatioRatio<Num extends Ratio | Dimensional, Denom extends Ratio | Dimensional> = {
    readonly numerator: Num
    readonly denominator: Denom
}

type AccumulationSince<Q extends Accumulation, R extends Referenceable> = {
    readonly count: Q
    readonly readonly: R
}

// =================================
// === Specialized Constructors ===
// =================================

type DurationSinceEpoch<T extends Duration, E extends EpochReference> = AccumulationSince<T, EpochBrand<E>>
type InversePhysicalUnit<Q extends PhysicalUnit> = DimensionalComponent<PhysicalBrand<Q>, 'Inverse'>

// generic
type Rate<Q extends Quantifiable, P extends Quantifiable> = RatioComponent<DimensionalComponent<Q, 'Linear'>, DimensionalComponent<P, 'Inverse'>>
type Acceleration<Q extends Quantifiable, P extends Quantifiable> = RatioComponent<DimensionalComponent<Q, 'Linear'>, DimensionalComponent<P, 'InverseSquared'>>
type CubedAcceleration<Q extends Quantifiable, P extends Quantifiable> = RatioComponent<DimensionalComponent<Q, 'Cubed'>, DimensionalComponent<P, 'InverseSquared'>>

// real
type RealRatio<Num extends Quantifiable, NumExp extends Exponent, Denom extends Integrable, DenomExp extends Exponent> = RatioComponent<DimensionalComponent<Num, NumExp>, DimensionalComponent<Denom, DenomExp>>
type RealRate<Q extends Quantifiable, P extends Integrable> = Rate<Q, P>
type RealAcceleration<Q extends Quantifiable, P extends Integrable> = Acceleration<Q, P>
type RealCubedAcceleration<Q extends Quantifiable, P extends Integrable> = CubedAcceleration<Q, P>

// temporal
type TemporalRatio<Num extends Quantifiable, NumExp extends Exponent, Denom extends Duration, DenomExp extends Exponent> = RealRatio<Num, NumExp, Denom, DenomExp>
type TemporalRate<Q extends Quantifiable, T extends Duration> = RealRate<Q, T>
type TemporalAcceleration<D extends Distance, T extends Duration> = RealAcceleration<D, T>
type TemporalVolumeAcceleration<D extends Distance, T extends Duration> = RealCubedAcceleration<D, T>

// angular-temporal
type AngularTemporalRatio<Num extends Angle, NumExp extends Exponent, Denom extends Duration, DenomExp extends Exponent> = TemporalRatio<Num, NumExp, Denom, DenomExp>
type AngularTemporalRate<A extends Angle, T extends Duration> = TemporalRate<A, T>
type AngularTemporalAcceleration<A extends Angle, T extends Duration> = RealAcceleration<A, T>

// =================================
// === Intersection Constructors ===
// =================================

type FramedQuantifiable<Q extends Quantifiable, F extends FrameReference> = Q & FrameBrand<F>

type EpochalAngle<A extends Angle, E extends EpochReference> = A & EpochBrand<E>

type TemporalCoordinate<A extends Angle, TS extends Timescale, E extends EpochReference> = A & TimescaleBrand<TS> & EpochBrand<E>

type ContextualCoordinate<A extends Angle, C extends ContextType> = A & ContextBrand<C>

// ========================
// === Applied Brands ===
// ========================

// Core abstract count
export type Count = AccumulationComponent<AccumulatorBrand<'Count'>>

// Core abstract ratio
export type DimensionlessRatio = RatioComponent<Count, Count>

// Base Angular Units (Abstract Frame)
export type Arcminutes = AngleBrand<'Arcminutes', 'Abstract'>
export type Arcseconds = AngleBrand<'Arcseconds', 'Abstract'>
export type Microarcseconds = AngleBrand<'Microarcseconds', 'Abstract'>
export type Degrees = AngleBrand<'Degrees', 'Abstract'>
export type Radians = AngleBrand<'Radians', 'Abstract'>
export type Revolutions = AngleBrand<'Revolutions', 'Abstract'>

// Degrees with Specific Frames
export type Degrees_Altitude = AngleBrand<'Degrees', 'Altitude'>
export type Degrees_Azimuth = AngleBrand<'Degrees', 'Azimuth'>
export type Degrees_Ecliptic = AngleBrand<'Degrees', 'Ecliptic'>
export type Degrees_Equatorial = AngleBrand<'Degrees', 'Equatorial'>
export type Degrees_Galactic = AngleBrand<'Degrees', 'Galactic'>
export type Degrees_Horizontal = AngleBrand<'Degrees', 'Horizontal'>
export type Degrees_Parallactic = AngleBrand<'Degrees', 'Parallactic'>
export type Degrees_FocalPlane = AngleBrand<'Degrees', 'FocalPlane'>
export type Degrees_ICRF = AngleBrand<'Degrees', 'ICRF'>

// Radians with Specific Frames
export type Radians_Altitude = AngleBrand<'Radians', 'Altitude'>
export type Radians_Azimuth = AngleBrand<'Radians', 'Azimuth'>
export type Radians_Ecliptic = AngleBrand<'Radians', 'Ecliptic'>
export type Radians_Equatorial = AngleBrand<'Radians', 'Equatorial'>
export type Radians_Galactic = AngleBrand<'Radians', 'Galactic'>
export type Radians_Horizontal = AngleBrand<'Radians', 'Horizontal'>
export type Radians_Parallactic = AngleBrand<'Radians', 'Parallactic'>
export type Radians_ICRF = AngleBrand<'Radians', 'ICRF'>

// Base Distance Units (Abstract Frame)
export type AstronomicalUnits_IAU2012 = DistanceBrand<'AstronomicalUnits', 'IAU2012'>
export type GravitationalRadii = DistanceBrand<'GravitationalRadii', 'Abstract'>
export type HubbleLengths = DistanceBrand<'HubbleLengths', 'Abstract'>
export type Kilometers = DistanceBrand<'Kilometers', 'SI'>
export type Kiloparsecs_IAU2012 = DistanceBrand<'Kiloparsecs', 'IAU2012'>
export type LightSeconds = DistanceBrand<'LightSeconds', 'SI'>
export type LightYears = DistanceBrand<'LightYears', 'SI'>
export type LunarDistances_ILRS2023 = DistanceBrand<'LunarDistances', 'ILRS2023'>
export type Meters = DistanceBrand<'Meters', 'SI'>
export type Parsecs_IAU2012 = DistanceBrand<'Parsecs', 'IAU2012'>
export type SolarRadii_IAU2015 = DistanceBrand<'SolarRadii', 'IAU2015'>

// Special Cases
export type RedshiftZ = DimensionlessBrand<'RedshiftZ'>
export type LightTravelTimeSeconds = DurationBrand<'SECONDS', 'TT'> // ⚠️ Likely a Time duration!

// ==========================
// === Temporal Durations ==
// ==========================

// Base durations with different timescales

export type MillisecondsDuration_TT = DurationBrand<'MILLISECONDS', 'TT'>
export type MillisecondsDuration_UTC = DurationBrand<'MILLISECONDS', 'UTC'> // New

export type MinutesDuration_TT = DurationBrand<'MINUTES', 'TT'>

export type HoursDuration_TT = DurationBrand<'HOURS', 'TT'>

export type SecondsDuration_TT = DurationBrand<'SECONDS', 'TT'>
export type SecondsDuration_UTC = DurationBrand<'SECONDS', 'UTC'>
export type SecondsDuration_GPS = DurationBrand<'SECONDS', 'GPS'>
export type SecondsDuration_TAI = DurationBrand<'SECONDS', 'TAI'>
export type SecondsDuration_TDB = DurationBrand<'SECONDS', 'TDB'>

export type DaysDuration_TT = DurationBrand<'DAYS', 'TT'>
export type DaysDuration_SIDEREAL = DurationBrand<'DAYS', 'SIDEREAL'>
export type DaysDuration_UTC = DurationBrand<'DAYS', 'UTC'>

export type JulianYearsDuration_TDB = DurationBrand<'JULIAN_YEARS', 'TDB'>

export type TerrestrialCenturiesDuration_TT = DurationBrand<'JULIAN_CENTURIES', 'TT'> // New
export type JulianCenturiesDuration_TDB = DurationBrand<'JULIAN_CENTURIES', 'TDB'>

// ==========================
// === Temporal Dates =======
// ==========================
export type AtomicSecondsSinceTAIEpoch = DurationSinceEpoch<SecondsDuration_TAI, 'TAIEpoch'>
export type CoordinatedDaysSinceModifiedJulianEpoch = DurationSinceEpoch<DaysDuration_UTC, 'ModifiedJulianEpoch'>
export type CoordinatedMillisecondsSinceUnixEpoch = DurationSinceEpoch<MillisecondsDuration_UTC, 'UnixEpoch'>
export type CoordinatedSecondsSinceUnixEpoch = DurationSinceEpoch<SecondsDuration_TT, 'UnixEpoch'>
export type GPSSecondsSinceGPSEpoch = DurationSinceEpoch<SecondsDuration_GPS, 'GPSEpoch'>
export type TerrestrialCenturiesSinceJ2000 = DurationSinceEpoch<TerrestrialCenturiesDuration_TT, 'J2000'>
export type TerrestrialDaysSinceJ2000 = DurationSinceEpoch<DaysDuration_TT, 'J2000'>
export type TerrestrialDaysSinceJulianEpoch = DurationSinceEpoch<DaysDuration_TT, 'JulianEpoch'>
export type UniversalDaysSinceJ2000 = DurationSinceEpoch<DaysDuration_UTC, 'J2000'>
export type UniversalDaysSinceJulianEpoch = DurationSinceEpoch<DaysDuration_UTC, 'JulianEpoch'>

// ======================
// === Angular Rates ====
// ======================

export type ArcsecondsPerOrbit = Rate<Arcseconds, AccumulatorBrand<'Orbit'>>

export type ArcsecondsPerYear = AngularTemporalRate<Arcseconds, JulianYearsDuration_TDB>

export type DegreesPerDay = AngularTemporalRate<Degrees, DaysDuration_UTC>
export type DegreesPerDayTT = AngularTemporalRate<Degrees, DaysDuration_TT>
export type DegreesPerHour = AngularTemporalRate<Degrees, HoursDuration_TT>

export type DegreesPerJulianCentury = AngularTemporalRate<Degrees, JulianCenturiesDuration_TDB>
export type DegreesPerJulianCenturySquared = AngularTemporalAcceleration<Degrees, JulianCenturiesDuration_TDB>
export type DegreesPerJulianCenturyCubed = AngularTemporalRatio<Degrees, 'Linear', JulianCenturiesDuration_TDB, 'InverseCubed'>

export type DegreesPerJulianYear = AngularTemporalRate<Degrees, JulianYearsDuration_TDB>

export type DegreesPerSecond = AngularTemporalRate<Degrees, SecondsDuration_TT>
export type DegreesPerSecondSquared = AngularTemporalAcceleration<Degrees, SecondsDuration_TT>

// Create required sidereal duration type
export type DegreesPerSiderealDay = AngularTemporalRate<Degrees, DaysDuration_SIDEREAL>

// Ecliptic frame rate
export type EclipticLongitudeRate = AngularTemporalRate<Degrees_Ecliptic, DaysDuration_TT>

export type MicroarcsecondsPerYear = AngularTemporalRate<Microarcseconds, JulianYearsDuration_TDB>
export type MilliarcsecondsPerYear = AngularTemporalRate<Microarcseconds, JulianYearsDuration_TDB>

// Radians rates
export type RadiansPerSiderealDay = AngularTemporalRate<Radians, DaysDuration_SIDEREAL>
export type RadiansPerTTSecond = AngularTemporalRate<Radians, SecondsDuration_TT>

// Revolution rate
export type RevolutionsPerMinute = AngularTemporalRate<Revolutions, MinutesDuration_TT>

// ===============================
// === Coordinate System Brands ===
// ===============================

// --- Focal Plane & ITRF Coordinates (Distance) ---
export type Meters_ITRF = DistanceBrand<'Meters', 'ITRF'>
export type Meters_GCRS = DistanceBrand<'Meters', 'GCRS'>

// --- Complex Epochal Angles ---
export type Degrees_Ecliptic_J2000 = EpochalAngle<Degrees_Ecliptic, 'J2000'>
export type Degrees_Ecliptic_MeanOfDate = EpochalAngle<Degrees_Ecliptic, 'MeanOfDate'>

// --- Contextual Angles ---
export type Degrees_Equatorial_Geocentric = ContextualCoordinate<Degrees_Equatorial, 'Geocentric'>
export type Degrees_Equatorial_Mean = ContextualCoordinate<Degrees_Equatorial, 'Mean'>

// --- Galactic/IERS Reference Systems ---
export type Degrees_Galactic_IAU1958 = EpochalAngle<Degrees_Galactic, 'IAU1958'>

// --- Observed Instantiation ---
export type Degrees_Horizontal_Observed = ContextualCoordinate<Degrees_Horizontal, 'Observed'>

// =========================
// === Physical Quantities ===
// =========================

// Fundamental SI units
export type Coulombs = PhysicalBrand<'Coulombs'>
export type Hectopascal = PhysicalBrand<'Hectopascal'>
export type Janskys = PhysicalBrand<'Janskys'>
export type Joules = PhysicalBrand<'Joules'>
export type Kelvin = PhysicalBrand<'Kelvin'>
export type Kilograms = PhysicalBrand<'Kilograms'>
export type Strain = PhysicalBrand<'Strain'>
export type Tesla = PhysicalBrand<'Tesla'>

// Astronomical mass units
export type EarthMasses = PhysicalBrand<'EarthMasses'>
export type JupiterMasses = PhysicalBrand<'JupiterMasses'>
export type SolarMass = PhysicalBrand<'SolarMasses'>

// Energy equivalents
export type Ergs = PhysicalBrand<'Ergs'>
export type kWh = PhysicalBrand<'kWh'>

// Radiation characterization
export type keV_Temperature = PhysicalBrand<'keV'>
export type SolarIrradiance = PhysicalBrand<'SolarIrradiance'>
export type SolarLuminosity = PhysicalBrand<'SolarLuminosity'>

// Plasma/cosmic parameters
export type ElectronsPerCubicMeter = PhysicalBrand<'ElectronsPerCubicMeter'>
export type ElementalChargeFlux = PhysicalBrand<'ElementalChargeFlux'>

// Derived gravitational units
export type GCRS_Gravity = TemporalAcceleration<Meters_GCRS, SecondsDuration_TT>

// Accelerative units
export type MetersPerSecondSquared = TemporalAcceleration<Meters, SecondsDuration_TT>

// =========================
// === Dynamics ===
// =========================

// Magnetohydrodynamics balance
export type PlasmaBeta = RatioComponent<DimensionalComponent<Hectopascal, 'Linear'>, DimensionalComponent<Tesla, 'Squared'>> // B^2 ∝ pressure

// Cosmic scaling relationships
export type ParsecsPerKilometer = RatioComponent<Parsecs_IAU2012, Kilometers>

// Ephemeris evolution rates
export type PerJulianCentury = DimensionalComponent<JulianCenturiesDuration_TDB, 'Inverse'>

// Environmental classifiers
export type PerDegreeCelsius = InversePhysicalUnit<'Kelvin'> // Δ°C ≡ ΔK
export type PerHectopascal = DimensionalComponent<Hectopascal, 'Inverse'>

// Astrophysical flux units (dimensionless classifiers)
export type CosmicRayFlux = DimensionlessBrand<'CosmicRayFlux'>
export type NeutrinoFluxRate = DimensionlessBrand<'NeutrinoFluxRate'>
export type SFRDensity = DimensionlessBrand<'SFRDensity'>

// ========================
// === Applied Rates ======
// ========================

// Energy rate in keV
export type keVPerSecond = TemporalRate<keV_Temperature, SecondsDuration_TT>

// Mass flow rate
export type KilogramsPerSecond = TemporalRate<Kilograms, SecondsDuration_TT>

// Stellar evolution rate (TDB timescale for astronomical consistency)
export type SolarMassesPerYear = TemporalRate<SolarMass, JulianYearsDuration_TDB>

// Pressure loss rate (example: exoplanet atmospheric loss)
export type AtmospheresLossRate = TemporalRate<Hectopascal, SecondsDuration_TT>

// Dark Matter interactions (modeled as dimensionless classifier)
export type DM_AnnihilationRate = DimensionlessBrand<'DM_AnnihilationRate'>

// Cosmic expansion rate (Hubble parameter indirect representation)
export type HubbleFlowRate = DimensionlessBrand<'HubbleFlowRate'>

// Magnitude declines (logarithmic brightness decrease over time)
export type MagnitudeDeclinePerMinute = TemporalRate<AccumulatorBrand<'Magnitude'>, MinutesDuration_TT>

// Metallicity change over time (stellar evolution contexts)
export type MetallicityRate = TemporalRate<AccumulatorBrand<'Metallicity'>, JulianYearsDuration_TDB>

// Volume per squared time (e.g., jerk-like quantities)
export type MetersCubedPerSecondSquared = TemporalRatio<Meters, 'Cubed', SecondsDuration_TT, 'InverseSquared'>

// Time ratios (e.g., long-term ephemeris calculations)
export type MillisecondsPerJulianCentury = TemporalRate<MillisecondsDuration_TT, JulianCenturiesDuration_TDB>

// Orbital mechanics relationships (period per cycle)
export type SecondsPerOrbit = Rate<SecondsDuration_TT, AccumulatorBrand<'Orbit'>>

// =======================
// === Velocity Metrics ===
// =======================

// Astronomical unit velocity
export type AUPerSecond = TemporalRate<AstronomicalUnits_IAU2012, SecondsDuration_TT>

// Relativistic speed indicator (pure ratio)
export type FractionOfC = DimensionlessBrand<'FractionOfC'>

// SI-derived velocity
export type KilometersPerSecond = TemporalRate<Kilometers, SecondsDuration_TT>

// Stellar radius velocity (used in accretion/outflow contexts)
export type R_sPerSecond = TemporalRate<SolarRadii_IAU2015, SecondsDuration_TT>

// ===========================
// === Relativity Metrics ===
// ===========================

// For spacetime geometry measurements
export type SecondsPerAstronomicalUnit = RatioComponent<DimensionalComponent<SecondsDuration_TT, 'Linear'>, DimensionalComponent<AstronomicalUnits_IAU2012, 'Linear'>> // For relativistic Shapiro delay calculations
export type TimeDilationFactor = DimensionlessBrand<'TimeDilationFactor'> // Gravitational vs kinematic time dilation

// ======================
// === Lunar Features ===
// ======================

// Angular libration component (patterned after Mars L_S)
export type LunarLibrationAmplitude = AngleBrand<'Arcminutes', 'Selenographic'>

// Positional coordinate (analog to geographic coordinates)
export type SelenographicLatitude = AngleBrand<'Degrees', 'Selenographic'>

// ==============================
// === Dimensionless Quantities =
// ==============================

// Astronomical reflectance
export type GeometricAlbedo = DimensionlessBrand<'GeometricAlbedo'>

// Cryogenic composition
export type IceMassFraction = DimensionlessBrand<'IceMassFraction'>

// Stellar composition
export type Metallicity = DimensionlessBrand<'Metallicity'>
