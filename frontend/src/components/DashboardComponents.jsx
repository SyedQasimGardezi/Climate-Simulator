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
        <div className={`flex justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
            <label className={`${compact ? 'text-[11px]' : 'text-xs'} font-black text-slate-400 uppercase tracking-[0.15em] group-hover:text-indigo-400 transition-colors`}>
                {label} {suffix && <span className="text-[10px] opacity-60 ml-1">{suffix}</span>}
            </label>
            <span className={`${compact ? 'text-[11px]' : 'text-sm'} font-black text-indigo-400 tabular-nums`}>{value}</span>
        </div>
        <div className="relative flex items-center h-6">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full cursor-pointer appearance-none bg-transparent"
                style={{
                    '--value': `${((value - min) / (max - min)) * 100}%`
                }}
            />
        </div>
        <style jsx>{`
        input[type=range] {
            height: 5px;
            background: linear-gradient(to right, #6366f1 0%, #0ea5e9 var(--value), #334155 var(--value), #334155 100%);
            border-radius: 9999px;
            outline: none;
            transition: background 0.1s ease-in-out;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: ${compact ? '14px' : '18px'};
            width: ${compact ? '14px' : '18px'};
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
            margin-top: ${compact ? '-4.5px' : '-6.5px'}; 
            transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        input[type=range]::-moz-range-thumb {
            height: ${compact ? '14px' : '18px'};
            width: ${compact ? '14px' : '18px'};
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
            border: none;
            transition: transform 0.1s;
        }
        input[type=range]::-moz-range-thumb:hover {
            transform: scale(1.2);
        }
    `}</style>
    </div>
);

export const ScoreCard = ({ title, score, icon: Icon, isMain = false, color = "blue" }) => {
    const getGradient = () => {
        if (isMain) return "from-purple-500 to-indigo-600";
        if (color === "blue") return "from-amber-400 to-orange-500"; // Economic (Yellow in image)
        if (color === "green") return "from-orange-400 to-amber-500"; // Environmental (Orange in image)
        if (color === "amber") return "from-rose-500 to-red-600"; // Strategic (Red in image)
        return "from-emerald-500 to-teal-400";
    };

    const getBorder = () => {
        if (isMain) return "border-purple-500/30";
        return "border-slate-800/80 hover:border-slate-700/80";
    }

    return (
        <div className={`glass-card rounded-lg p-5 flex flex-col items-start justify-between h-full relative overflow-hidden group ${getBorder()} ${isMain ? 'bg-indigo-900/10' : 'bg-slate-900/40'}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-8 -mt-8 pointer-events-none"></div>

            <div className="flex justify-between w-full items-start z-10">
                <h3 className={`text-[11px] font-black uppercase tracking-[0.25em] ${isMain ? 'text-indigo-300/80' : 'text-slate-500'}`}>{title}</h3>
                {Icon && <Icon className={`w-4 h-4 ${isMain ? 'text-indigo-400' : 'text-slate-700'}`} />}
            </div>

            <div className="z-10 mt-auto">
                <div className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} tracking-tighter leading-none`}>
                    {Math.round(score)}
                </div>
            </div>
        </div>
    );
};

export const ImpactHeatmap = ({ cells, rows = ['Economic', 'Environmental', 'Strategic'], cols = ['Upside', 'Risk', 'Feasibility'] }) => {
    if (!cells || cells.length === 0) return null;

    const getCell = (r, c) => cells.find(cell => cell.row === r && cell.col === c);

    const getColorClass = (val, color) => {
        if (color === 'red') return 'bg-rose-900/30 text-rose-400 border border-rose-500/20';
        if (color === 'yellow') return 'bg-amber-900/30 text-amber-400 border border-amber-500/20';
        if (color === 'green') return 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20';
        return 'bg-slate-800/40 text-slate-500 border border-slate-700/50';
    };

    return (
        <div className="h-full flex flex-col p-6 pb-100">
            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.25em] mb-8">Impact Matrix</h3>
            <div className="flex-1 grid grid-cols-4 gap-x-4 gap-y-4">
                {/* Header IPs */}
                <div className="col-span-1"></div>
                {cols.map(c => (
                    <div key={c} className="flex items-center justify-center font-black text-[10px] uppercase text-slate-600 tracking-[0.2em] text-center">{c}</div>
                ))}

                {/* Rows IPs */}
                {rows.map(r => (
                    <React.Fragment key={r}>
                        <div className="flex items-center text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{r}</div>
                        {cols.map(c => {
                            const cell = getCell(r, c);
                            return (
                                <div key={`${r}-${c}`} className={`h-11 rounded-full flex items-center justify-center transition-all hover:scale-[1.05] ${getColorClass(cell?.value, cell?.color)}`}>
                                    <span className="text-xl font-black tracking-tight">{cell ? Math.round(cell.value) : '-'}</span>
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
        <div className="h-full flex flex-col overflow-hidden">
            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 px-6 pt-6">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> System Alerts
            </h3>
            <div className="flex-1 overflow-y-auto customized-scrollbar px-6 pb-6">
                {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <CheckCircle2 className="h-16 w-16 mb-5 opacity-20" />
                        <span className="text-base font-black opacity-40 tracking-[0.2em] uppercase">System nominal</span>
                        <span className="text-[11px] font-medium opacity-30 tracking-widest mt-2 uppercase">No critical alerts detected.</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert, idx) => (
                            <div key={idx} className={`p-5 rounded-xl border border-white/5 border-l-[6px] text-sm shadow-sm ${getSeverityStyles(alert.severity)}`}>
                                <div className="font-black uppercase mb-1.5 opacity-80 text-[10px] tracking-[0.2em]">{alert.severity} Priority</div>
                                <div className="leading-relaxed font-bold">{alert.message}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const DeepMetricsPanel = ({ details }) => {
    if (!details) return null;

    const MetricBox = ({ label, value, unit, color }) => (
        <div className="bg-slate-800/20 rounded-lg p-5 border border-slate-700/30 flex flex-col items-center justify-center text-center group hover:bg-slate-800/40 transition-colors">
            <span className="text-[9px] uppercase font-black text-slate-600 tracking-[0.25em] mb-2 group-hover:text-slate-500">{label}</span>
            <div className={`text-2xl font-black ${color || 'text-slate-200'} tabular-nums leading-none`}>
                {value}<span className="text-sm ml-1 font-black opacity-30">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.25em] mb-8">Deep Dive Indicators</h3>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-8 customized-scrollbar pr-2">
                {/* Financial */}
                <div>
                    <h4 className="text-[10px] font-black text-indigo-400/80 uppercase mb-4 tracking-[0.25em] border-l-4 border-indigo-500/40 pl-4">Financial Projection (5Y)</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <MetricBox label="ROI" value={details.roi_percent.toFixed(1)} unit="%" color={details.roi_percent > 0 ? "text-emerald-400" : "text-rose-400"} />
                        <MetricBox label="Payback" value={details.payback_years.toFixed(1)} unit="Yrs" />
                        <MetricBox label="Viability" value={Math.round(details.financial_viability)} unit="/100" />
                    </div>
                </div>

                {/* Carbon */}
                <div>
                    <h4 className="text-[10px] font-black text-emerald-400/80 uppercase mb-4 tracking-[0.25em] border-l-4 border-emerald-500/40 pl-4">Carbon Impact</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <MetricBox label="Reduction" value={Math.round(details.carbon_reduction_tons)} unit="tCO2e" color="text-emerald-300" />
                        <MetricBox label="Net Zero Progress" value={details.net_zero_progress.toFixed(1)} unit="%" />
                    </div>
                </div>

                {/* Risk */}
                <div>
                    <h4 className="text-[10px] font-black text-amber-400/80 uppercase mb-4 tracking-[0.25em] border-l-4 border-amber-500/40 pl-4">Risk Profile</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <MetricBox label="Resilience Index" value={Math.round(details.resilience_index)} unit="Idx" color="text-amber-200" />
                        <div className="bg-slate-800/20 rounded-lg p-5 border border-slate-700/30 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] uppercase font-black text-slate-600 tracking-[0.25em] mb-2">Exec Risk</span>
                            <div className={`text-sm font-black uppercase px-4 py-1.5 rounded-sm ${details.execution_risk_factor === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : (details.execution_risk_factor === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')}`}>
                                {details.execution_risk_factor}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
