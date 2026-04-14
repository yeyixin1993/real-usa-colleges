export default function SchoolDetailLoading() {
  return (
    <main className="container section-space">
      <div className="animate-pulse space-y-6">
        <div className="h-64 rounded-[32px] bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 rounded-[28px] bg-slate-200" />
          ))}
        </div>
        <div className="h-96 rounded-[32px] bg-slate-200" />
      </div>
    </main>
  );
}
