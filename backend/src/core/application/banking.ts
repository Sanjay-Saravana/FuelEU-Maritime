import { BankingRepository, ComplianceRepository } from '../ports/repositories.js';

export class BankSurplus {
  constructor(
    private readonly complianceRepository: ComplianceRepository,
    private readonly bankingRepository: BankingRepository,
  ) {}

  async execute(shipId: string, year: number, amount: number) {
    const snapshot = await this.complianceRepository.getSnapshot(shipId, year);
    if (!snapshot || snapshot.cbGco2eq <= 0) throw new Error('No positive CB available.');
    if (amount <= 0 || amount > snapshot.cbGco2eq) throw new Error('Invalid bank amount.');

    await this.bankingRepository.addRecord({ shipId, year, amountGco2eq: amount });
    return { cb_before: snapshot.cbGco2eq, applied: amount, cb_after: snapshot.cbGco2eq - amount };
  }
}

export class ApplyBanked {
  constructor(private readonly bankingRepository: BankingRepository) {}

  async execute(shipId: string, year: number, amount: number) {
    const records = await this.bankingRepository.getRecords(shipId, year);
    const available = records.reduce((sum, record) => sum + record.amountGco2eq, 0);
    if (amount <= 0 || amount > available) throw new Error('Requested amount exceeds banked surplus.');

    await this.bankingRepository.addRecord({ shipId, year, amountGco2eq: -amount });
    return { available_before: available, applied: amount, available_after: available - amount };
  }
}
