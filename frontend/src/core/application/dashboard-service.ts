import { ApiPort } from '../ports/api-port';

export class DashboardService {
  constructor(private readonly api: ApiPort) {}

  getRoutes() { return this.api.getRoutes(); }
  setBaseline(routeId: string) { return this.api.setBaseline(routeId); }
  getComparison() { return this.api.getComparison(); }
  getCb(shipId: string, year: number) { return this.api.getCb(shipId, year); }
  getAdjustedCb(shipId: string, year: number) { return this.api.getAdjustedCb(shipId, year); }
  bank(shipId: string, year: number, amount: number) { return this.api.bank(shipId, year, amount); }
  applyBank(shipId: string, year: number, amount: number) { return this.api.applyBank(shipId, year, amount); }
  createPool(year: number, members: { shipId: string; cbBefore: number }[]) { return this.api.createPool(year, members); }
}
