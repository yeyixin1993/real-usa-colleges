'use client';

import ReactECharts from 'echarts-for-react';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { convertTemperature } from '@/lib/units';
import type { MonthlyClimate } from '@/types/school';

export function TemperatureChart({ data }: { data: MonthlyClimate[] }) {
  const { temperatureUnit } = useUnitPreference();

  const chartData = data.map((item) => ({
    month: item.month,
    high: Number(convertTemperature(item.highF, temperatureUnit).toFixed(1)),
    low: Number(convertTemperature(item.lowF, temperatureUnit).toFixed(1)),
  }));

  return (
    <ReactECharts
      style={{ height: 320 }}
      option={{
        animationDuration: 500,
        tooltip: { trigger: 'axis' },
        grid: { left: 36, right: 18, top: 24, bottom: 28 },
        legend: { top: 0, textStyle: { color: '#475569' } },
        xAxis: {
          type: 'category',
          data: chartData.map((item) => item.month),
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisLabel: { color: '#64748b' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: `{value}°${temperatureUnit}`, color: '#64748b' },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
        },
        series: [
          {
            name: 'High',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            lineStyle: { width: 3, color: '#0f766e' },
            areaStyle: { color: 'rgba(15, 118, 110, 0.08)' },
            data: chartData.map((item) => item.high),
          },
          {
            name: 'Low',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            lineStyle: { width: 3, color: '#1d4ed8' },
            areaStyle: { color: 'rgba(29, 78, 216, 0.06)' },
            data: chartData.map((item) => item.low),
          },
        ],
      }}
    />
  );
}
