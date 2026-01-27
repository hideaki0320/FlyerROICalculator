import React from 'react';
import { SimulationState } from '../types';
import { InputControl } from './InputControl';
import { Settings, ShoppingBag, TrendingUp, Printer, ArrowRight } from 'lucide-react';

interface SidebarProps {
  state: SimulationState;
  onChange: (newState: SimulationState) => void;
  onViewResults?: () => void; // Optional prop for mobile navigation
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onChange, onViewResults }) => {
  
  const updateMarketing = (key: keyof SimulationState['marketing'], val: number) => {
    onChange({ ...state, marketing: { ...state.marketing, [key]: val } });
  };

  const updateProduct = (product: 'fan' | 'stove' | 'kitchen', key: string, val: number) => {
    onChange({ ...state, [product]: { ...state[product], [key]: val } });
  };

  return (
    <div className="w-full lg:w-96 bg-slate-900 h-full flex flex-col text-slate-100 border-r border-slate-800 shadow-xl z-20">
      <div className="p-6 border-b border-slate-800 bg-slate-950 flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <TrendingUp className="text-emerald-500" />
          ROI Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-1">Renovation Campaign Planner</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-24 lg:pb-6">
        
        {/* Marketing Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Printer size={18} />
            <h2 className="font-semibold uppercase tracking-wider text-xs">Marketing Params</h2>
          </div>
          <InputControl
            label="配布部数"
            value={state.marketing.flyerCount}
            min={1000} max={100000} step={1000} unit="部"
            onChange={(v) => updateMarketing('flyerCount', v)}
          />
          <InputControl
            label="チラシ単価 (込)"
            value={state.marketing.costPerFlyer}
            min={1} max={100} step={0.1} unit="円"
            onChange={(v) => updateMarketing('costPerFlyer', v)}
          />
          <InputControl
            label="反響率"
            value={state.marketing.responseRate}
            min={0.01} max={5.0} step={0.01} unit="%"
            onChange={(v) => updateMarketing('responseRate', v)}
          />
          <InputControl
            label="営業成約率"
            value={state.marketing.closingRate}
            min={10} max={100} step={1} unit="%"
            onChange={(v) => updateMarketing('closingRate', v)}
          />
        </section>

        {/* Product: Fan */}
        <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <ShoppingBag size={18} />
            <h2 className="font-semibold uppercase tracking-wider text-xs">ドアノック商品 (換気扇)</h2>
          </div>
          <InputControl
            label="売価"
            value={state.fan.price}
            min={10000} max={200000} step={1000} unit="円"
            onChange={(v) => updateProduct('fan', 'price', v)}
          />
          <InputControl
            label="粗利率"
            value={state.fan.marginRate}
            min={5} max={80} step={1} unit="%"
            onChange={(v) => updateProduct('fan', 'marginRate', v)}
          />
        </section>

        {/* Product: Stove */}
        <section className="bg-slate-800/30 p-4 rounded-lg border border-slate-800 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold uppercase tracking-wider text-xs text-blue-300">セット販売 1 (コンロ)</h2>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Up-Sell</span>
          </div>
          <InputControl
            label="セット成約率"
            value={state.stove.upsellRate}
            min={0} max={100} step={1} unit="%"
            highlight
            onChange={(v) => updateProduct('stove', 'upsellRate', v)}
          />
          <InputControl
            label="売価"
            value={state.stove.price}
            min={30000} max={300000} step={5000} unit="円"
            onChange={(v) => updateProduct('stove', 'price', v)}
          />
          <InputControl
            label="粗利率"
            value={state.stove.marginRate}
            min={5} max={80} step={1} unit="%"
            onChange={(v) => updateProduct('stove', 'marginRate', v)}
          />
        </section>

        {/* Product: Kitchen */}
        <section className="bg-slate-800/30 p-4 rounded-lg border border-slate-800 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold uppercase tracking-wider text-xs text-purple-300">セット販売 2 (キッチン)</h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Cross-Sell</span>
          </div>
          <InputControl
            label="セット成約率"
            value={state.kitchen.upsellRate}
            min={0} max={100} step={1} unit="%"
            highlight
            onChange={(v) => updateProduct('kitchen', 'upsellRate', v)}
          />
          <InputControl
            label="売価"
            value={state.kitchen.price}
            min={200000} max={2000000} step={10000} unit="円"
            onChange={(v) => updateProduct('kitchen', 'price', v)}
          />
          <InputControl
            label="粗利率"
            value={state.kitchen.marginRate}
            min={5} max={80} step={1} unit="%"
            onChange={(v) => updateProduct('kitchen', 'marginRate', v)}
          />
        </section>
        
        {/* Mobile-only Action Button */}
        {onViewResults && (
          <div className="lg:hidden pt-4">
            <button 
              onClick={onViewResults}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              シミュレーション結果を見る
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};