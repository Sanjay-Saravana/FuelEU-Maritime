export interface Route {
  id: string;
  routeId: string;
  shipId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComplianceSnapshot {
  shipId: string;
  year: number;
  cbGco2eq: number;
}

export interface BankEntry {
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface PoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export interface PoolMemberResult extends PoolMemberInput {
  cbAfter: number;
}
