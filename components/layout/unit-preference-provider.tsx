'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  defaultDistanceUnit,
  defaultTemperatureUnit,
  type DistanceUnit,
  type TemperatureUnit,
} from '@/lib/units';
import type { Locale } from '@/types/school';

interface UnitPreferenceContextValue {
  temperatureUnit: TemperatureUnit;
  distanceUnit: DistanceUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
}

const UnitPreferenceContext = createContext<UnitPreferenceContextValue | null>(null);

export function UnitPreferenceProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(defaultTemperatureUnit(locale));
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(defaultDistanceUnit(locale));

  useEffect(() => {
    const savedTemp = window.localStorage.getItem('unit:temperature') as TemperatureUnit | null;
    const savedDistance = window.localStorage.getItem('unit:distance') as DistanceUnit | null;

    setTemperatureUnit(savedTemp ?? defaultTemperatureUnit(locale));
    setDistanceUnit(savedDistance ?? defaultDistanceUnit(locale));
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem('unit:temperature', temperatureUnit);
  }, [temperatureUnit]);

  useEffect(() => {
    window.localStorage.setItem('unit:distance', distanceUnit);
  }, [distanceUnit]);

  const value = useMemo(
    () => ({ temperatureUnit, distanceUnit, setTemperatureUnit, setDistanceUnit }),
    [distanceUnit, temperatureUnit],
  );

  return <UnitPreferenceContext.Provider value={value}>{children}</UnitPreferenceContext.Provider>;
}

export function useUnitPreference() {
  const context = useContext(UnitPreferenceContext);

  if (!context) {
    throw new Error('useUnitPreference must be used within UnitPreferenceProvider');
  }

  return context;
}
