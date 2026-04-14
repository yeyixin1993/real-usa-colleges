'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AccessibilityPoint, School } from '@/types/school';

type SchoolListItem = Pick<School, 'slug' | 'name' | 'city' | 'state'>;

function NumberInput({ value, onChange, step = '0.1' }: { value: number; onChange: (v: number) => void; step?: string }) {
  return (
    <input
      type="number"
      step={step}
      value={Number.isFinite(value) ? value : 0}
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

export function AdminConsole({ locale, authenticated }: { locale: string; authenticated: boolean }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [draft, setDraft] = useState<School | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

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

  async function save() {
    if (!draft) return;
    setSaving(true);
    setStatus(null);

    const response = await fetch(`/api/admin/schools/${draft.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    setSaving(false);

    if (!response.ok) {
      setStatus('保存失败，请稍后重试。');
      return;
    }

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
            </CardContent>
          </Card>

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
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={item.value.uberAvailable}
                        onChange={(event) => updatePoint(item.group, item.key, { uberAvailable: event.target.checked })}
                      />
                      Uber
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(item.value.uberEatsAvailable)}
                        onChange={(event) => updatePoint(item.group, item.key, { uberEatsAvailable: event.target.checked })}
                      />
                      Uber Eats
                    </label>
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
