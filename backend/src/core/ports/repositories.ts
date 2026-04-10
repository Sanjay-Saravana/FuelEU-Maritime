import { BankEntry, ComplianceSnapshot, PoolMemberResult, Route } from '../domain/types.js';

export interface RoutesRepository {
  getAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getBaseline(): Promise<Route | null>;
}

export interface ComplianceRepository {
  saveSnapshot(snapshot: ComplianceSnapshot): Promise<void>;
  getSnapshot(shipId: string, year: number): Promise<ComplianceSnapshot | null>;
}

export interface BankingRepository {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  addRecord(entry: BankEntry): Promise<void>;
}

export interface PoolRepository {
  create(year: number, members: PoolMemberResult[]): Promise<{ poolId: string; members: PoolMemberResult[] }>;
}
