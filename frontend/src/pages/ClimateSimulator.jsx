import React, { useState, useEffect } from 'react';
import { calculateSmeImpact } from '../services/api';
import { SliderControl, ScoreCard, ImpactHeatmap, RadarPlot, AlertBox, DeepMetricsPanel } from '../components/DashboardComponents';
import { ChevronDown, ChevronUp, Settings, Activity, Zap, BarChart3, Globe, Shield } from 'lucide-react';

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

    const applyPreset = (type) => {
        let newInputs = { ...inputs };
        switch (type) {
            case 'Baseline':
                newInputs = { ...newInputs, capex: 30, opex: 0, annual_savings: 40, complexity: 30 };
                break;
            case 'Conservative':
                newInputs = { ...newInputs, capex: 10, opex: 5, annual_savings: 20, complexity: 10, supply_risk: 10, reputation: 10 };
                break;
            case 'Balanced':
                newInputs = { ...newInputs, capex: 50, opex: 0, annual_savings: 60, complexity: 40, supply_risk: 30 };
                break;
            case 'Aggressive':
                newInputs = { ...newInputs, capex: 80, opex: -10, annual_savings: 90, complexity: 80, reputation: 80, supply_risk: 60 };
                break;
            default: break;
        }
        setInputs(newInputs);
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-slate-100 overflow-hidden font-sans">
            {/* -- Header -- */}
            <header className="flex-none px-4 py-2 flex justify-between items-center z-20 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm h-12">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <Activity className="text-indigo-400 h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                            SME Resilience <span className="text-gradient">Sim</span>
                        </h1>
                    </div>
                </div>

                {/* Presets */}
                <div className="flex bg-slate-800/80 rounded-lg p-0.5 gap-0.5 border border-slate-700/50 shadow-inner">
                    {['Baseline', 'Conservative', 'Balanced', 'Aggressive'].map(p => (
                        <button
                            key={p}
                            onClick={() => applyPreset(p)}
                            className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-all focus:bg-indigo-600 focus:text-white shadow-sm"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </header>

            {/* -- Main Content -- */}
            <div className="flex-1 min-h-0 flex gap-2 p-2 overflow-hidden">

                {/* -- Left Panel: Controls -- */}
                <div className="w-[28%] flex flex-col glass-panel rounded-lg overflow-hidden animate-fade-in shrink-0" style={{ animationDelay: '0.1s' }}>
                    <div className="px-3 py-2 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center shrink-0">
                        <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                            <Settings className="w-3 h-3" /> Config
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 customized-scrollbar">
                        {/* Dropdowns */}
                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                            {['industry', 'company_size', 'region'].map(field => (
                                <div key={field} className="space-y-1">
                                    <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                                        {field.replace('_', ' ')}
                                    </label>
                                    <select
                                        value={inputs[field]}
                                        onChange={(e) => handleDropdownChange(field, e.target.value)}
                                        className="w-full py-1.5 px-1.5 text-[9px] font-medium border border-slate-600 rounded bg-slate-700/50 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                                    >
                                        {field === 'industry' && <><option>Manufacturing</option><option>Services</option><option>Retail</option><option>Agri-food</option><option>Construction</option></>}
                                        {field === 'company_size' && <><option>Micro</option><option>SME</option><option>Mid</option></>}
                                        {field === 'region' && <><option>EU</option><option>Non-EU</option></>}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* BASIC Controls */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[9px] font-bold text-emerald-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                                    <BarChart3 className="w-3 h-3" /> Economic
                                </h3>
                                <div className="space-y-2">
                                    <SliderControl label="CAPEX Burden" value={inputs.capex} onChange={v => handleSliderChange('capex', v)} compact />
                                    <SliderControl label="OPEX Change" value={inputs.opex} min={-50} max={50} onChange={v => handleSliderChange('opex', v)} compact />
                                    <SliderControl label="Annual Savings" value={inputs.annual_savings} onChange={v => handleSliderChange('annual_savings', v)} compact />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[9px] font-bold text-cyan-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                                    <Globe className="w-3 h-3" /> Environmental
                                </h3>
                                <div className="space-y-2">
                                    <SliderControl label="Scope 1 Red." value={inputs.scope1} onChange={v => handleSliderChange('scope1', v)} compact />
                                    <SliderControl label="Scope 2 Red." value={inputs.scope2} onChange={v => handleSliderChange('scope2', v)} compact />
                                    <SliderControl label="Waste Red." value={inputs.waste} onChange={v => handleSliderChange('waste', v)} compact />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[9px] font-bold text-amber-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                                    <Shield className="w-3 h-3" /> Strategic
                                </h3>
                                <div className="space-y-2">
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
                <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-hidden">

                    {/* Row 1: Scorecards */}
                    <div className="grid grid-cols-4 gap-1.5 flex-none h-16">
                        <ScoreCard title="Economic" score={outputs?.scores?.economic || 0} icon={BarChart3} color="blue" />
                        <ScoreCard title="Environmental" score={outputs?.scores?.environmental || 0} icon={Globe} color="green" />
                        <ScoreCard title="Strategic" score={outputs?.scores?.strategic || 0} icon={Shield} color="amber" />
                        <ScoreCard title="Overall" score={outputs?.scores?.overall || 0} icon={Zap} isMain />
                    </div>

                    {/* Row 2: Radar & Heatmap */}
                    <div className="flex-none grid grid-cols-3 gap-1.5 h-40">
                        <div className="col-span-2 h-full glass-panel rounded-lg p-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <ImpactHeatmap cells={outputs?.heatmap} />
                        </div>
                        <div className="col-span-1 h-full glass-panel rounded-lg p-2 flex flex-col items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <RadarPlot scores={outputs?.scores} />
                        </div>
                    </div>

                    {/* Row 3: Alerts & Deep Metrics */}
                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5 overflow-hidden pb-1">
                        <div className="glass-panel rounded-lg p-3 animate-fade-in overflow-hidden relative" style={{ animationDelay: '0.4s' }}>
                            <AlertBox alerts={outputs?.alerts} />
                        </div>
                        <div className="glass-panel rounded-lg p-3 animate-fade-in overflow-hidden relative" style={{ animationDelay: '0.5s' }}>
                            <DeepMetricsPanel details={outputs?.details} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClimateSimulator;
