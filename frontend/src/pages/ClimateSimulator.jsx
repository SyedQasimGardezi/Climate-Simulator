import React, { useState, useEffect } from 'react';
import { calculateSmeImpact } from '../services/api';
import { SliderControl, ScoreCard, ImpactHeatmap, RadarPlot, AlertBox, DeepMetricsPanel } from '../components/DashboardComponents';
import { ChevronDown, ChevronUp, Settings, Activity, Zap, BarChart3, Globe, Shield, AlertTriangle, Info, CheckCircle, XCircle, CheckCircle2 } from 'lucide-react';

const ClimateSimulator = () => {
    // -- Inputs State --
    const [inputs, setInputs] = useState({
        // Basic - Economic
        capex: 30, opex: 0, annual_savings: 40, downtime: 20,
        // Basic - Environmental
        scope1: 25, scope2: 25, scope3: 20, waste: 20,
        // Basic - Strategic
        complexity: 30, supply_risk: 30, regulatory: 30, reputation: 25,
        // Dropdowns
        industry: "Manufacturing", company_size: "SME", region: "EU",
        // Advanced - Economic
        wacc: 30, payback_tolerance: 50, incentives: 20, price_premium: 15,
        // Advanced - Environmental
        water: 10, material: 15, pollutants: 10, measurement_confidence: 30,
        // Advanced - Strategic
        capability: 30, supplier_concentration: 40, lead_time: 35, stakeholder: 30
    });

    const presets = {
        Baseline: { capex: 30, opex: 0, annual_savings: 40, scope1: 25, scope2: 25, scope3: 20, complexity: 30, reputation: 25, capability: 30 },
        Conservative: { capex: 10, opex: 5, annual_savings: 15, scope1: 10, scope2: 10, scope3: 5, complexity: 10, reputation: 10, capability: 10 },
        Balanced: { capex: 50, opex: 15, annual_savings: 60, scope1: 45, scope2: 40, scope3: 35, complexity: 50, reputation: 50, capability: 50 },
        Aggressive: { capex: 85, opex: 30, annual_savings: 95, scope1: 90, scope2: 85, scope3: 80, complexity: 80, reputation: 90, capability: 90 }
    };

    const [activePreset, setActivePreset] = useState("Baseline");

    const applyPreset = (name) => {
        setActivePreset(name);
        setInputs(prev => ({ ...prev, ...presets[name] }));
    };

    // -- UI State --
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
    const handleSliderChange = (key, val) => {
        setInputs(prev => ({ ...prev, [key]: val }));
    };

    const handleDropdownChange = (key, val) => {
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
                        <h1 className="text-sm font-black tracking-tighter text-slate-100 uppercase">SME Resilience Simulator</h1>
                        <p className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest leading-none">Strategic Decision Support</p>
                    </div>
                </div>

                <div className="flex bg-slate-800/40 p-1 rounded-lg border border-slate-700/30 gap-1">
                    {Object.keys(presets).map(p => (
                        <button
                            key={p}
                            onClick={() => applyPreset(p)}
                            className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activePreset === p
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* -- Main Content -- */}
            <div className="flex-1 min-h-0 flex gap-2 p-2 overflow-hidden">

                {/* -- Left Panel: Sliders -- */}
                <div className="w-[360px] flex-none flex flex-col glass-panel rounded-xl overflow-hidden border-indigo-500/10 shadow-2xl">
                    <div className="px-5 py-4 border-b border-white/5 bg-slate-800/20 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300">Configuration</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 customized-scrollbar">
                        {/* Dropdowns */}
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                            {['industry', 'company_size', 'region'].map(field => (
                                <div key={field} className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">
                                        {field.replace('_', ' ')}
                                    </label>
                                    <select
                                        value={inputs[field]}
                                        onChange={(e) => handleDropdownChange(field, e.target.value)}
                                        className="w-full py-2.5 px-3 text-[11px] font-bold border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                                    >
                                        {field === 'industry' && <><option>Manufacturing</option><option>Services</option><option>Retail</option><option>Agri-food</option><option>Construction</option></>}
                                        {field === 'company_size' && <><option>Micro</option><option>SME</option><option>Mid</option></>}
                                        {field === 'region' && <><option>EU</option><option>Non-EU</option></>}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[11px] font-black text-cyan-400 mb-6 flex items-center gap-3 uppercase tracking-[0.25em]">
                                    <BarChart3 className="w-5 h-5" /> Economic Factors
                                </h3>
                                <div className="space-y-4">
                                    <SliderControl label="CAPEX Burden" value={inputs.capex} onChange={v => handleSliderChange('capex', v)} compact />
                                    <SliderControl label="OPEX Change" value={inputs.opex} min={-50} max={50} onChange={v => handleSliderChange('opex', v)} compact />
                                    <SliderControl label="Annual Savings" value={inputs.annual_savings} onChange={v => handleSliderChange('annual_savings', v)} compact />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[11px] font-black text-cyan-400 mb-6 flex items-center gap-3 uppercase tracking-[0.25em]">
                                    <Globe className="w-5 h-5" /> Environmental
                                </h3>
                                <div className="space-y-4">
                                    <SliderControl label="Scope 1 Red." value={inputs.scope1} onChange={v => handleSliderChange('scope1', v)} compact />
                                    <SliderControl label="Scope 2 Red." value={inputs.scope2} onChange={v => handleSliderChange('scope2', v)} compact />
                                    <SliderControl label="Waste Reduction" value={inputs.waste} onChange={v => handleSliderChange('waste', v)} compact />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[11px] font-black text-amber-400 mb-6 flex items-center gap-3 uppercase tracking-[0.25em]">
                                    <Shield className="w-5 h-5" /> Strategic
                                </h3>
                                <div className="space-y-4">
                                    <SliderControl label="Complexity" value={inputs.complexity} onChange={v => handleSliderChange('complexity', v)} compact />
                                    <SliderControl label="Supply Risk" value={inputs.supply_risk} onChange={v => handleSliderChange('supply_risk', v)} compact />
                                    <SliderControl label="Regulatory" value={inputs.regulatory} onChange={v => handleSliderChange('regulatory', v)} compact />
                                </div>
                            </div>
                        </div>

                        {/* ADVANCED Toggle */}
                        <div className="pt-2 border-t border-slate-700/50">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full py-1.5 px-2 bg-slate-800/40 border border-slate-700/50 rounded text-xs font-semibold hover:bg-slate-700/50 transition-all group"
                            >
                                <span className="group-hover:text-indigo-400 transition-colors text-[9px] uppercase tracking-wider">Advanced</span>
                                {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>

                            {showAdvanced && (
                                <div className="mt-3 space-y-4 pl-2 border-l border-indigo-500/20 animate-fade-in pb-2">
                                    <div>
                                        <h3 className="text-[9px] font-bold text-slate-500 mb-1 uppercase">Econ Fine Tuning</h3>
                                        <div className="space-y-1.5">
                                            <SliderControl label="WACC" value={inputs.wacc} onChange={v => handleSliderChange('wacc', v)} compact />
                                            <SliderControl label="Payback Tol." value={inputs.payback_tolerance} onChange={v => handleSliderChange('payback_tolerance', v)} compact />
                                            <SliderControl label="Price Premium" value={inputs.price_premium} onChange={v => handleSliderChange('price_premium', v)} compact />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[9px] font-bold text-slate-500 mb-1 uppercase">Env Footprint</h3>
                                        <div className="space-y-1.5">
                                            <SliderControl label="Water" value={inputs.water} onChange={v => handleSliderChange('water', v)} compact />
                                            <SliderControl label="Material" value={inputs.material} onChange={v => handleSliderChange('material', v)} compact />
                                            <SliderControl label="Data Conf." value={inputs.measurement_confidence} onChange={v => handleSliderChange('measurement_confidence', v)} compact />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[9px] font-bold text-slate-500 mb-1 uppercase">Strategic Res.</h3>
                                        <div className="space-y-1.5">
                                            <SliderControl label="Capability" value={inputs.capability} onChange={v => handleSliderChange('capability', v)} compact />
                                            <SliderControl label="Supplier Conc." value={inputs.supplier_concentration} onChange={v => handleSliderChange('supplier_concentration', v)} compact />
                                            <SliderControl label="Stakeholder" value={inputs.stakeholder} onChange={v => handleSliderChange('stakeholder', v)} compact />
                                        </div>
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
                        <ScoreCard title="Economic" score={outputs?.scores?.economic || 0} icon={BarChart3} color="blue" />
                        <ScoreCard title="Environmental" score={outputs?.scores?.environmental || 0} icon={Globe} color="green" />
                        <ScoreCard title="Strategic" score={outputs?.scores?.strategic || 0} icon={Shield} color="amber" />
                        <ScoreCard title="Overall" score={outputs?.scores?.overall || 0} icon={Zap} isMain />
                    </div>

                    {/* Row 2: Radar & Heatmap */}
                    <div className="flex-none grid grid-cols-12 gap-3 h-64">
                        <div className="col-span-8 h-full glass-panel rounded-xl p-0 animate-fade-in shadow-lg" style={{ animationDelay: '0.2s' }}>
                            <ImpactHeatmap cells={outputs?.heatmap} />
                        </div>
                        <div className="col-span-4 h-full glass-panel rounded-xl p-6 flex flex-col items-center animate-fade-in shadow-lg" style={{ animationDelay: '0.3s' }}>
                            <h3 className="w-full text-[12px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6">Balance</h3>
                            <RadarPlot scores={outputs?.scores} />
                        </div>
                    </div>

                    {/* Row 3: Deep Metrics & Alerts */}
                    <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
                        <div className="col-span-8 glass-panel rounded-xl animate-fade-in overflow-hidden relative shadow-lg" style={{ animationDelay: '0.4s' }}>
                            <DeepMetricsPanel details={outputs?.details} />
                        </div>
                        <div className="col-span-4 glass-panel rounded-xl animate-fade-in overflow-hidden relative shadow-lg" style={{ animationDelay: '0.5s' }}>
                            <AlertBox alerts={outputs?.alerts} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClimateSimulator;
