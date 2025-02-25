# (better) SunCalc

## Changelog

#### 3.0.0 &da2ce7; Feb 25, 2025

- Update Branding to (better) SunCalc

#### 2.0.0 &andiling; May 14, 2024

- Migrate the codebase to TypeScript

#### 1.8.1 &andiling; Dec 07, 2018

- Nadir moved from past to future

#### 1.8.0 &mdash; Dec 22, 2016

- Improved precision of moonrise/moonset calculations.
- Added `parallacticAngle` calculation to `getMoonPosition`.
- Default to today's date in `getMoonIllumination`.
- Fixed incompatibility when using Browserify/Webpack together with a global AMD loader.

#### 1.7.0 &mdash; Nov 11, 2015

- Added `inUTC` argument to `getMoonTimes`.

#### 1.6.0 &mdash; Oct 27, 2014

- Added `SunCalc.getMoonTimes` for calculating moon rise and set times.

#### 1.5.1 &mdash; May 16, 2014

- Exposed `SunCalc.times` property with defined daylight times.
- Slightly improved `SunCalc.getTimes` performance.

#### 1.4.0 &mdash; Apr 10, 2014

- Added `phase` to `SunCalc.getMoonIllumination` results (moon phase).
- Switched from mocha to tape for tests.

#### 1.3.0 &mdash; Feb 21, 2014

- Added `SunCalc.getMoonIllumination` (in place of `getMoonFraction`) that returns an object with `fraction` and `angle`
  (angle of illuminated limb of the moon).

#### 1.2.0 &mdash; Mar 07, 2013

- Added `SunCalc.getMoonFraction` function that returns illuminated fraction of the moon.

#### 1.1.0 &mdash; Mar 06, 2013

- Added `SunCalc.getMoonPosition` function.
- Added nadir (darkest time of the day, middle of the night).
- Added tests.

#### 1.0.0 &mdash; Dec 07, 2011

- Published to NPM.
- Added `SunCalc.addTime` function.

#### 0.0.0 &mdash; Aug 25, 2011

- First commit.
