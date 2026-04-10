import { TARGET_INTENSITY_2025 } from '../domain/constants.js';
import { RoutesRepository } from '../ports/repositories.js';

export class ComputeComparison {
  constructor(private readonly routesRepository: RoutesRepository) {}

  async execute() {
    const baseline = await this.routesRepository.getBaseline();
    if (!baseline) {
      throw new Error('Baseline route is not set.');
    }

    const routes = await this.routesRepository.getAll();
    return routes
      .filter((route) => route.routeId !== baseline.routeId)
      .map((route) => {
        const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
        return {
          baselineRouteId: baseline.routeId,
          routeId: route.routeId,
          baselineIntensity: baseline.ghgIntensity,
          comparisonIntensity: route.ghgIntensity,
          percentDiff,
          compliant: route.ghgIntensity <= TARGET_INTENSITY_2025,
        };
      });
  }
}
