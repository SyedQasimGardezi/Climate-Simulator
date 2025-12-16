import React from 'react';
import { Info } from 'lucide-react';

const SliderControl = ({ label, value, onChange, min = -100, max = 100, step = 1, unit = '', tooltip = '' }) => {
    // Calculate percentage for background gradient
    const percentage = ((value - min) / (max - min)) * 100;

    // Calculate the position of '0' on the slider track
    // If 0 is within range, anchor there. If range is all positive, anchor at left. If all negative, anchor at right.
    let zeroPosition = 0;
    if (min >= 0) {
        zeroPosition = 0;
    } else if (max <= 0) {
        zeroPosition = 100;
    } else {
        zeroPosition = ((0 - min) / (max - min)) * 100;
    }

    const left = Math.min(percentage, zeroPosition);
    const width = Math.abs(percentage - zeroPosition);

    return (
        <div className="mb-4 group">
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {label}
                    </label>
                    {tooltip && (
                        <div className="relative group/tooltip">
                            <Info size={14} className="text-gray-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-gray-200 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-900/50">
                    {value > 0 ? '+' : ''}{value}{unit}
                </span>
            </div>

            <div className="relative h-6 flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    {/* Center Marker (Only show if 0 IS inside the range and not at edges) */}
                    {min < 0 && max > 0 && (
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-0"
                            style={{ left: `${zeroPosition}%` }}
                        ></div>
                    )}
                </div>

                {/* Range Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb (Visual Only - positioned by JS logic) */}
                <div
                    className="absolute h-4 w-4 bg-white rounded-full shadow-lg border-2 border-emerald-500 pointer-events-none transition-all duration-75 ease-out z-1"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                ></div>

                {/* Active Track (Visual Only) */}
                <div
                    className="absolute h-1.5 bg-emerald-500 rounded-full pointer-events-none transition-all duration-75 ease-out"
                    style={{
                        left: `${left}%`,
                        width: `${width}%`
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SliderControl;
