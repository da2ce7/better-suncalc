// types.ts

/**
 * This file defines TypeScript branded types for astronomical measurements.
 * It includes base branded types and composite templates for angles, coordinates,
 * time, distances, physical quantities, rates, and other specialized measurements.
 */

// ### Literal Types
// Define the allowed string literal values for various measurement categories.

type TimeUnit =
    | 'SECONDS'
    | 'MINUTES'
    | 'HOURS'
    | 'DAYS'
    | 'YEARS'
    | 'JULIAN_CENTURIES'
    | 'JULIAN_YEARS'
    | 'MILLISECONDS'
    | 'ORBITS'
type Timescale = 'TT' | 'TAI' | 'UTC' | 'GPS' | 'TDB' | 'SIDEREAL'
type AngleUnit =
    | 'Degrees'
    | 'Radians'
    | 'Arcminutes'
    | 'Arcseconds'
    | 'Microarcseconds'
    | 'Milliarcseconds'
    | 'Revolutions'
type DistanceUnit =
    | 'Meters'
    | 'Kilometers'
    | 'AstronomicalUnits'
    | 'Parsecs'
    | 'Kiloparsecs'
    | 'LightYears'
    | 'LightSeconds'
    | 'LunarDistances'
    | 'SolarRadii'
    | 'GravitationalRadii'
    | 'HubbleLengths'
    | 'WavelengthMeters'
type PhysicalUnit =
    | 'Kilograms'
    | 'SolarMasses'
    | 'EarthMasses'
    | 'JupiterMasses'
    | 'Joules'
    | 'Ergs'
    | 'kWh'
    | 'Kelvin'
    | 'keV'
    | 'Coulombs'
    | 'Tesla'
    | 'Hectopascal'
    | 'Janskys'
    | 'SolarLuminosity'
    | 'SolarIrradiance'
    | 'ElectronsPerCubicMeter'
    | 'ElementalChargeFlux'
    | 'Strain'
type Frame =
    | 'Altitude'
    | 'Azimuth'
    | 'Ecliptic'
    | 'Equatorial'
    | 'Galactic'
    | 'Horizontal'
    | 'Parallactic'
    | 'FocalPlane'
    | 'ITRF'
    | 'ICRF'
    | 'Selenographic'
    | 'GCRS'
type Epoch =
    | 'J2000'
    | 'B1950'
    | 'JulianEpoch'
    | 'ModifiedJulianEpoch'
    | 'UnixEpoch'
    | 'GPSEpoch'
    | 'TAIEpoch'
    | 'MeanOfDate'
    | 'IAU1958'
type Context = 'Geocentric' | 'Observed' | 'Mean'

// ### Base Brand Types
// Define branded types by adding phantom properties to primitives for type distinction.

type TimeUnitBrand<T, U extends TimeUnit> = T & { readonly _timeUnit: U }
type TimescaleBrand<T, TS extends Timescale> = T & { readonly _timescale: TS }
type AngleUnitBrand<T, U extends AngleUnit> = T & { readonly _angleUnit: U }
type DistanceUnitBrand<T, U extends DistanceUnit> = T & {
    readonly _distanceUnit: U
}
type PhysicalUnitBrand<T, U extends PhysicalUnit> = T & {
    readonly _physicalUnit: U
}
type FrameBrand<T, F extends Frame> = T & { readonly _frame: F }
type EpochBrand<T, E extends Epoch> = T & { readonly _epoch: E }
type ContextBrand<T, C extends Context> = T & { readonly _context: C }

// ### Composite Types

// #### Angles
// Angles combine angle units with reference frames.

type Angle<U extends AngleUnit, F extends Frame> = AngleUnitBrand<number, U> &
    FrameBrand<number, F>

