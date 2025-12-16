import React, { useEffect, useState } from 'react';
import { getActivities, deleteActivity } from '../services/api';
import { Trash2, Calendar, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const data = await getActivities({ category: filter });
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [filter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await deleteActivity(id);
                setActivities(activities.filter(a => a.id !== id));
            } catch (error) {
                console.error("Failed to delete activity", error);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">History</h2>
                    <p className="text-gray-500 mt-1">View and manage your logged activities.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent outline-none text-sm font-medium text-gray-600"
                    >
                        <option value="All">All Categories</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Energy">Energy</option>
                        <option value="Food">Food</option>
                        <option value="Waste">Waste</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading activities...</div>
                ) : activities.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No activities found</h3>
                        <p className="text-gray-500 mt-1">Start tracking to see your history here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Impact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                                activity.category === 'transportation' ? "bg-blue-100 text-blue-800" :
                                                    activity.category === 'energy' ? "bg-yellow-100 text-yellow-800" :
                                                        activity.category === 'food' ? "bg-green-100 text-green-800" :
                                                            "bg-red-100 text-red-800"
                                            )}>
                                                {activity.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium text-gray-900 capitalize">
                                                {activity.subcategory.replace(/_/g, ' ')}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {activity.amount} {activity.unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {activity.carbon_footprint.toFixed(2)} kg CO₂
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
