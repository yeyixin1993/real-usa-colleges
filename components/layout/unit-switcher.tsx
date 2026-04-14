'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { cn } from '@/lib/utils';

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition',
        active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100',
      )}
    >
      {children}
    </button>
  );
}

export function UnitSwitcher() {
  const { temperatureUnit, distanceUnit, setTemperatureUnit, setDistanceUnit } = useUnitPreference();

  return (
    <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/85 p-1 md:flex">
      <div className="inline-flex items-center rounded-full bg-slate-50 p-1">
        <Pill active={temperatureUnit === 'C'} onClick={() => setTemperatureUnit('C')}>
          °C
        </Pill>
        <Pill active={temperatureUnit === 'F'} onClick={() => setTemperatureUnit('F')}>
          °F
        </Pill>
      </div>
      <div className="inline-flex items-center rounded-full bg-slate-50 p-1">
        <Pill active={distanceUnit === 'km'} onClick={() => setDistanceUnit('km')}>
          km
        </Pill>
        <Pill active={distanceUnit === 'mi'} onClick={() => setDistanceUnit('mi')}>
          mi
        </Pill>
      </div>
    </div>
  );
}