export type Degrees = AngleUnitBrand<number, 'Degrees'>
export type Radians = AngleUnitBrand<number, 'Radians'>
export type Arcminutes = AngleUnitBrand<number, 'Arcminutes'>
export type Arcseconds = AngleUnitBrand<number, 'Arcseconds'>
export type Degrees_Altitude = Angle<'Degrees', 'Altitude'>
export type Degrees_Azimuth = Angle<'Degrees', 'Azimuth'>
export type Degrees_Ecliptic = Angle<'Degrees', 'Ecliptic'>
export type Degrees_Equatorial = Angle<'Degrees', 'Equatorial'>
export type Degrees_Galactic = Angle<'Degrees', 'Galactic'>
export type Degrees_Horizontal = Angle<'Degrees', 'Horizontal'>
export type Degrees_Parallactic = Angle<'Degrees', 'Parallactic'>
export type Radians_Altitude = Angle<'Radians', 'Altitude'>
export type Radians_Azimuth = Angle<'Radians', 'Azimuth'>
export type Radians_Ecliptic = Angle<'Radians', 'Ecliptic'>
export type Radians_Equatorial = Angle<'Radians', 'Equatorial'>
export type Radians_Galactic = Angle<'Radians', 'Galactic'>
export type Radians_Horizontal = Angle<'Radians', 'Horizontal'>
export type Radians_Parallactic = Angle<'Radians', 'Parallactic'>

// #### Coordinates
// Coordinate angles include units, frames, and epochs; some include contexts.

type CoordinateAngle<
    U extends AngleUnit,
    F extends Frame,
    E extends Epoch,
> = AngleUnitBrand<number, U> & FrameBrand<number, F> & EpochBrand<number, E>

export type Degrees_Ecliptic_J2000 = CoordinateAngle<
    'Degrees',
    'Ecliptic',
    'J2000'
>
export type Degrees_Ecliptic_MeanOfDate = CoordinateAngle<
    'Degrees',
    'Ecliptic',
    'MeanOfDate'
>
export type Degrees_Equatorial_Geocentric = Angle<'Degrees', 'Equatorial'> &
    ContextBrand<number, 'Geocentric'>
export type Degrees_Equatorial_Mean = Angle<'Degrees', 'Equatorial'> &
    ContextBrand<number, 'Mean'>
export type Degrees_Galactic_IAU1958 = Angle<'Degrees', 'Galactic'> &
    EpochBrand<number, 'IAU1958'>
export type Degrees_Horizontal_Observed = Angle<'Degrees', 'Horizontal'> &
    ContextBrand<number, 'Observed'>
export type Degrees_ICRF = Angle<'Degrees', 'ICRF'>
export type Coordinates_FocalPlane = [
    Angle<'Radians', 'FocalPlane'>,
    Angle<'Radians', 'FocalPlane'>,
]
export type Coordinates_ITRF = [
    Angle<'Degrees', 'ITRF'>,
    Angle<'Degrees', 'ITRF'>,
]

// #### Time and Dates
// Time measurements include epochs and durations with specific timescales.

export type Epoch_B1950 = EpochBrand<number, 'B1950'>
export type Epoch_J2000 = EpochBrand<number, 'J2000'>

type DurationSinceEpoch<
    U extends TimeUnit,
    TS extends Timescale,
    E extends Epoch,
> = Duration<U, TS> & EpochBrand<number, E>

type Duration<U extends TimeUnit, TS extends Timescale> = TimeUnitBrand<
    number,
    U
> &
    TimescaleBrand<number, TS>

export type HoursDuration = Duration<'HOURS', 'UTC'>
export type JulianCenturiesDuration = Duration<'JULIAN_CENTURIES', 'TT'>
export type JulianDaysDuration = Duration<'DAYS', 'TT'>
export type JulianYearsDuration = Duration<'JULIAN_YEARS', 'TT'>
export type MillisecondsDuration = Duration<'MILLISECONDS', 'UTC'>
export type MinutesDuration = Duration<'MINUTES', 'UTC'>
export type SecondsDuration = Duration<'SECONDS', 'UTC'>
export type SecondsDuration_GPS = Duration<'SECONDS', 'GPS'>
export type SecondsDuration_TAI = Duration<'SECONDS', 'TAI'>
export type SecondsDuration_TDB = Duration<'SECONDS', 'TDB'>
export type SecondsDuration_TT = Duration<'SECONDS', 'TT'>

export type AtomicSecondsSinceTAIEpoch = DurationSinceEpoch<
    'SECONDS',
    'TAI',
    'TAIEpoch'
