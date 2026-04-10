import { ENERGY_FACTOR_MJ_PER_TON, TARGET_INTENSITY_2025 } from '../domain/constants.js';
import { ComplianceRepository, RoutesRepository } from '../ports/repositories.js';

export class ComputeCb {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly complianceRepository: ComplianceRepository,
  ) {}

  async execute(shipId: string, year: number) {
    const routes = await this.routesRepository.getAll();
    const route = routes.find((item) => item.shipId === shipId && item.year === year);
    if (!route) {
      throw new Error('Route not found for ship/year.');
    }

    const energyInScope = route.fuelConsumption * ENERGY_FACTOR_MJ_PER_TON;
    const cbGco2eq = (TARGET_INTENSITY_2025 - route.ghgIntensity) * energyInScope;
    const snapshot = { shipId, year, cbGco2eq };
    await this.complianceRepository.saveSnapshot(snapshot);
    return snapshot;
  }
}
