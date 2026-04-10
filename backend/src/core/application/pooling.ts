import { PoolRepository } from '../ports/repositories.js';
import { PoolMemberInput, PoolMemberResult } from '../domain/types.js';

export class CreatePool {
  constructor(private readonly poolRepository: PoolRepository) {}

  async execute(year: number, members: PoolMemberInput[]) {
    const total = members.reduce((sum, member) => sum + member.cbBefore, 0);
    if (total < 0) throw new Error('Pool sum must be >= 0.');

    const results: PoolMemberResult[] = members
      .map((member) => ({ ...member, cbAfter: member.cbBefore }))
      .sort((a, b) => b.cbBefore - a.cbBefore);

    const deficits = results.filter((member) => member.cbBefore < 0);
    const surpluses = results.filter((member) => member.cbBefore > 0);

    for (const deficit of deficits) {
      let needed = Math.abs(deficit.cbAfter);
      for (const surplus of surpluses) {
        if (needed <= 0) break;
        if (surplus.cbAfter <= 0) continue;

        const transfer = Math.min(needed, surplus.cbAfter);
        surplus.cbAfter -= transfer;
        deficit.cbAfter += transfer;
        needed -= transfer;
      }
    }

    for (const member of results) {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error('Deficit ship cannot exit worse.');
      }
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error('Surplus ship cannot exit negative.');
      }
    }

    return this.poolRepository.create(year, results);
  }
}