>
export type CoordinatedDaysSinceModifiedJulianEpoch = DurationSinceEpoch<
    'DAYS',
    'UTC',
    'ModifiedJulianEpoch'
>
export type CoordinatedMillisecondsSinceUnixEpoch = DurationSinceEpoch<
    'MILLISECONDS',
    'UTC',
    'UnixEpoch'
>
export type CoordinatedSecondsSinceUnixEpoch = DurationSinceEpoch<
    'SECONDS',
    'UTC',
    'UnixEpoch'
>
export type GPSSecondsSinceGPSEpoch = DurationSinceEpoch<
    'SECONDS',
    'GPS',
    'GPSEpoch'
>
export type TerrestrialCenturiesSinceJ2000 = DurationSinceEpoch<
    'JULIAN_CENTURIES',
    'TT',
    'J2000'
>
export type TerrestrialDaysSinceJ2000 = DurationSinceEpoch<
    'DAYS',
    'TT',
    'J2000'
>
export type TerrestrialDaysSinceJulianEpoch = DurationSinceEpoch<
    'DAYS',
    'TT',
    'JulianEpoch'
>
export type UniversalDaysSinceJ2000 = DurationSinceEpoch<'DAYS', 'UTC', 'J2000'>
export type UniversalDaysSinceJulianEpoch = DurationSinceEpoch<
    'DAYS',
    'UTC',
    'JulianEpoch'
>

// #### Distances
// Distances are branded with specific units; RedshiftZ is dimensionless.

type Distance<U extends DistanceUnit> = DistanceUnitBrand<number, U>

export type AstronomicalUnits = Distance<'AstronomicalUnits'>
export type GravitationalRadii = Distance<'GravitationalRadii'>
export type HubbleLengths = Distance<'HubbleLengths'>
export type Kilometers = Distance<'Kilometers'>
export type Kiloparsecs = Distance<'Kiloparsecs'>
export type LightSeconds = Distance<'LightSeconds'>
export type LightTravelTimeSeconds = Distance<'LightSeconds'>
export type LightYears = Distance<'LightYears'>
export type LunarDistances = Distance<'LunarDistances'>
export type Meters = Distance<'Meters'>
export type Parsecs = Distance<'Parsecs'>
export type RedshiftZ = number & { _brand: 'RedshiftZ' }
export type SolarRadii = Distance<'SolarRadii'>
export type WavelengthMeters = Distance<'WavelengthMeters'>

// #### Physical Quantities
// Physical quantities are branded with specific units; some include frames or contexts.

type PhysicalQuantity<U extends PhysicalUnit> = PhysicalUnitBrand<number, U>

export type Coulombs = PhysicalQuantity<'Coulombs'>
export type EarthMasses = PhysicalQuantity<'EarthMasses'>
export type ElectronsPerCubicMeter = PhysicalQuantity<'ElectronsPerCubicMeter'>
export type ElementalChargeFlux = PhysicalQuantity<'ElementalChargeFlux'>
export type Ergs = PhysicalQuantity<'Ergs'>
export type Hectopascal = PhysicalQuantity<'Hectopascal'>
export type Janskys = PhysicalQuantity<'Janskys'>
export type Joules = PhysicalQuantity<'Joules'>
export type JupiterMasses = PhysicalQuantity<'JupiterMasses'>
export type Kelvin = PhysicalQuantity<'Kelvin'>
export type keV_Temperature = PhysicalQuantity<'keV'>
export type Kilograms = PhysicalQuantity<'Kilograms'>
export type kWh = PhysicalQuantity<'kWh'>
export type SolarIrradiance = PhysicalQuantity<'SolarIrradiance'>
export type SolarLuminosity = PhysicalQuantity<'SolarLuminosity'>
export type SolarMass = PhysicalQuantity<'SolarMasses'>
export type Strain = PhysicalQuantity<'Strain'>
export type Tesla = PhysicalQuantity<'Tesla'>

type Acceleration<
    DU extends DistanceUnit,
    TU extends TimeUnit,
> = DistanceUnitBrand<number, DU> & TimeUnitBrand<number, TU> & { _power: 2 }

