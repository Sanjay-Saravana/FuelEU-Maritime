import { ComparisonRow, Route } from '../domain/types';

export interface ApiPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonRow[]>;
  getCb(shipId: string, year: number): Promise<{ cbGco2eq: number }>;
  getAdjustedCb(shipId: string, year: number): Promise<{ adjustedCb: number }>;
  bank(shipId: string, year: number, amount: number): Promise<{ cb_after: number }>;
  applyBank(shipId: string, year: number, amount: number): Promise<{ available_after: number }>;
  createPool(year: number, members: { shipId: string; cbBefore: number }[]): Promise<{ poolId: string; members: { shipId: string; cbAfter: number; cbBefore: number }[] }>;
}
