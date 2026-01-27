import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SimulationState } from './types';
import { SlidersHorizontal, BarChart3 } from 'lucide-react';

// Initial Default State
const initialState: SimulationState = {
  marketing: {
    flyerCount: 10000,
    costPerFlyer: 8.0,
    responseRate: 0.1, // 0.1%
    closingRate: 60, // 60%
  },
  fan: {
    price: 35000,
    marginRate: 30,
    upsellRate: 100, // Always sold
  },
  stove: {
    price: 98000,
    marginRate: 35,
    upsellRate: 20, // 20% of base deals
  },
  kitchen: {
    price: 850000,
    marginRate: 25,
    upsellRate: 5, // 5% of base deals
  }
};

type Tab = 'input' | 'result';

export default function App() {
  const [state, setState] = useState<SimulationState>(initialState);
  const [activeTab, setActiveTab] = useState<Tab>('input');

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-slate-50 relative">
      
      {/* Sidebar - Visible on Desktop OR when tab is input on Mobile */}
      <div className={`${activeTab === 'input' ? 'flex' : 'hidden'} lg:flex w-full lg:w-auto h-full overflow-hidden flex-col`}>
        <Sidebar 
          state={state} 
          onChange={setState} 
          onViewResults={() => setActiveTab('result')}
        />
      </div>

      {/* Dashboard - Visible on Desktop OR when tab is result on Mobile */}
      <div className={`${activeTab === 'result' ? 'flex' : 'hidden'} lg:flex flex-1 h-full overflow-hidden flex-col`}>
        <Dashboard state={state} />
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-50 safe-area-bottom">
        <button
          onClick={() => setActiveTab('input')}
          className={`flex-1 flex flex-col items-center justify-center py-3 ${
            activeTab === 'input' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'
          }`}
        >
          <SlidersHorizontal size={24} />
          <span className="text-xs font-medium mt-1">条件入力</span>
        </button>
        <button
          onClick={() => setActiveTab('result')}
          className={`flex-1 flex flex-col items-center justify-center py-3 ${
            activeTab === 'result' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-xs font-medium mt-1">結果・グラフ</span>
        </button>
      </div>

      {/* Padding for bottom nav on mobile */}
      <style>{`
        @media (max-width: 1023px) {
          .custom-scrollbar {
            padding-bottom: 80px !important; 
          }
          #root {
            height: 100vh; /* fallback */
            height: 100dvh;
          }
        }
      `}</style>
    </div>
  );
}