export type MetersPerSecondSquared = Acceleration<'Meters', 'SECONDS'>
export type GCRS_Gravity = MetersPerSecondSquared & FrameBrand<number, 'GCRS'>

// #### Speeds and Velocities
// Speeds combine distance and time units.

type Speed<DU extends DistanceUnit, TU extends TimeUnit> = DistanceUnitBrand<
    number,
    DU
> &
    TimeUnitBrand<number, TU>

export type RedshiftVelocity = Speed<'Kilometers', 'SECONDS'>
export type AUPerSecond = Speed<'AstronomicalUnits', 'SECONDS'>
export type KilometersPerSecond = Speed<'Kilometers', 'SECONDS'>

// #### Relativity
// Relativity measurements include time per distance and dimensionless factors.

type TimePerDistance<
    TU extends TimeUnit,
    DU extends DistanceUnit,
> = TimeUnitBrand<number, TU> & DistanceUnitBrand<number, DU>

export type SecondsPerAstronomicalUnit = TimePerDistance<
    'SECONDS',
    'AstronomicalUnits'
>
export type TimeDilationFactor = number & { _brand: 'TimeDilationFactor' }

// #### Specialized Measurements
// Measurements specific to astronomical phenomena.

export type LunarLibrationAmplitude = Angle<'Degrees', 'Selenographic'>
export type SelenographicLatitude = Angle<'Degrees', 'Selenographic'>

// #### Dimensionless Quantities
// Quantities without units, branded for distinction.

type Dimensionless = number & { _brand: 'Dimensionless' }

export type DimensionlessRatio = Dimensionless
export type GeometricAlbedo = Dimensionless
export type IceMassFraction = Dimensionless
export type Metallicity = Dimensionless
export type ParsecsPerKilometer = DistanceUnitBrand<number, 'Parsecs'> &
    DistanceUnitBrand<number, 'Kilometers'>
export type PerJulianCentury = TimeUnitBrand<number, 'JULIAN_CENTURIES'>
export type PlasmaBeta = Dimensionless
export type FractionOfC = number & { _brand: 'FractionOfC' }

// #### Dynamics and Rates
// Rates combine units or use custom brands for specialized measurements.

export type PerDegreeCelsius = number & { _unit: 'PerDegreeCelsius' }
export type PerHectopascal = number & { _unit: 'PerHectopascal' }
export type CosmicRayFlux = number & { _brand: 'CosmicRayFlux' }
export type NeutrinoFluxRate = number & { _brand: 'NeutrinoFluxRate' }
export type SFRDensity = number & { _brand: 'SFRDensity' }

type EnergyRate<
    EU extends PhysicalUnit,
    TU extends TimeUnit,
> = PhysicalUnitBrand<number, EU> & TimeUnitBrand<number, TU>

export type keVPerSecond = EnergyRate<'keV', 'SECONDS'>
export type KilogramsPerSecond = PhysicalUnitBrand<number, 'Kilograms'> &
    TimeUnitBrand<number, 'SECONDS'>
export type SolarMassesPerYear = PhysicalUnitBrand<number, 'SolarMasses'> &
    TimeUnitBrand<number, 'YEARS'>

export type AtmospheresLossRate = number & { _brand: 'AtmospheresLossRate' }
export type DM_AnnihilationRate = number & { _brand: 'DM_AnnihilationRate' }
export type HubbleFlowRate = number & { _brand: 'HubbleFlowRate' }
export type MagnitudeDeclinePerMinute = number & {
    _brand: 'MagnitudeDeclinePerMinute'
}
export type MetallicityRate = number & { _brand: 'MetallicityRate' }
export type MetersCubedPerSecondSquared = DistanceUnitBrand<
    number,
    'Meters'
> & { _power: 3 } & TimeUnitBrand<number, 'SECONDS'> & { _power: 2 }
export type MillisecondsPerJulianCentury = TimeUnitBrand<
    number,
    'MILLISECONDS'
> &
    TimeUnitBrand<number, 'JULIAN_CENTURIES'>
export type SecondsPerOrbit = TimeUnitBrand<number, 'SECONDS'> & {
    _brand: 'PerOrbit'
}
export type R_sPerSecond = number & { _brand: 'R_sPerSecond' }
