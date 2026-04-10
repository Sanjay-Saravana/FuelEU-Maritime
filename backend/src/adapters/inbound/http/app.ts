import express from 'express';
import { ComputeComparison } from '../../../core/application/compute-comparison.js';
import { ComputeCb } from '../../../core/application/compute-cb.js';
import { ApplyBanked, BankSurplus } from '../../../core/application/banking.js';
import { CreatePool } from '../../../core/application/pooling.js';
import {
  InMemoryBankingRepository,
  InMemoryComplianceRepository,
  InMemoryPoolRepository,
  InMemoryRoutesRepository,
} from '../../outbound/postgres/repositories.js';

export const buildApp = () => {
  const routesRepo = new InMemoryRoutesRepository();
  const complianceRepo = new InMemoryComplianceRepository();
  const bankingRepo = new InMemoryBankingRepository();
  const poolRepo = new InMemoryPoolRepository();

  const app = express();
  app.use(express.json());

  app.get('/routes', async (_req, res) => {
    const routes = await routesRepo.getAll();
    res.json(routes);
  });

  app.post('/routes/:id/baseline', async (req, res) => {
    await routesRepo.setBaseline(req.params.id);
    res.json({ ok: true });
  });

  app.get('/routes/comparison', async (_req, res) => {
    const useCase = new ComputeComparison(routesRepo);
    res.json(await useCase.execute());
  });

  app.get('/compliance/cb', async (req, res) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const useCase = new ComputeCb(routesRepo, complianceRepo);
      res.json(await useCase.execute(shipId, year));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/compliance/adjusted-cb', async (req, res) => {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);
    const snapshot = await complianceRepo.getSnapshot(shipId, year);
    const records = await bankingRepo.getRecords(shipId, year);
    const adjusted = (snapshot?.cbGco2eq ?? 0) - records.reduce((sum, r) => sum + r.amountGco2eq, 0);
    res.json({ shipId, year, adjustedCb: adjusted });
  });

  app.get('/banking/records', async (req, res) => {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);
    res.json(await bankingRepo.getRecords(shipId, year));
  });

  app.post('/banking/bank', async (req, res) => {
    try {
      const { shipId, year, amount } = req.body;
      const useCase = new BankSurplus(complianceRepo, bankingRepo);
      res.json(await useCase.execute(shipId, year, amount));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/banking/apply', async (req, res) => {
    try {
      const { shipId, year, amount } = req.body;
      const useCase = new ApplyBanked(bankingRepo);
      res.json(await useCase.execute(shipId, year, amount));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/pools', async (req, res) => {
    try {
      const { year, members } = req.body;
      const useCase = new CreatePool(poolRepo);
      res.json(await useCase.execute(year, members));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return app;
};
