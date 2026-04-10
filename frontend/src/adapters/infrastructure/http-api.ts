import { DashboardService } from '../../core/application/dashboard-service';
import { ApiPort } from '../../core/ports/api-port';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const api: ApiPort = {
  async getRoutes() { const res = await fetch(`${API_URL}/routes`); return res.json(); },
  async setBaseline(routeId) { await fetch(`${API_URL}/routes/${routeId}/baseline`, { method: 'POST' }); },
  async getComparison() { const res = await fetch(`${API_URL}/routes/comparison`); return res.json(); },
  async getCb(shipId, year) { const res = await fetch(`${API_URL}/compliance/cb?shipId=${shipId}&year=${year}`); return res.json(); },
  async getAdjustedCb(shipId, year) { const res = await fetch(`${API_URL}/compliance/adjusted-cb?shipId=${shipId}&year=${year}`); return res.json(); },
  async bank(shipId, year, amount) { const res = await fetch(`${API_URL}/banking/bank`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shipId, year, amount }) }); return res.json(); },
  async applyBank(shipId, year, amount) { const res = await fetch(`${API_URL}/banking/apply`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shipId, year, amount }) }); return res.json(); },
  async createPool(year, members) { const res = await fetch(`${API_URL}/pools`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ year, members }) }); return res.json(); },
};

export const dashboardService = new DashboardService(api);
