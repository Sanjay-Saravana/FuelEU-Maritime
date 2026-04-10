import { useEffect, useState } from 'react';
import { dashboardService } from '../../infrastructure/http-api';
import { ComparisonRow, Route } from '../../../core/domain/types';

export const useDashboard = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [comparison, setComparison] = useState<ComparisonRow[]>([]);

  useEffect(() => {
    dashboardService.getRoutes().then(setRoutes);
    dashboardService.getComparison().then(setComparison);
  }, []);

  return { routes, setRoutes, comparison, setComparison, svc: dashboardService };
};
