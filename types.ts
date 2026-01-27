export interface ProductConfig {
  price: number;
  marginRate: number; // 0-100
  upsellRate: number; // 0-100 (For base product this is implicitly 100% of closed deals)
}

export interface MarketingConfig {
  flyerCount: number;
  costPerFlyer: number;
  responseRate: number; // 0-100 %
  closingRate: number; // 0-100 %
}

export interface SimulationState {
  marketing: MarketingConfig;
  fan: ProductConfig;     // Door-knock product
  stove: ProductConfig;   // Upsell 1
  kitchen: ProductConfig; // Upsell 2
}

export interface CalculatedMetrics {
  inquiries: number;
  deals: number;
  
  marketingCost: number;
  
  revenueFan: number;
  costFan: number;
  profitFan: number;
  
  revenueStove: number;
  costStove: number;
  profitStove: number;
  dealsStove: number;
  
  revenueKitchen: number;
  costKitchen: number;
  profitKitchen: number;
  dealsKitchen: number;
  
  totalRevenue: number;
  totalCost: number; // Marketing + COGS
  totalCOGS: number;
  grossProfit: number; // Revenue - COGS
  operatingProfit: number; // Gross Profit - Marketing Cost
  roi: number;
}