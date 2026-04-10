import { BankingRepository, ComplianceRepository, PoolRepository, RoutesRepository } from '../../../core/ports/repositories.js';
import { BankEntry, ComplianceSnapshot, PoolMemberResult } from '../../../core/domain/types.js';
import { inMemoryDb } from './in-memory-db.js';

export class InMemoryRoutesRepository implements RoutesRepository {
  getAll() {
    return Promise.resolve(inMemoryDb.routes);
  }

  async setBaseline(routeId: string) {
    inMemoryDb.routes = inMemoryDb.routes.map((route) => ({ ...route, isBaseline: route.routeId === routeId }));
  }

  getBaseline() {
    return Promise.resolve(inMemoryDb.routes.find((route) => route.isBaseline) ?? null);
  }
}

export class InMemoryComplianceRepository implements ComplianceRepository {
  async saveSnapshot(snapshot: ComplianceSnapshot) {
    inMemoryDb.snapshots = inMemoryDb.snapshots.filter((item) => !(item.shipId === snapshot.shipId && item.year === snapshot.year));
    inMemoryDb.snapshots.push(snapshot);
  }

  getSnapshot(shipId: string, year: number) {
    return Promise.resolve(inMemoryDb.snapshots.find((item) => item.shipId === shipId && item.year === year) ?? null);
  }
}

export class InMemoryBankingRepository implements BankingRepository {
  getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return Promise.resolve(inMemoryDb.bankEntries.filter((entry) => entry.shipId === shipId && entry.year === year));
  }

  async addRecord(entry: BankEntry) {
    inMemoryDb.bankEntries.push(entry);
  }
}

export class InMemoryPoolRepository implements PoolRepository {
  async create(year: number, members: PoolMemberResult[]) {
    const poolId = `P${inMemoryDb.pools.length + 1}`;
    const pool = { poolId, year, members };
    inMemoryDb.pools.push(pool);
    return pool;
  }
}
