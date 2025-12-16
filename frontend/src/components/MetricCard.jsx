import React from 'react';
import { cn } from '../lib/utils';

const MetricCard = ({ title, value, subtext, icon: Icon, className, trend }) => {
    return (
        <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow", className)}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                {Icon && (
                    <div className="p-3 bg-emerald-50 rounded-xl text-primary">
                        <Icon size={24} />
                    </div>
                )}
            </div>
            {trend && (
                <div className={cn("mt-4 text-sm font-medium flex items-center gap-1",
                    trend > 0 ? "text-red-500" : "text-emerald-500"
                )}>
                    <span>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>
                    <span className="text-gray-400 font-normal">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
