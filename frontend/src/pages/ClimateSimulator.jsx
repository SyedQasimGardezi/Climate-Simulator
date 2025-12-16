import React, { useState, useEffect } from 'react';
import { simulateClimate } from '../services/api';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SliderControl from '../components/SliderControl';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const ClimateSimulator = () => {
    const [params, setParams] = useState({
        // Energy Supply
        coal_tax: 0,
        oil_tax: 0,
        gas_tax: 0,
        bioenergy_tax: 0,
        renewables_subsidy: 0,
        nuclear_subsidy: 0,
        new_tech_subsidy: 0,
        carbon_price: 0,
        // Transport
        transport_efficiency: 0,
        transport_electrification: 0,
        // Buildings
        buildings_efficiency: 0,
        buildings_electrification: 0,
        // Growth
        population_growth: 0,
        economic_growth: 0,
        // Land
        deforestation: 0,
        methane_reduction: 0,
        afforestation: 0,
        // Removal
        technological_carbon_removal: 0
    });

    const [projection, setProjection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('supply');

    useEffect(() => {
        const runSimulation = async () => {
            setLoading(true);
            try {
                const data = await simulateClimate(params);
                // Transform data for Recharts
                const chartData = data.years.map((year, i) => ({
                    year,
                    temperature: data.global_temp[i],
                    co2: data.co2_concentration[i],
                    coal: data.energy_coal[i],
                    oil: data.energy_oil[i],
                    gas: data.energy_gas[i],
                    renewables: data.energy_renewables[i],
                    bio: data.energy_bio[i],
                    nuclear: data.energy_nuclear[i],
                    new_tech: data.energy_new_tech[i],
                }));
                setProjection({ ...data, chartData });
            } catch (error) {
                console.error("Failed to run simulation", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(runSimulation, 300); // Faster debounce for responsiveness
        return () => clearTimeout(debounce);
    }, [params]);

    const updateParam = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const resetParams = () => {
        setParams({
            coal_tax: 0, oil_tax: 0, gas_tax: 0, bioenergy_tax: 0,
            renewables_subsidy: 0, nuclear_subsidy: 0, new_tech_subsidy: 0, carbon_price: 0,
            transport_efficiency: 0, transport_electrification: 0,
            buildings_efficiency: 0, buildings_electrification: 0,
            population_growth: 0, economic_growth: 0,
            deforestation: 0, methane_reduction: 0, afforestation: 0,
            technological_carbon_removal: 0
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-100 font-sans overflow-hidden">
            {/* Header */}
            <header className="flex-none bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center z-20">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">Climate</span> Simulator
                    </h1>
                    <p className="text-xs text-gray-400">Climate Solutions Simulator</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Temperature Increase by 2100</p>
                        <p className="text-3xl font-bold text-white">
                            +{projection?.global_temp[projection.global_temp.length - 1].toFixed(1)}°C
                        </p>
                    </div>
                    <button
                        onClick={resetParams}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Reset Scenarios"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content (Graphs) */}
            <div className="flex-1 min-h-0 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Graph: Global Sources of Primary Energy */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg flex flex-col min-h-0">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex-none">Global Sources of Primary Energy</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projection?.chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCoal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#525252" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#525252" stopOpacity={0} />
                                    </linearGradient>
                                    {/* Add more gradients if needed */}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: 'Exajoules/year', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                                <Area type="monotone" dataKey="coal" stackId="1" stroke="#404040" fill="#525252" name="Coal" />
                                <Area type="monotone" dataKey="oil" stackId="1" stroke="#991B1B" fill="#B91C1C" name="Oil" />
                                <Area type="monotone" dataKey="gas" stackId="1" stroke="#1E3A8A" fill="#2563EB" name="Natural Gas" />
                                <Area type="monotone" dataKey="bio" stackId="1" stroke="#A16207" fill="#CA8A04" name="Bioenergy" />
                                <Area type="monotone" dataKey="renewables" stackId="1" stroke="#065F46" fill="#10B981" name="Renewables" />
                                <Area type="monotone" dataKey="nuclear" stackId="1" stroke="#4C1D95" fill="#8B5CF6" name="Nuclear" />
                                <Area type="monotone" dataKey="new_tech" stackId="1" stroke="#BE185D" fill="#EC4899" name="New Tech" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Graph: Temperature Change */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg flex flex-col min-h-0">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex-none">Global Temperature Change</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={projection?.chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 'auto']} label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }}
                                />
                                <Legend iconType="plainline" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                                <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={3} dot={false} name="Current Scenario" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Control Panel (Fixed Bottom) */}
            <div className="flex-none bg-gray-800 border-t border-gray-700 h-[350px] overflow-y-auto z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                        {['supply', 'transport', 'buildings', 'growth', 'land', 'removal'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-3 text-sm font-medium transition-colors capitalize border-b-2",
                                    activeTab === tab
                                        ? "text-emerald-400 border-emerald-400 bg-gray-700/50"
                                        : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30"
                                )}
                            >
                                {tab === 'supply' ? 'Energy Supply' : tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                        {activeTab === 'supply' && (
                            <>
                                <SliderControl label="Coal" value={params.coal_tax} onChange={(v) => updateParam('coal_tax', v)} tooltip="Tax or subsidize coal" />
                                <SliderControl label="Oil" value={params.oil_tax} onChange={(v) => updateParam('oil_tax', v)} />
                                <SliderControl label="Natural Gas" value={params.gas_tax} onChange={(v) => updateParam('gas_tax', v)} />
                                <SliderControl label="Bioenergy" value={params.bioenergy_tax} onChange={(v) => updateParam('bioenergy_tax', v)} />
                                <SliderControl label="Renewables" value={params.renewables_subsidy} onChange={(v) => updateParam('renewables_subsidy', v)} />
                                <SliderControl label="Nuclear" value={params.nuclear_subsidy} onChange={(v) => updateParam('nuclear_subsidy', v)} />
                                <SliderControl label="New Tech" value={params.new_tech_subsidy} onChange={(v) => updateParam('new_tech_subsidy', v)} />
                                <SliderControl label="Carbon Price" value={params.carbon_price} onChange={(v) => updateParam('carbon_price', v)} min={0} max={250} unit=" $/ton" />
                            </>
                        )}

                        {activeTab === 'transport' && (
                            <>
                                <SliderControl label="Energy Efficiency" value={params.transport_efficiency} onChange={(v) => updateParam('transport_efficiency', v)} min={0} max={5} step={0.1} unit="%/yr" />
                                <SliderControl label="Electrification" value={params.transport_electrification} onChange={(v) => updateParam('transport_electrification', v)} min={0} max={5} step={0.1} unit="%/yr" />
                            </>
                        )}

                        {activeTab === 'buildings' && (
                            <>
                                <SliderControl label="Energy Efficiency" value={params.buildings_efficiency} onChange={(v) => updateParam('buildings_efficiency', v)} min={0} max={5} step={0.1} unit="%/yr" />
                                <SliderControl label="Electrification" value={params.buildings_electrification} onChange={(v) => updateParam('buildings_electrification', v)} min={0} max={5} step={0.1} unit="%/yr" />
                            </>
                        )}

                        {activeTab === 'growth' && (
                            <>
                                <SliderControl label="Population Growth" value={params.population_growth} onChange={(v) => updateParam('population_growth', v)} min={-1} max={1} step={0.1} />
                                <SliderControl label="Economic Growth" value={params.economic_growth} onChange={(v) => updateParam('economic_growth', v)} min={-5} max={5} step={0.1} unit="%" />
                            </>
                        )}

                        {activeTab === 'land' && (
                            <>
                                <SliderControl label="Deforestation" value={params.deforestation} onChange={(v) => updateParam('deforestation', v)} min={-5} max={5} step={0.1} unit="%/yr" />
                                <SliderControl label="Methane & Other" value={params.methane_reduction} onChange={(v) => updateParam('methane_reduction', v)} min={0} max={100} unit="%" />
                                <SliderControl label="Afforestation" value={params.afforestation} onChange={(v) => updateParam('afforestation', v)} min={0} max={100} unit="%" />
                            </>
                        )}

                        {activeTab === 'removal' && (
                            <>
                                <SliderControl label="Tech Carbon Removal" value={params.technological_carbon_removal} onChange={(v) => updateParam('technological_carbon_removal', v)} min={0} max={100} unit="%" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClimateSimulator;
