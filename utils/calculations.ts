import { SimulationState, CalculatedMetrics } from '../types';

export const calculateMetrics = (state: SimulationState): CalculatedMetrics => {
  const { marketing, fan, stove, kitchen } = state;

  // 1. Marketing Funnel
  const marketingCost = marketing.flyerCount * marketing.costPerFlyer;
  const inquiries = marketing.flyerCount * (marketing.responseRate / 100);
  const baseDeals = inquiries * (marketing.closingRate / 100);

  // 2. Product 1: Fan (Base)
  // Assumption: Everyone who closes gets the base product (or we treat base upsell as 100%)
  const dealsFan = baseDeals; 
  const revenueFan = dealsFan * fan.price;
  const costFan = revenueFan * (1 - fan.marginRate / 100);
  const profitFan = revenueFan - costFan;

  // 3. Product 2: Stove (Upsell 1)
  const dealsStove = baseDeals * (stove.upsellRate / 100);
  const revenueStove = dealsStove * stove.price;
  const costStove = revenueStove * (1 - stove.marginRate / 100);
  const profitStove = revenueStove - costStove;

  // 4. Product 3: Kitchen (Upsell 2)
  const dealsKitchen = baseDeals * (kitchen.upsellRate / 100);
  const revenueKitchen = dealsKitchen * kitchen.price;
  const costKitchen = revenueKitchen * (1 - kitchen.marginRate / 100);
  const profitKitchen = revenueKitchen - costKitchen;

  // 5. Aggregates
  const totalRevenue = revenueFan + revenueStove + revenueKitchen;
  const totalCOGS = costFan + costStove + costKitchen;
  const totalCost = marketingCost + totalCOGS;
  const grossProfit = totalRevenue - totalCOGS;
  const operatingProfit = grossProfit - marketingCost;
  
  const roi = marketingCost > 0 ? (operatingProfit / marketingCost) * 100 : 0;

  return {
    inquiries,
    deals: baseDeals,
    marketingCost,
    
    revenueFan,
    costFan,
    profitFan,
    
    dealsStove,
    revenueStove,
    costStove,
    profitStove,
    
    dealsKitchen,
    revenueKitchen,
    costKitchen,
    profitKitchen,
    
    totalRevenue,
    totalCOGS,
    totalCost,
    grossProfit,
    operatingProfit,
    roi
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value);
};

export const formatNumber = (value: number, decimals = 1) => {
  return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: decimals }).format(value);
};