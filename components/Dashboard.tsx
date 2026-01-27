import React, { useMemo } from 'react';
import { SimulationState } from '../types';
import { calculateMetrics, formatCurrency, formatNumber } from '../utils/calculations';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ReferenceLine, PieChart, Pie, Cell 
} from 'recharts';
import { Users, FileCheck, DollarSign, Wallet, TrendingDown, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  state: SimulationState;
}

const KPICard = ({ title, value, subvalue, icon: Icon, colorClass, alert = false }: any) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow ${alert ? 'ring-2 ring-rose-500 bg-rose-50' : ''}`}>
    <div className="flex justify-between items-start mb-2">
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div>
      <div className={`text-2xl font-bold ${alert ? 'text-rose-600' : 'text-slate-800'}`}>{value}</div>
      {subvalue && <div className="text-xs text-slate-400 mt-1">{subvalue}</div>}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const metrics = calculateMetrics(state);
  const isProfitable = metrics.operatingProfit > 0;

  // Prepare data for Stacked Bar (Structure)
  const structureData = [
    {
      name: '収支構造',
      Marketing: metrics.marketingCost,
      COGS: metrics.totalCOGS,
      ProfitFan: metrics.profitFan,
      ProfitStove: metrics.profitStove,
      ProfitKitchen: metrics.profitKitchen,
    }
  ];

  // Prepare data for Break-even Analysis (varying response rate)
  const breakEvenData = useMemo(() => {
    const data = [];
    const currentRate = state.marketing.responseRate;
    // Create points from 0% to 2x current rate or max 5%
    const maxRate = Math.max(currentRate * 2.5, 1.0);
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const rate = (maxRate / steps) * i;
      const simState = { 
        ...state, 
        marketing: { ...state.marketing, responseRate: rate } 
      };
      const m = calculateMetrics(simState);
      data.push({
        rate: rate.toFixed(2),
        Profit: m.operatingProfit,
        Revenue: m.totalRevenue,
        TotalCost: m.totalCost
      });
    }
    return data;
  }, [state]);

  // Prepare Pie Chart Data
  const pieData = [
    { name: '換気扇 (Door)', value: metrics.profitFan, color: '#10b981' }, // Emerald 500
    { name: 'コンロ (Upsell)', value: metrics.profitStove, color: '#3b82f6' }, // Blue 500
    { name: 'キッチン (Cross)', value: metrics.profitKitchen, color: '#a855f7' }, // Purple 500
  ].filter(d => d.value > 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 lg:p-8 pb-24 lg:pb-8">
      
      {/* Header for Mobile clarity */}
      <div className="lg:hidden mb-6 pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-blue-500" />
          シミュレーション結果
        </h2>
        <p className="text-sm text-slate-500">入力値に基づくリアルタイム試算</p>
      </div>
      
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="予想問合せ / 成約" 
          value={`${formatNumber(metrics.inquiries, 0)} 件`}
          subvalue={`成約: ${formatNumber(metrics.deals, 0)}件 (CVR ${state.marketing.closingRate}%)`}
          icon={Users}
          colorClass="bg-blue-500"
        />
        <KPICard 
          title="総売上 (Revenue)" 
          value={formatCurrency(metrics.totalRevenue)}
          subvalue={`客単価: ${formatCurrency(metrics.deals > 0 ? metrics.totalRevenue / metrics.deals : 0)}`}
          icon={Wallet}
          colorClass="bg-indigo-500"
        />
        <KPICard 
          title="総コスト (Cost)" 
          value={formatCurrency(metrics.totalCost)}
          subvalue={`販促費: ${formatCurrency(metrics.marketingCost)}`}
          icon={TrendingDown}
          colorClass="bg-slate-500"
        />
        <KPICard 
          title="営業利益 (Profit)" 
          value={formatCurrency(metrics.operatingProfit)}
          subvalue={`利益率: ${((metrics.operatingProfit / metrics.totalRevenue) * 100).toFixed(1)}%`}
          icon={isProfitable ? DollarSign : AlertTriangle}
          colorClass={isProfitable ? "bg-emerald-500" : "bg-rose-500"}
          alert={!isProfitable}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1: Profit Structure */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileCheck size={20} className="text-slate-400"/>
            利益構造ビジュアル
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={structureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis tickFormatter={(val) => `¥${val/10000}万`} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Legend />
                <Bar dataKey="Marketing" stackId="a" fill="#94a3b8" name="販促費" />
                <Bar dataKey="COGS" stackId="a" fill="#64748b" name="原価" />
                <Bar dataKey="ProfitFan" stackId="a" fill="#10b981" name="換気扇利益" />
                <Bar dataKey="ProfitStove" stackId="a" fill="#3b82f6" name="コンロ利益" />
                <Bar dataKey="ProfitKitchen" stackId="a" fill="#a855f7" name="キッチン利益" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            売上に対するコストの積み上げと、各商品の利益貢献度。
          </p>
        </div>

        {/* Chart 2: Break-even Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-slate-400"/>
            損益分岐シミュレーション (反響率)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={breakEvenData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="rate" 
                  label={{ value: '反響率 (%)', position: 'insideBottomRight', offset: -5 }} 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickCount={6}
                />
                <YAxis tickFormatter={(val) => `¥${val/10000}万`} />
                <Tooltip 
                  formatter={(val: number) => formatCurrency(val)} 
                  labelFormatter={(label) => `反響率: ${label}%`}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <ReferenceLine x={state.marketing.responseRate} stroke="red" strokeDasharray="3 3" label="現在値" />
                <Line type="monotone" dataKey="Revenue" stroke="#818cf8" name="売上" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="TotalCost" stroke="#94a3b8" name="総コスト" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Profit" stroke={isProfitable ? "#10b981" : "#f43f5e"} name="営業利益" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            反響率が変化した際の収益性の推移。赤の点線が現在の設定値。
          </p>
        </div>
      </div>

      {/* Chart 3: Upsell Contribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-slate-400"/>
            利益の内訳 (アップセル効果)
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-around h-64">
           <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
           </div>
           <div className="w-full md:w-1/2 pl-0 md:pl-8 space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-sm text-emerald-800 font-bold mb-1">ドアノック商品 (換気扇)</div>
                <div className="flex justify-between text-sm">
                   <span>利益額: {formatCurrency(metrics.profitFan)}</span>
                   <span>{metrics.operatingProfit > 0 ? Math.round(metrics.profitFan / metrics.grossProfit * 100) : 0}%</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-800 font-bold mb-1">アップセル (コンロ)</div>
                <div className="flex justify-between text-sm">
                   <span>利益額: {formatCurrency(metrics.profitStove)}</span>
                   <span>{metrics.operatingProfit > 0 ? Math.round(metrics.profitStove / metrics.grossProfit * 100) : 0}%</span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-sm text-purple-800 font-bold mb-1">クロスセル (キッチン)</div>
                <div className="flex justify-between text-sm">
                   <span>利益額: {formatCurrency(metrics.profitKitchen)}</span>
                   <span>{metrics.operatingProfit > 0 ? Math.round(metrics.profitKitchen / metrics.grossProfit * 100) : 0}%</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};