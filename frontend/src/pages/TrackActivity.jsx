import React, { useState, useEffect } from 'react';
import { createActivity } from '../services/api';
import { Car, Zap, Utensils, Trash2, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES = [
    { id: 'transportation', name: 'Transportation', icon: Car, color: 'bg-blue-50 text-blue-600' },
    { id: 'energy', name: 'Energy', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-green-50 text-green-600' },
    { id: 'waste', name: 'Waste', icon: Trash2, color: 'bg-red-50 text-red-600' },
];

const SUBCATEGORIES = {
    transportation: ['car_gasoline', 'car_diesel', 'car_electric', 'bus', 'train', 'flight_short', 'flight_long'],
    energy: ['electricity_grid', 'electricity_renewable', 'natural_gas', 'heating_oil'],
    food: ['beef', 'lamb', 'pork', 'chicken', 'fish', 'dairy', 'vegetables', 'fruits', 'grains'],
    waste: ['landfill', 'recycling', 'compost'],
};

const TrackActivity = () => {
    const [selectedCategory, setSelectedCategory] = useState('transportation');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        subcategory: SUBCATEGORIES['transportation'][0],
        amount: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, subcategory: SUBCATEGORIES[selectedCategory][0] }));
    }, [selectedCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createActivity({
                ...formData,
                category: selectedCategory,
                amount: parseFloat(formData.amount),
                unit: selectedCategory === 'food' && formData.subcategory === 'milk' ? 'liters' :
                    selectedCategory === 'energy' ? 'kWh' :
                        selectedCategory === 'transportation' ? 'km' : 'kg'
            });
            setSuccess(true);
            setFormData({ ...formData, amount: '', notes: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to log activity", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Track Activity</h2>
                <p className="text-gray-500 mt-1">Log your daily activities to calculate your carbon footprint.</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                            selectedCategory === cat.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                        )}
                    >
                        <div className={cn("p-3 rounded-full mb-2", cat.color)}>
                            <cat.icon size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                                required
                                value={formData.subcategory}
                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            >
                                {SUBCATEGORIES[selectedCategory].map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount ({selectedCategory === 'energy' ? 'kWh' : selectedCategory === 'transportation' ? 'km' : 'kg'})
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            rows="3"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Logging...' : 'Log Activity'}
                    </button>
                </form>
            </div>

            {success && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
                    <CheckCircle className="text-emerald-400" />
                    <div>
                        <h4 className="font-semibold">Activity Logged!</h4>
                        <p className="text-sm text-gray-400">Your carbon footprint has been updated.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackActivity;
