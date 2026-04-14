export default function LocaleLoading() {
  return (
    <main className="container section-space">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-1/3 rounded-full bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-[28px] bg-slate-200" />
          <div className="h-40 rounded-[28px] bg-slate-200" />
          <div className="h-40 rounded-[28px] bg-slate-200" />
        </div>
        <div className="h-72 rounded-[32px] bg-slate-200" />
      </div>
    </main>
  );
}
