import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Lightbulb, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: PlusCircle, label: 'Track Activity', to: '/track' },
        { icon: History, label: 'History', to: '/history' },
        { icon: Lightbulb, label: 'Recommendations', to: '/recommendations' },
        { icon: Globe, label: 'Climate Simulator', to: '/simulator' },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="text-3xl">🌱</span> Sustaine
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1"
                                    : "text-gray-600 hover:bg-emerald-50 hover:text-primary"
                            )
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-6 border-t border-gray-100">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-emerald-800 font-medium">
                        "Small steps make a big impact." 🌍
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
