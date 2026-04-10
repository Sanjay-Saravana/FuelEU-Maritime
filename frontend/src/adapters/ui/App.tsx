import { useMemo, useState } from 'react';
import { useDashboard } from './hooks/useDashboard';

const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'] as const;

export const App = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Routes');
  const { routes, comparison, svc } = useDashboard();
  const [year, setYear] = useState(2025);
  const [shipId, setShipId] = useState('S005');
  const [cb, setCb] = useState<number | null>(null);
  const [poolRes, setPoolRes] = useState<any>(null);

  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });
  const filteredRoutes = useMemo(
    () => routes.filter((r) => (!filters.vesselType || r.vesselType === filters.vesselType)
      && (!filters.fuelType || r.fuelType === filters.fuelType)
      && (!filters.year || String(r.year) === filters.year)),
    [routes, filters],
  );

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">FuelEU Compliance Dashboard</h1>
      <div className="flex gap-2">
        {tabs.map((t) => <button key={t} className={`px-3 py-1 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'Routes' && (
        <section className="bg-white p-4 rounded shadow space-y-3">
          <div className="flex gap-2">
            <input placeholder="vessel" className="border p-1" value={filters.vesselType} onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })} />
            <input placeholder="fuel" className="border p-1" value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })} />
            <input placeholder="year" className="border p-1" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          </div>
          <table className="w-full text-sm">
            <thead><tr>{['routeId', 'vesselType', 'fuelType', 'year', 'ghgIntensity', 'fuelConsumption', 'distance', 'totalEmissions'].map((h) => <th className="text-left" key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filteredRoutes.map((r) => <tr key={r.routeId}><td>{r.routeId}</td><td>{r.vesselType}</td><td>{r.fuelType}</td><td>{r.year}</td><td>{r.ghgIntensity}</td><td>{r.fuelConsumption}</td><td>{r.distance}</td><td>{r.totalEmissions}</td><td><button className="bg-slate-200 px-2" onClick={() => svc.setBaseline(r.routeId)}>Set Baseline</button></td></tr>)}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'Compare' && (
        <section className="bg-white p-4 rounded shadow">
          <p className="mb-2">Target: 89.3368 gCO₂e/MJ</p>
          <table className="w-full text-sm mb-4">
            <thead><tr><th>Route</th><th>GHG</th><th>% diff</th><th>Compliant</th></tr></thead>
            <tbody>{comparison.map((c) => <tr key={c.routeId}><td>{c.routeId}</td><td>{c.comparisonIntensity}</td><td>{c.percentDiff.toFixed(2)}%</td><td>{c.compliant ? '✅' : '❌'}</td></tr>)}</tbody>
          </table>
          <div className="space-y-1">
            {comparison.map((c) => <div key={c.routeId} className="flex items-center gap-2"><span className="w-12">{c.routeId}</span><div className="bg-blue-500 h-4" style={{ width: `${c.comparisonIntensity * 3}px` }} /></div>)}
          </div>
        </section>
      )}

      {tab === 'Banking' && (
        <section className="bg-white p-4 rounded shadow space-y-3">
          <div className="flex gap-2"><input className="border p-1" value={shipId} onChange={(e) => setShipId(e.target.value)} /><input className="border p-1" value={year} onChange={(e) => setYear(Number(e.target.value))} /></div>
          <button className="bg-slate-200 px-2 py-1" onClick={async () => setCb((await svc.getCb(shipId, year)).cbGco2eq)}>Load CB</button>
          <p>CB: {cb ?? 'n/a'}</p>
          <div className="flex gap-2">
            <button disabled={!cb || cb <= 0} className="bg-green-600 text-white px-2 py-1 disabled:bg-gray-300" onClick={() => svc.bank(shipId, year, Math.max((cb ?? 0) * 0.2, 0))}>Bank 20%</button>
            <button disabled={!cb || cb <= 0} className="bg-blue-600 text-white px-2 py-1 disabled:bg-gray-300" onClick={() => svc.applyBank(shipId, year, 1000)}>Apply 1000</button>
          </div>
        </section>
      )}

      {tab === 'Pooling' && (
        <section className="bg-white p-4 rounded shadow space-y-2">
          <button className="bg-indigo-600 text-white px-2 py-1" onClick={async () => setPoolRes(await svc.createPool(2025, [{ shipId: 'S002', cbBefore: 40000 }, { shipId: 'S001', cbBefore: -10000 }, { shipId: 'S003', cbBefore: -10000 }]))}>Create Sample Pool</button>
          {poolRes && <div>
            <p className={poolRes.members.reduce((s: number, m: any) => s + m.cbAfter, 0) >= 0 ? 'text-green-700' : 'text-red-700'}>Pool Sum: {poolRes.members.reduce((s: number, m: any) => s + m.cbAfter, 0)}</p>
            {poolRes.members.map((m: any) => <p key={m.shipId}>{m.shipId}: {m.cbBefore} → {m.cbAfter}</p>)}
          </div>}
        </section>
      )}
    </main>
  );
};
