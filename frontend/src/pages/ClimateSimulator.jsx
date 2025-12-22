import React, { useState, useEffect } from 'react';
import { calculateSmeImpact } from '../services/api';
import { NumericInput, SliderControl, ScoreCard, ImpactHeatmap, RadarPlot, AlertBox, DeepMetricsPanel, ProjectionChart } from '../components/DashboardComponents';
import { ChevronDown, ChevronUp, Settings, Activity, Zap, BarChart3, Globe, Shield, AlertTriangle, TrendingUp, DollarSign, Leaf, Users } from 'lucide-react';

const ClimateSimulator = () => {
    // -- Inputs State --
    const [inputs, setInputs] = useState({
        // Basic Business Info
        industry: "Manufacturing",
        company_size: "SME",
        region: "EU",
        forecast_horizon: 7,

        // Financial Baseline
        initial_revenue: 1000000,
        num_employees: 50,
        fixed_costs: 200000,
        variable_costs_pct: 0.4,
        initial_capex: 50000,
        revenue_growth_rate: 0.05,
        employee_growth_rate: 0.02,

        // Sustainability Strategy (Scenario B)
        sustainability_capex: 100000,
        reinvest_pct: 0.01,
        energy_efficiency_pct: 0.15,
        resource_efficiency_pct: 0.08,
        waste_reduction_pct: 0.10,
        circular_economy_pct: 0.05,
        reputation_uplift_pct: 0.03,
        green_market_access_pct: 0.05,
        turnover_reduction_pct: 0.20,
        productivity_gain_pct: 0.10,
        gov_subsidies: 15000,

        // Economic Settings
        tax_rate: 0.25,
        discount_rate: 0.08,
        inflation_rate: 0.02,
        depreciation_years: 5,
        wacc: 0.07
    });

    const [activePreset, setActivePreset] = useState("Baseline");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [outputs, setOutputs] = useState(null);
    const [loading, setLoading] = useState(false);

    // -- Effects --
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await calculateSmeImpact(inputs);
                setOutputs(data);
            } catch (err) {
                console.error("Simulation failed", err);
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchResults, 200);
        return () => clearTimeout(debounce);
    }, [inputs]);

    // -- Helpers --
    const h = (key, val) => {
        setInputs(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-slate-100 overflow-hidden font-sans">
            {/* -- Top Header Bar -- */}
            <div className="h-12 border-b border-indigo-500/10 flex items-center justify-between px-6 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter text-slate-100 uppercase">SME Resilience Simulator V2</h1>
                        <p className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest leading-none">Scenario-Driven Financial Analysis</p>
                    </div>
                </div>
            </div>

            {/* -- Main Content -- */}
            <div className="flex-1 min-h-0 flex gap-2 p-2 overflow-hidden">

                {/* -- Left Panel: Inputs -- */}
                <div className="w-[380px] flex-none flex flex-col glass-panel rounded-xl overflow-hidden border-indigo-500/10 shadow-2xl">
                    <div className="px-5 py-4 border-b border-white/5 bg-slate-800/20 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300">Parameters</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 customized-scrollbar">

                        {/* 1. General Info */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-indigo-400 mb-4 flex items-center gap-3 uppercase tracking-[0.25em]">
                                <Users className="w-4 h-4" /> Company Profile
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Industry</label>
                                    <select value={inputs.industry} onChange={e => h('industry', e.target.value)} className="input-field w-full">
                                        {['Manufacturing', 'Services', 'Retail', 'Agri-food', 'Construction'].map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Horizon</label>
                                    <select value={inputs.forecast_horizon} onChange={e => h('forecast_horizon', parseInt(e.target.value))} className="input-field w-full">
                                        {[5, 7, 10].map(opt => <option key={opt} value={opt}>{opt} Years</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Baseline Financials */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-emerald-400 mb-4 flex items-center gap-3 uppercase tracking-[0.25em]">
                                <DollarSign className="w-4 h-4" /> Baseline Financials
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <NumericInput label="Init. Revenue" value={inputs.initial_revenue} onChange={v => h('initial_revenue', v)} prefix="€" compact />
                                <NumericInput label="Fixed Costs" value={inputs.fixed_costs} onChange={v => h('fixed_costs', v)} prefix="€" compact />
                                <SliderControl label="Var. Costs" value={Math.round(inputs.variable_costs_pct * 100)} onChange={v => h('variable_costs_pct', v / 100)} suffix="%" compact />
                                <SliderControl label="Rev. Growth" value={Math.round(inputs.revenue_growth_rate * 100)} onChange={v => h('revenue_growth_rate', v / 100)} suffix="%" compact />
                            </div>
                        </div>

                        {/* 3. Sustainability Strategy */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-indigo-400 mb-4 flex items-center gap-3 uppercase tracking-[0.25em]">
                                <Leaf className="w-4 h-4" /> Sustainability Strategy
                            </h3>
                            <NumericInput label="Sustainability CAPEX" value={inputs.sustainability_capex} onChange={v => h('sustainability_capex', v)} prefix="€" />
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Efficiency Gains</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <SliderControl label="Energy" value={Math.round(inputs.energy_efficiency_pct * 100)} onChange={v => h('energy_efficiency_pct', v / 100)} suffix="%" compact />
                                    <SliderControl label="Waste" value={Math.round(inputs.waste_reduction_pct * 100)} onChange={v => h('waste_reduction_pct', v / 100)} suffix="%" compact />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Market & Reputation</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <SliderControl label="Reputation" value={Math.round(inputs.reputation_uplift_pct * 100)} onChange={v => h('reputation_uplift_pct', v / 100)} suffix="%" compact />
                                    <SliderControl label="Green Market" value={Math.round(inputs.green_market_access_pct * 100)} onChange={v => h('green_market_access_pct', v / 100)} suffix="%" compact />
                                </div>
                            </div>
                        </div>

                        {/* 4. Advanced Settings */}
                        <div className="pt-2 border-t border-slate-700/50">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full py-2 px-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-xs font-semibold hover:bg-slate-700/50 transition-all group"
                            >
                                <span className="group-hover:text-indigo-400 transition-colors tracking-widest uppercase text-[10px]">Financial Settings</span>
                                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 space-y-4 pl-4 border-l border-indigo-500/20 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <NumericInput label="Tax Rate" value={Math.round(inputs.tax_rate * 100)} onChange={v => h('tax_rate', v / 100)} suffix="%" compact />
                                        <NumericInput label="Discount" value={Math.round(inputs.discount_rate * 100)} onChange={v => h('discount_rate', v / 100)} suffix="%" compact />
                                        <NumericInput label="Depr. Years" value={Math.round(inputs.depreciation_years)} onChange={v => h('depreciation_years', v)} suffix="Y" compact />
                                        <NumericInput label="Inflation" value={Math.round(inputs.inflation_rate * 100)} onChange={v => h('inflation_rate', v / 100)} suffix="%" compact />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* -- Right Panel: Results -- */}
                <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">

                    {/* Row 1: Scorecards */}
                    <div className="grid grid-cols-4 gap-3 flex-none h-28">
                        <ScoreCard title="Economic" score={outputs?.scores?.economic || 0} icon={DollarSign} color="blue" />
                        <ScoreCard title="Environmental" score={outputs?.scores?.environmental || 0} icon={Leaf} color="green" />
                        <ScoreCard title="Strategic" score={outputs?.scores?.strategic || 0} icon={TrendingUp} color="amber" />
                        <ScoreCard title="Overall Score" score={outputs?.scores?.overall || 0} icon={Zap} isMain />
                    </div>

                    {/* Row 2: Projection Charts & Heatmap */}
                    <div className="flex-none grid grid-cols-12 gap-3 h-[340px]">
                        <div className="col-span-4 glass-panel rounded-xl animate-fade-in shadow-xl bg-slate-900/40" style={{ animationDelay: '0.1s' }}>
                            <ProjectionChart
                                data={outputs?.projections}
                                title="Revenue"
                                dataKeyA="revenue_a"
                                dataKeyB="revenue_b"
                            />
                        </div>
                        <div className="col-span-4 glass-panel rounded-xl animate-fade-in shadow-xl bg-slate-900/40" style={{ animationDelay: '0.2s' }}>
                            <ProjectionChart
                                data={outputs?.projections}
                                title="Net Profit"
                                dataKeyA="profit_a"
                                dataKeyB="profit_b"
                            />
                        </div>
                        <div className="col-span-4 glass-panel rounded-xl animate-fade-in shadow-xl bg-slate-900/40" style={{ animationDelay: '0.3s' }}>
                            <ImpactHeatmap cells={outputs?.heatmap} />
                        </div>
                    </div>

                    {/* Row 3: Deep Metrics & Balance/Alerts */}
                    <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
                        <div className="col-span-12 glass-panel rounded-xl animate-fade-in overflow-hidden relative shadow-lg" style={{ animationDelay: '0.4s' }}>
                            <div className="grid grid-cols-12 h-full">
                                <div className="col-span-8 border-r border-white/5">
                                    <DeepMetricsPanel details={outputs?.details} />
                                </div>
                                <div className="col-span-4 flex flex-col">
                                    <div className="flex-1 border-b border-white/5 overflow-hidden">
                                        <AlertBox alerts={outputs?.alerts} />
                                    </div>
                                    <div className="h-44 p-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Strategy Balance</h3>
                                        <RadarPlot scores={outputs?.scores} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .input-field {
                    @apply bg-slate-800/60 border border-slate-700/50 rounded px-2 py-1.5 text-[11px] font-black text-indigo-100 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-lg;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .input-field option {
                    @apply bg-slate-900 text-indigo-100 font-bold py-2;
                }
                .glass-panel {
                    @apply bg-slate-900/60 backdrop-blur-xl border border-white/5;
                }
                .customized-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .customized-scrollbar::-webkit-scrollbar-track {
                    @apply bg-transparent;
                }
                .customized-scrollbar::-webkit-scrollbar-thumb {
                    @apply bg-slate-700/50 rounded-full hover:bg-slate-600/50;
                }
            `}</style>
        </div>
    );
};

export default ClimateSimulator;
