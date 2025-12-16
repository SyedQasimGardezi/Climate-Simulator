import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/api';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await getRecommendations();
                setRecommendations(data);
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-700 border-red-100';
            case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Recommendations</h2>
                <p className="text-gray-500 mt-1">Personalized tips to reduce your carbon footprint.</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Analyzing your habits...</div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {recommendations.map((rec, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-6 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center transition-all hover:shadow-md",
                                getPriorityColor(rec.priority)
                            )}
                        >
                            <div className="text-4xl bg-white p-4 rounded-xl shadow-sm">
                                {rec.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold">{rec.title}</h3>
                                    <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-white/50 border border-current opacity-80">
                                        {rec.priority} Priority
                                    </span>
                                </div>
                                <p className="opacity-90 mb-2">{rec.description}</p>
                                <div className="flex items-center gap-2 font-medium text-sm opacity-80">
                                    <Lightbulb size={16} />
                                    Potential Saving: {rec.potential_saving.toFixed(2)} kg CO₂
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm whitespace-nowrap">
                                Take Action <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}

                    {recommendations.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <p className="text-gray-500">No recommendations yet. Start tracking activities to get personalized tips!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Recommendations;
