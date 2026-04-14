'use client';

import ReactECharts from 'echarts-for-react';

import type { School } from '@/types/school';

export function ScoreComparisonChart({ schools }: { schools: School[] }) {
  return (
    <ReactECharts
      style={{ height: 360 }}
      option={{
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0, textStyle: { color: '#475569' } },
        grid: { left: 36, right: 16, top: 24, bottom: 56 },
        xAxis: {
          type: 'category',
          data: ['Climate', 'Demographics', 'Food', 'Life', 'Airport', 'Overall'],
          axisLabel: { color: '#64748b' },
          axisLine: { lineStyle: { color: '#cbd5e1' } },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: { color: '#64748b' },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
        },
        series: schools.map((school, index) => ({
          name: school.name,
          type: 'bar',
          barGap: 0,
          emphasis: { focus: 'series' },
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: ['#0f766e', '#1d4ed8', '#b45309', '#7c3aed'][index % 4],
          },
          data: [
            school.scores.climate,
            school.scores.demographics,
            school.scores.food,
            school.scores.life,
            school.scores.airport,
            school.scores.overall,
          ],
        })),
      }}
    />
  );
}
