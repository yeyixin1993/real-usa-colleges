export default function SchoolsLoading() {
  return (
    <main className="container section-space">
      <div className="animate-pulse space-y-5">
        <div className="h-10 w-1/4 rounded-full bg-slate-200" />
        <div className="h-24 rounded-[28px] bg-slate-200" />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="h-52 rounded-[28px] bg-slate-200" />
            <div className="h-52 rounded-[28px] bg-slate-200" />
          </div>
          <div className="h-[520px] rounded-[28px] bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
