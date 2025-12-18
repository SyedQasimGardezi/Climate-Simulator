import React from 'react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip
} from 'recharts';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export const SliderControl = ({ label, value, min = 0, max = 100, step = 1, onChange, suffix = "", compact = false }) => (
    <div className="group w-full">
        <div className={`flex justify-between ${compact ? 'mb-1' : 'mb-2'}`}>
            <label className={`font-medium text-slate-300 group-hover:text-white transition-colors ${compact ? 'text-[10px]' : 'text-sm'}`}>{label}</label>
            <span className={`font-bold text-indigo-400 tabular-nums ${compact ? 'text-[10px]' : 'text-sm'}`}>{value}{suffix}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            style={{
                backgroundImage: `linear-gradient(to right, #6366f1 0%, #0ea5e9 ${(value - min) / (max - min) * 100}%, #334155 ${(value - min) / (max - min) * 100}%, #334155 100%)`
            }}
        />
        <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: ${compact ? '10px' : '14px'};
            width: ${compact ? '10px' : '14px'};
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            margin-top: ${compact ? '-3px' : '-5px'}; 
            transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
    `}</style>
    </div>
);

export const ScoreCard = ({ title, score, icon: Icon, isMain = false, color = "blue" }) => {
    const getGradient = () => {
        if (isMain) return "from-indigo-500 to-purple-600";
        if (score < 40) return "from-rose-500 to-red-600";
        if (score < 60) return "from-amber-500 to-orange-600";
        return "from-emerald-500 to-teal-400";
    };

    const getBorder = () => {
        if (isMain) return "border-indigo-500/50";
        return "border-slate-700/50 hover:border-slate-600";
    }

    return (
        <div className={`glass-card rounded-lg p-2.5 flex flex-col items-start justify-between h-full relative overflow-hidden group ${getBorder()} ${isMain ? 'bg-indigo-900/20' : ''}`}>
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-4 -mt-4 pointer-events-none"></div>

            <div className="flex justify-between w-full items-start z-10">
                <h3 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isMain ? 'text-indigo-200' : 'text-slate-500'}`}>{title}</h3>
                {Icon && <Icon className={`w-3.5 h-3.5 ${isMain ? 'text-indigo-300' : 'text-slate-600'}`} />}
            </div>

            <div className="z-10 mt-auto">
                <div className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} tracking-tight leading-none`}>
                    {Math.round(score)}
                </div>
            </div>
        </div>
    );
};

export const ImpactHeatmap = ({ cells }) => {
    if (!cells || cells.length === 0) return null;

    const rows = ['Economic', 'Environmental', 'Strategic'];
    const cols = ['Upside', 'Risk', 'Feasibility'];
    const getCell = (r, c) => cells.find(cell => cell.row === r && cell.col === c);

    const getColorClass = (val, color) => {
        // Premium glowing styles
        if (color === 'red') return 'bg-rose-900/40 text-rose-300 border border-rose-800/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
        if (color === 'yellow') return 'bg-amber-900/40 text-amber-300 border border-amber-800/50';
        if (color === 'green') return 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
        return 'bg-slate-800 text-slate-600';
    };

    return (
        <div className="h-full flex flex-col p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Impact Matrix</h3>
            <div className="flex-1 grid grid-cols-4 gap-3 text-sm">
                {/* Header */}
                <div className="col-span-1"></div>
                {cols.map(c => (
                    <div key={c} className="flex items-center justify-center font-bold text-[10px] uppercase text-slate-500 tracking-wider text-center">{c}</div>
                ))}

                {/* Rows */}
                {rows.map(r => (
                    <React.Fragment key={r}>
                        <div className="flex items-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">{r}</div>
                        {cols.map(c => {
                            const cell = getCell(r, c);
                            return (
                                <div key={`${r}-${c}`} className={`rounded-lg flex flex-col items-center justify-center transition-all hover:scale-[1.02] ${getColorClass(cell?.value, cell?.color)}`}>
                                    <span className="text-xl font-bold">{cell ? Math.round(cell.value) : '-'}</span>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export const RadarPlot = ({ scores }) => {
    if (!scores) return null;
    const data = [
        { subject: 'Economic', A: scores.economic, fullMark: 100 },
        { subject: 'Strategy', A: scores.strategic, fullMark: 100 },
        { subject: 'Environ.', A: scores.environmental, fullMark: 100 },
    ];

    return (
        <div className="h-full w-full flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 w-full text-left">Balance</h3>
            <div className="flex-1 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="#6366f1"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#818cf8' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const AlertBox = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <CheckCircle className="mb-3 h-8 w-8 opacity-20" />
                <p className="text-sm font-medium">System nominal. No critical alerts.</p>
            </div>
        )
    }

    const getSeverityStyles = (s) => {
        switch (s) {
            case 'high': return 'bg-rose-950/30 border-l-rose-500 text-rose-200';
            case 'medium': return 'bg-amber-950/30 border-l-amber-500 text-amber-200';
            case 'low': return 'bg-indigo-950/30 border-l-indigo-500 text-indigo-200';
            default: return 'bg-slate-800 border-l-slate-500';
        }
    }

    return (
        <div className="h-full overflow-y-auto pr-2 customized-scrollbar">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> System Alerts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {alerts.map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded border border-white/5 border-l-4 text-xs shadow-sm ${getSeverityStyles(alert.severity)}`}>
                        <div className="font-bold uppercase mb-1 opacity-80 text-[10px] tracking-wide">{alert.severity} Priority</div>
                        <div className="leading-snug">{alert.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DeepMetricsPanel = ({ details }) => {
    if (!details) return null;

    const MetricBox = ({ label, value, unit, color }) => (
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center justify-center text-center hover:border-slate-600 transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{label}</span>
            <div className={`text-xl font-bold ${color || 'text-slate-200'}`}>
                {value} <span className="text-xs font-medium text-slate-500">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto customized-scrollbar pr-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                Deep Dive Indicators
            </h3>

            <div className="space-y-6">
                {/* Financial */}
                <div>
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-2 border-b border-indigo-500/20 pb-1">Financial Projection (5Y)</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <MetricBox label="ROI" value={details.roi_percent.toFixed(1)} unit="%" color={details.roi_percent > 0 ? "text-emerald-400" : "text-rose-400"} />
                        <MetricBox label="Payback" value={details.payback_years.toFixed(1)} unit="Yrs" />
                        <MetricBox label="Viability" value={Math.round(details.financial_viability)} unit="/100" />
                    </div>
                </div>

                {/* Environmental */}
                <div>
                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase mb-2 border-b border-emerald-500/20 pb-1">Carbon Impact</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <MetricBox label="Reduction" value={Math.round(details.carbon_reduction_tons)} unit="tCO2e" color="text-emerald-300" />
                        <MetricBox label="Net Zero" value={details.net_zero_progress.toFixed(1)} unit="%" />
                    </div>
                </div>

                {/* Strategic */}
                <div>
                    <h4 className="text-[10px] font-bold text-amber-400 uppercase mb-2 border-b border-amber-500/20 pb-1">Risk Profile</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <MetricBox label="Resilience" value={Math.round(details.resilience_index)} unit="Idx" color="text-amber-200" />
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Exec Risk</span>
                            <div className={`text-sm font-bold uppercase px-2 py-1 rounded ${details.execution_risk_factor === 'High' ? 'bg-rose-900 text-rose-300' : (details.execution_risk_factor === 'Medium' ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300')}`}>
                                {details.execution_risk_factor}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
