import { describe, expect, it } from 'vitest';
import { ComputeComparison } from '../src/core/application/compute-comparison.js';
import { ComputeCb } from '../src/core/application/compute-cb.js';
import { ApplyBanked, BankSurplus } from '../src/core/application/banking.js';
import { CreatePool } from '../src/core/application/pooling.js';
import {
  InMemoryBankingRepository,
  InMemoryComplianceRepository,
  InMemoryPoolRepository,
  InMemoryRoutesRepository,
} from '../src/adapters/outbound/postgres/repositories.js';

describe('core use cases', () => {
  it('computes comparison with percent diff', async () => {
    const uc = new ComputeComparison(new InMemoryRoutesRepository());
    const result = await uc.execute();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('percentDiff');
  });

  it('computes CB and stores snapshot', async () => {
    const routes = new InMemoryRoutesRepository();
    const comp = new InMemoryComplianceRepository();
    const uc = new ComputeCb(routes, comp);
    const result = await uc.execute('S001', 2024);
    expect(result.cbGco2eq).toBeLessThan(0);
  });

  it('banks and applies surplus', async () => {
    const comp = new InMemoryComplianceRepository();
    await comp.saveSnapshot({ shipId: 'S9', year: 2025, cbGco2eq: 100 });
    const bankRepo = new InMemoryBankingRepository();
    const bank = new BankSurplus(comp, bankRepo);
    const applied = await bank.execute('S9', 2025, 40);
    expect(applied.cb_after).toBe(60);

    const use = new ApplyBanked(bankRepo);
    const used = await use.execute('S9', 2025, 20);
    expect(used.available_after).toBe(20);
  });

  it('creates valid pool and rejects invalid total', async () => {
    const uc = new CreatePool(new InMemoryPoolRepository());
    const valid = await uc.execute(2025, [
      { shipId: 'A', cbBefore: 50 },
      { shipId: 'B', cbBefore: -30 },
      { shipId: 'C', cbBefore: -20 },
    ]);
    expect(valid.members.every((m) => m.cbAfter >= 0 || m.cbBefore < 0)).toBe(true);

    await expect(
      uc.execute(2025, [
        { shipId: 'A', cbBefore: 10 },
        { shipId: 'B', cbBefore: -50 },
      ]),
    ).rejects.toThrow('Pool sum must be >= 0.');
  });
});
