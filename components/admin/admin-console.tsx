'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MobilityProfile } from '@/types/mobility';
import type { ScoringConfig } from '@/types/scoring';
import type { AccessibilityPoint, AirportMetricKey, Grade, School, ScoreKey, VerificationGroup } from '@/types/school';

type SchoolListItem = Pick<School, 'slug' | 'name' | 'city' | 'state'>;

const verificationGroupLabels: Record<VerificationGroup, string> = {
  climateDetails: 'Climate details（降水 / 降雪 / 湿度）',
  convenience: 'Convenience（附近地点 / 路线 / Uber 可用性）',
  airport: 'Airport（机场 / 距离 / 行程时间）',
  scores: 'Scores（各项评分）',
};

function NumberInput({ value, onChange, step = '0.1' }: { value?: number | null; onChange: (v: number) => void; step?: string }) {
  return (
    <input
      type="number"
      step={step}
      value={typeof value === 'number' && Number.isFinite(value) ? value : ''}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
    />
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
    />
  );
}

function validWeightGroup(values: number[]) {
  return values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)
    && Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) < 0.0001;
}

export function AdminConsole({ locale, authenticated }: { locale: string; authenticated: boolean }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [draft, setDraft] = useState<School | null>(null);
  const [mobilityDraft, setMobilityDraft] = useState<Partial<MobilityProfile> | null>(null);
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const scoreKeys: ScoreKey[] = ['overall', 'climate', 'demographics', 'food', 'life', 'airport'];

  useEffect(() => {
    if (!authenticated) return;

    const run = async () => {
      const response = await fetch('/api/admin/schools', { cache: 'no-store' });
      if (!response.ok) {
        setError('加载学校列表失败。');
        return;
      }
      const data = (await response.json()) as { schools: School[] };
      const list = data.schools.map((item) => ({ slug: item.slug, name: item.name, city: item.city, state: item.state }));
      setSchools(list);
      if (list.length > 0) setSelectedSlug((current) => current || list[0].slug);
    };

    run();
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || !selectedSlug) return;

    const run = async () => {
      const response = await fetch(`/api/admin/schools/${selectedSlug}`, { cache: 'no-store' });
      if (!response.ok) {
        setError('加载学校详情失败。');
        return;
      }
      const data = (await response.json()) as { school: School };
      setDraft(data.school);
    };

    run();
  }, [authenticated, selectedSlug]);

  useEffect(() => {
    if (!authenticated) return;

    const run = async () => {
      const response = await fetch('/api/admin/scoring-config', { cache: 'no-store' });
      if (!response.ok) return;
      const data = (await response.json()) as { config: ScoringConfig };
      setScoringConfig(data.config);
    };

    run();
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || !selectedSlug) return;

    const run = async () => {
      const response = await fetch(`/api/admin/mobility/${selectedSlug}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = (await response.json()) as { mobility: Partial<MobilityProfile> };
      setMobilityDraft(data.mobility);
    };

    run();
  }, [authenticated, selectedSlug]);

  const allPoints = useMemo(() => {
    if (!draft) return [] as Array<{ group: 'food' | 'life'; key: string; value: AccessibilityPoint }>;
    const food = Object.entries(draft.foodConvenience).map(([key, value]) => ({ group: 'food' as const, key, value }));
    const life = Object.entries(draft.lifeConvenience).map(([key, value]) => ({ group: 'life' as const, key, value }));
    return [...food, ...life];
  }, [draft]);

  async function login() {
    setError(null);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      setError('登录失败，请检查用户名或密码。');
      return;
    }

    window.location.href = `/${locale}/admin`;
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = `/${locale}/admin`;
  }

  function updatePoint(group: 'food' | 'life', key: string, patch: Partial<AccessibilityPoint>) {
    if (!draft) return;

    if (group === 'food') {
      setDraft({
        ...draft,
        foodConvenience: {
          ...draft.foodConvenience,
          [key]: {
            ...draft.foodConvenience[key as keyof typeof draft.foodConvenience],
            ...patch,
          },
        },
      });
      return;
    }

    setDraft({
      ...draft,
      lifeConvenience: {
        ...draft.lifeConvenience,
        [key]: {
          ...draft.lifeConvenience[key as keyof typeof draft.lifeConvenience],
          ...patch,
        },
      },
    });
  }

  function updateScoreGrade(key: ScoreKey, grade: Grade | '') {
    if (!draft) return;

    const nextGrades = { ...(draft.scoreGrades ?? {}) };
    if (!grade) {
      delete nextGrades[key];
    } else {
      nextGrades[key] = grade;
    }

    setDraft({
      ...draft,
      scoreGrades: nextGrades,
    });
  }

  function updateFieldSource(
    section: VerificationGroup,
    key: 'label' | 'url' | 'checkedAt' | 'notes',
    value: string,
  ) {
    if (!draft) return;
    setDraft({
      ...draft,
      fieldSources: {
        ...(draft.fieldSources ?? {}),
        [section]: {
          label: draft.fieldSources?.[section]?.label ?? '',
          url: draft.fieldSources?.[section]?.url ?? '',
          ...(draft.fieldSources?.[section] ?? {}),
          [key]: value,
        },
      },
    });
  }

  function updateAirportMetricSource(metric: AirportMetricKey, key: 'label' | 'url' | 'checkedAt', value: string) {
    if (!draft) return;
    const current = draft.airportAccess.metricSources?.[metric];
    setDraft({
      ...draft,
      airportAccess: {
        ...draft.airportAccess,
        metricSources: {
          ...(draft.airportAccess.metricSources ?? {}),
          [metric]: { label: current?.label ?? '', url: current?.url ?? '', checkedAt: current?.checkedAt, [key]: value },
        },
      },
    });
  }

  async function save() {
    if (!draft) return;
    if (scoringConfig && !validWeightGroup(Object.values(scoringConfig.rankingWeights))) {
      setStatus('冷 / 村 / 白三个排名权重必须都在 0–1 之间，且合计为 1.00。');
      return;
    }
    if (scoringConfig && !validWeightGroup(Object.values(scoringConfig.coldRankingWeights))) {
      setStatus('1 月低温 / 年降雪量两个冷排名权重必须都在 0–1 之间，且合计为 1.00。');
      return;
    }
    setSaving(true);
    setStatus(null);

    const response = await fetch(`/api/admin/schools/${draft.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      setSaving(false);
      setStatus('保存失败，请稍后重试。');
      return;
    }

    if (mobilityDraft) {
      const mobilityResponse = await fetch(`/api/admin/mobility/${draft.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mobilityDraft),
      });

      if (!mobilityResponse.ok) {
        setSaving(false);
        setStatus('Mobility 保存失败，请稍后重试。');
        return;
      }
    }

    if (scoringConfig) {
      const configResponse = await fetch('/api/admin/scoring-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoringConfig),
      });

      if (!configResponse.ok) {
        const configError = await configResponse.json().catch(() => null) as { error?: string } | null;
        setSaving(false);
        setStatus(configError?.error ?? '评分常量保存失败，请稍后重试。');
        return;
      }
    }

    setSaving(false);

    setStatus('保存成功。');
  }

  if (!authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>后台登录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-slate-600">用户名</p>
            <TextInput value={username} onChange={setUsername} />
          </div>
          <div>
            <p className="mb-2 text-sm text-slate-600">密码</p>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button onClick={login}>登录</Button>
          <p className="text-xs text-slate-500">默认用户名：admin，默认密码：admin</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-slate-950">学校数据后台编辑</h1>
        <Button variant="secondary" onClick={logout}>
          退出登录
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-2 text-sm text-slate-600">选择学校</p>
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            >
              {schools.map((school) => (
                <option key={school.slug} value={school.slug}>
                  {school.name} ({school.city}, {school.state})
                </option>
              ))}
            </select>
          </div>
          <Button onClick={save} disabled={!draft || saving}>
            {saving ? '保存中...' : '保存修改'}
          </Button>
        </CardContent>
      </Card>

      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {draft ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>数据核实来源（填写来源名称和网址后，前台显示“已核实”）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {(['climateDetails', 'convenience', 'airport', 'scores'] as const).map((section) => (
                <div key={section} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-3">
                  <p className="font-medium text-slate-800">{verificationGroupLabels[section]}</p>
                  <div>
                    <p className="mb-1 text-xs text-slate-500">Source label</p>
                    <TextInput value={draft.fieldSources?.[section]?.label ?? ''} onChange={(value) => updateFieldSource(section, 'label', value)} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500">Source URL</p>
                    <TextInput value={draft.fieldSources?.[section]?.url ?? ''} onChange={(value) => updateFieldSource(section, 'url', value)} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500">Checked date (YYYY-MM-DD)</p>
                    <TextInput value={draft.fieldSources?.[section]?.checkedAt ?? ''} onChange={(value) => updateFieldSource(section, 'checkedAt', value)} />
                  </div>
                  <div className="md:col-span-2">
                    <p className="mb-1 text-xs text-slate-500">Notes / method</p>
                    <TextInput value={draft.fieldSources?.[section]?.notes ?? ''} onChange={(value) => updateFieldSource(section, 'notes', value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>基本信息 / 摘要</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-slate-600">学校名</p>
                <TextInput value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">城市</p>
                <TextInput value={draft.city} onChange={(value) => setDraft({ ...draft, city: value })} />
              </div>
              <div className="md:col-span-2">
                <p className="mb-2 text-sm text-slate-600">摘要（中文）</p>
                <textarea
                  value={draft.summary.zh}
                  onChange={(event) => setDraft({ ...draft, summary: { ...draft.summary, zh: event.target.value } })}
                  className="min-h-[84px] w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>分数与等级（Overall / Climate / Airport 等）</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scoreKeys.map((key) => (
                <div key={key} className="rounded-2xl border border-slate-200 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">{key}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Score</p>
                      <NumberInput value={draft.scores[key]} onChange={(v) => setDraft({ ...draft, scores: { ...draft.scores, [key]: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Grade override（留空=自动）</p>
                      <select
                        value={draft.scoreGrades?.[key] ?? ''}
                        onChange={(event) => updateScoreGrade(key, event.target.value as Grade | '')}
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                      >
                        <option value="">Auto</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>气候（Climate）</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 text-sm text-slate-600">年降水（英寸）</p>
                <NumberInput value={draft.climate.annualPrecipitationIn} onChange={(v) => setDraft({ ...draft, climate: { ...draft.climate, annualPrecipitationIn: v } })} />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">年降雪（英寸）</p>
                <NumberInput value={draft.climate.annualSnowfallIn} onChange={(v) => setDraft({ ...draft, climate: { ...draft.climate, annualSnowfallIn: v } })} />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">湿度等级</p>
                <select
                  value={draft.climate.humidityBand}
                  onChange={(event) => setDraft({ ...draft, climate: { ...draft.climate, humidityBand: event.target.value as School['climate']['humidityBand'] } })}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                >
                  <option value="Dry">Dry</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Humid">Humid</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>人口结构（校内 + 30英里）</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">Campus</p>
                <div>
                  <p className="mb-2 text-xs text-slate-500">White</p>
                  <NumberInput value={draft.demographics.campus.white} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, campus: { ...draft.demographics.campus, white: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Black</p>
                  <NumberInput value={draft.demographics.campus.black} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, campus: { ...draft.demographics.campus, black: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Hispanic/Latino</p>
                  <NumberInput value={draft.demographics.campus.hispanicLatino} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, campus: { ...draft.demographics.campus, hispanicLatino: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Asian</p>
                  <NumberInput value={draft.demographics.campus.asian} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, campus: { ...draft.demographics.campus, asian: v } } })} step="1" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">Within 30 miles</p>
                <div>
                  <p className="mb-2 text-xs text-slate-500">White</p>
                  <NumberInput value={draft.demographics.area30mi.white} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, area30mi: { ...draft.demographics.area30mi, white: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Black</p>
                  <NumberInput value={draft.demographics.area30mi.black} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, area30mi: { ...draft.demographics.area30mi, black: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Hispanic/Latino</p>
                  <NumberInput value={draft.demographics.area30mi.hispanicLatino} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, area30mi: { ...draft.demographics.area30mi, hispanicLatino: v } } })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Asian</p>
                  <NumberInput value={draft.demographics.area30mi.asian} onChange={(v) => setDraft({ ...draft, demographics: { ...draft.demographics, area30mi: { ...draft.demographics.area30mi, asian: v } } })} step="1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>机场便利度</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-slate-600">机场名称</p>
                <TextInput value={draft.airportAccess.airportName} onChange={(value) => setDraft({ ...draft, airportAccess: { ...draft.airportAccess, airportName: value } })} />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">距离（英里）</p>
                <NumberInput value={draft.airportAccess.distanceMiles} onChange={(v) => setDraft({ ...draft, airportAccess: { ...draft.airportAccess, distanceMiles: v } })} />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">开车时间（分钟）</p>
                <NumberInput value={draft.airportAccess.driveMinutes} onChange={(v) => setDraft({ ...draft, airportAccess: { ...draft.airportAccess, driveMinutes: v } })} step="1" />
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-600">公共交通（分钟，可空）</p>
                <input
                  value={draft.airportAccess.publicTransitMinutes ?? ''}
                  onChange={(event) => {
                    const value = event.target.value.trim();
                    setDraft({ ...draft, airportAccess: { ...draft.airportAccess, publicTransitMinutes: value === '' ? null : Number(value) } });
                  }}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <p className="text-sm font-medium text-slate-700">逐项核实来源（只标记对应指标）</p>
                {(['airport', 'distance', 'drive', 'transit', 'connectivity'] as const).map((metric) => (
                  <div key={metric} className="grid gap-3 rounded-2xl border border-slate-200 p-3 md:grid-cols-[0.6fr_1fr_1fr_0.7fr]">
                    <p className="text-sm font-medium text-slate-700">{metric}</p>
                    <TextInput value={draft.airportAccess.metricSources?.[metric]?.label ?? ''} onChange={(value) => updateAirportMetricSource(metric, 'label', value)} />
                    <TextInput value={draft.airportAccess.metricSources?.[metric]?.url ?? ''} onChange={(value) => updateAirportMetricSource(metric, 'url', value)} />
                    <TextInput value={draft.airportAccess.metricSources?.[metric]?.checkedAt ?? ''} onChange={(value) => updateAirportMetricSource(metric, 'checkedAt', value)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {mobilityDraft ? (
            <Card>
              <CardHeader>
                <CardTitle>Mobility（Uber/Transit/Walkability）</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm text-slate-600">Mobility source label（与网址均填写后标记“已核实”）</p>
                  <TextInput value={mobilityDraft.source?.label ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, source: { label: value, url: mobilityDraft.source?.url ?? '', checkedAt: mobilityDraft.source?.checkedAt } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Mobility source URL（用户可在前台打开核对）</p>
                  <TextInput value={mobilityDraft.source?.url ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, source: { label: mobilityDraft.source?.label ?? '', url: value, checkedAt: mobilityDraft.source?.checkedAt } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Mobility checked date</p>
                  <TextInput value={mobilityDraft.source?.checkedAt ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, source: { label: mobilityDraft.source?.label ?? '', url: mobilityDraft.source?.url ?? '', checkedAt: value } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber availability source label</p>
                  <TextInput value={mobilityDraft.uberAvailabilitySource?.label ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, uberAvailabilitySource: { label: value, url: mobilityDraft.uberAvailabilitySource?.url ?? '', checkedAt: mobilityDraft.uberAvailabilitySource?.checkedAt } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber availability source URL</p>
                  <TextInput value={mobilityDraft.uberAvailabilitySource?.url ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, uberAvailabilitySource: { label: mobilityDraft.uberAvailabilitySource?.label ?? '', url: value, checkedAt: mobilityDraft.uberAvailabilitySource?.checkedAt } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber availability checked date</p>
                  <TextInput value={mobilityDraft.uberAvailabilitySource?.checkedAt ?? ''} onChange={(value) => setMobilityDraft({ ...mobilityDraft, uberAvailabilitySource: { label: mobilityDraft.uberAvailabilitySource?.label ?? '', url: mobilityDraft.uberAvailabilitySource?.url ?? '', checkedAt: value } })} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Location type</p>
                  <select
                    value={mobilityDraft.location_type ?? ''}
                    onChange={(event) => setMobilityDraft({ ...mobilityDraft, location_type: event.target.value as MobilityProfile['location_type'] })}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                  >
                    <option value="">—</option>
                    <option value="urban">urban</option>
                    <option value="suburban">suburban</option>
                    <option value="rural">rural</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber tier</p>
                  <select
                    value={mobilityDraft.uber_tier ?? ''}
                    onChange={(event) => setMobilityDraft({ ...mobilityDraft, uber_tier: event.target.value as MobilityProfile['uber_tier'] })}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                  >
                    <option value="">—</option>
                    <option value="tier_1">tier_1</option>
                    <option value="tier_2">tier_2</option>
                    <option value="tier_3">tier_3</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber wait (day, min)</p>
                  <NumberInput value={mobilityDraft.uber_wait_time_day} onChange={(v) => setMobilityDraft({ ...mobilityDraft, uber_wait_time_day: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber wait (night, min)</p>
                  <NumberInput value={mobilityDraft.uber_wait_time_night} onChange={(v) => setMobilityDraft({ ...mobilityDraft, uber_wait_time_night: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Uber Eats score</p>
                  <NumberInput value={mobilityDraft.uber_eats_score} onChange={(v) => setMobilityDraft({ ...mobilityDraft, uber_eats_score: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Public transit score</p>
                  <NumberInput value={mobilityDraft.public_transit_score} onChange={(v) => setMobilityDraft({ ...mobilityDraft, public_transit_score: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Walkability score</p>
                  <NumberInput value={mobilityDraft.walkability_score} onChange={(v) => setMobilityDraft({ ...mobilityDraft, walkability_score: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Car dependency score</p>
                  <NumberInput value={mobilityDraft.car_dependency_score} onChange={(v) => setMobilityDraft({ ...mobilityDraft, car_dependency_score: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Mobility score（可手动覆盖）</p>
                  <NumberInput value={mobilityDraft.mobility_score} onChange={(v) => setMobilityDraft({ ...mobilityDraft, mobility_score: v })} step="1" />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-600">Mobility grade</p>
                  <select
                    value={mobilityDraft.mobility_grade ?? ''}
                    onChange={(event) => setMobilityDraft({ ...mobilityDraft, mobility_grade: event.target.value as MobilityProfile['mobility_grade'] })}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                  >
                    <option value="">—</option>
                    {(['A', 'B', 'C', 'D', 'F'] as const).map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm text-slate-600">Tags（逗号分隔）</p>
                  <TextInput
                    value={(mobilityDraft.tags ?? []).join(', ')}
                    onChange={(value) =>
                      setMobilityDraft({
                        ...mobilityDraft,
                        tags: value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm text-slate-600">Summary</p>
                  <textarea
                    value={mobilityDraft.summary ?? ''}
                    onChange={(event) => setMobilityDraft({ ...mobilityDraft, summary: event.target.value })}
                    className="min-h-[84px] w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          {scoringConfig ? (
            <Card>
              <CardHeader>
                <CardTitle>评分与排名常量（可后台修改）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">冷村白综合排名权重</p>
                    <p className="mt-1 text-xs text-slate-500">输入 0–1 的小数；三项合计必须为 1.00。排名页会在下一次打开时使用新权重。</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">冷百分位（默认 0.40）</p>
                      <NumberInput value={scoringConfig.rankingWeights.cold} onChange={(v) => setScoringConfig({ ...scoringConfig, rankingWeights: { ...scoringConfig.rankingWeights, cold: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">村百分位（默认 0.35）</p>
                      <NumberInput value={scoringConfig.rankingWeights.village} onChange={(v) => setScoringConfig({ ...scoringConfig, rankingWeights: { ...scoringConfig.rankingWeights, village: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">白人占比百分位（默认 0.25）</p>
                      <NumberInput value={scoringConfig.rankingWeights.white} onChange={(v) => setScoringConfig({ ...scoringConfig, rankingWeights: { ...scoringConfig.rankingWeights, white: v } })} step="0.01" />
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${validWeightGroup(Object.values(scoringConfig.rankingWeights)) ? 'text-emerald-700' : 'text-rose-700'}`}>
                    当前合计：{Object.values(scoringConfig.rankingWeights).reduce((sum, value) => sum + value, 0).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">冷排名内部权重</p>
                    <p className="mt-1 text-xs text-slate-500">气温越低分越高，降雪越多分越高；两项合计必须为 1.00。</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">1 月月均最低气温（默认 0.50）</p>
                      <NumberInput value={scoringConfig.coldRankingWeights.januaryTemperature} onChange={(v) => setScoringConfig({ ...scoringConfig, coldRankingWeights: { ...scoringConfig.coldRankingWeights, januaryTemperature: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">年降雪量（默认 0.50）</p>
                      <NumberInput value={scoringConfig.coldRankingWeights.annualSnowfall} onChange={(v) => setScoringConfig({ ...scoringConfig, coldRankingWeights: { ...scoringConfig.coldRankingWeights, annualSnowfall: v } })} step="0.01" />
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${validWeightGroup(Object.values(scoringConfig.coldRankingWeights)) ? 'text-emerald-700' : 'text-rose-700'}`}>
                    当前合计：{Object.values(scoringConfig.coldRankingWeights).reduce((sum, value) => sum + value, 0).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">学校分数等级阈值（A/B/C/D）</p>
                  <div className="grid gap-3 md:grid-cols-4">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">A</p>
                      <NumberInput value={scoringConfig.schoolGradeThresholds.A} onChange={(v) => setScoringConfig({ ...scoringConfig, schoolGradeThresholds: { ...scoringConfig.schoolGradeThresholds, A: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">B</p>
                      <NumberInput value={scoringConfig.schoolGradeThresholds.B} onChange={(v) => setScoringConfig({ ...scoringConfig, schoolGradeThresholds: { ...scoringConfig.schoolGradeThresholds, B: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">C</p>
                      <NumberInput value={scoringConfig.schoolGradeThresholds.C} onChange={(v) => setScoringConfig({ ...scoringConfig, schoolGradeThresholds: { ...scoringConfig.schoolGradeThresholds, C: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">D</p>
                      <NumberInput value={scoringConfig.schoolGradeThresholds.D} onChange={(v) => setScoringConfig({ ...scoringConfig, schoolGradeThresholds: { ...scoringConfig.schoolGradeThresholds, D: v } })} step="1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">Mobility 等级阈值（A/B/C/D）</p>
                  <div className="grid gap-3 md:grid-cols-4">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">A</p>
                      <NumberInput value={scoringConfig.mobilityGradeThresholds.A} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityGradeThresholds: { ...scoringConfig.mobilityGradeThresholds, A: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">B</p>
                      <NumberInput value={scoringConfig.mobilityGradeThresholds.B} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityGradeThresholds: { ...scoringConfig.mobilityGradeThresholds, B: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">C</p>
                      <NumberInput value={scoringConfig.mobilityGradeThresholds.C} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityGradeThresholds: { ...scoringConfig.mobilityGradeThresholds, C: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">D</p>
                      <NumberInput value={scoringConfig.mobilityGradeThresholds.D} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityGradeThresholds: { ...scoringConfig.mobilityGradeThresholds, D: v } })} step="1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">Mobility 权重</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Uber availability</p>
                      <NumberInput value={scoringConfig.mobilityWeights.uberAvailability} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityWeights: { ...scoringConfig.mobilityWeights, uberAvailability: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Uber Eats</p>
                      <NumberInput value={scoringConfig.mobilityWeights.uberEats} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityWeights: { ...scoringConfig.mobilityWeights, uberEats: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Public transit</p>
                      <NumberInput value={scoringConfig.mobilityWeights.publicTransit} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityWeights: { ...scoringConfig.mobilityWeights, publicTransit: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Walkability</p>
                      <NumberInput value={scoringConfig.mobilityWeights.walkability} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityWeights: { ...scoringConfig.mobilityWeights, walkability: v } })} step="0.01" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Car dependency</p>
                      <NumberInput value={scoringConfig.mobilityWeights.carDependency} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityWeights: { ...scoringConfig.mobilityWeights, carDependency: v } })} step="0.01" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">Uber tier 判定常数</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">ruralNightTier3Min</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.ruralNightTier3Min} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, ruralNightTier3Min: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier1DayMax</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier1DayMax} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier1DayMax: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier1NightMax</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier1NightMax} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier1NightMax: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier1UberEatsMin</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier1UberEatsMin} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier1UberEatsMin: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier3NightMin</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier3NightMin} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier3NightMin: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier3DayMin</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier3DayMin} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier3DayMin: v } })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">tier3UberEatsMax</p>
                      <NumberInput value={scoringConfig.mobilityTierRules.tier3UberEatsMax} onChange={(v) => setScoringConfig({ ...scoringConfig, mobilityTierRules: { ...scoringConfig.mobilityTierRules, tier3UberEatsMax: v } })} step="1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Food / Life 便利度（含 Uber & Uber Eats）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allPoints.map((item) => (
                <div key={`${item.group}-${item.key}`} className="rounded-2xl border border-slate-200 p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    {item.group.toUpperCase()} · {item.key}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                      <p className="mb-1 text-xs text-slate-500">Name</p>
                      <TextInput value={item.value.name} onChange={(v) => updatePoint(item.group, item.key, { name: v })} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Distance (mi)</p>
                      <NumberInput value={item.value.distanceMiles} onChange={(v) => updatePoint(item.group, item.key, { distanceMiles: v })} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Drive (min)</p>
                      <NumberInput value={item.value.driveMinutes} onChange={(v) => updatePoint(item.group, item.key, { driveMinutes: v })} step="1" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Transit (min/null)</p>
                      <input
                        value={item.value.publicTransitMinutes ?? ''}
                        onChange={(event) => {
                          const value = event.target.value.trim();
                          updatePoint(item.group, item.key, { publicTransitMinutes: value === '' ? null : Number(value) });
                        }}
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Walking (min/null)</p>
                      <input
                        value={item.value.walkingMinutes ?? ''}
                        onChange={(event) => {
                          const value = event.target.value.trim();
                          updatePoint(item.group, item.key, { walkingMinutes: value === '' ? null : Number(value) });
                        }}
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Official place source label</p>
                      <TextInput value={item.value.placeSource?.label ?? ''} onChange={(value) => updatePoint(item.group, item.key, { placeSource: { label: value, url: item.value.placeSource?.url ?? '', checkedAt: item.value.placeSource?.checkedAt } })} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Official place source URL</p>
                      <TextInput value={item.value.placeSource?.url ?? ''} onChange={(value) => updatePoint(item.group, item.key, { placeSource: { label: item.value.placeSource?.label ?? '', url: value, checkedAt: item.value.placeSource?.checkedAt } })} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Checked date</p>
                      <TextInput value={item.value.placeSource?.checkedAt ?? ''} onChange={(value) => updatePoint(item.group, item.key, { placeSource: { label: item.value.placeSource?.label ?? '', url: item.value.placeSource?.url ?? '', checkedAt: value } })} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
