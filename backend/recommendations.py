from .config import RECOMMENDATION_THRESHOLDS, EMISSION_FACTORS

class RecommendationEngine:
    """Generate personalized recommendations based on user data"""
    
    @staticmethod
    def analyze_patterns(df):
        """Analyze user patterns and generate recommendations"""
        if df.empty:
            return []
        
        recommendations = []
        
        # Analyze by category
        category_totals = df.groupby('category')['carbon_footprint'].sum().to_dict()
        
        # Transportation recommendations
        if 'transportation' in category_totals:
            transport_total = category_totals['transportation']
            transport_activities = df[df['category'] == 'transportation']
            
            # Check for high car usage
            car_activities = transport_activities[
                transport_activities['subcategory'].str.contains('car', case=False, na=False)
            ]
            if not car_activities.empty:
                car_total = car_activities['carbon_footprint'].sum()
                if car_total > 10:
                    recommendations.append({
                        'category': 'Transportation',
                        'icon': '🚗',
                        'title': 'Reduce Car Usage',
                        'description': f'Your car usage generated {car_total:.2f} kg CO₂. Consider carpooling, public transport, or cycling for short trips.',
                        'potential_saving': car_total * 0.5,
                        'priority': 'high'
                    })
            
            # Suggest public transport
            if transport_total > 15:
                recommendations.append({
                    'category': 'Transportation',
                    'icon': '🚌',
                    'title': 'Use Public Transportation',
                    'description': 'Switching to public transport can reduce your transportation emissions by up to 45%.',
                    'potential_saving': transport_total * 0.45,
                    'priority': 'high'
                })
        
        # Energy recommendations
        if 'energy' in category_totals:
            energy_total = category_totals['energy']
            
            if energy_total > 20:
                recommendations.append({
                    'category': 'Energy',
                    'icon': '⚡',
                    'title': 'Reduce Energy Consumption',
                    'description': 'Your energy usage is high. Consider using energy-efficient appliances and LED bulbs.',
                    'potential_saving': energy_total * 0.3,
                    'priority': 'high'
                })
            
            # Suggest renewable energy
            energy_activities = df[df['category'] == 'energy']
            renewable = energy_activities[
                energy_activities['subcategory'].isin(['solar', 'wind'])
            ]
            if renewable.empty and energy_total > 10:
                recommendations.append({
                    'category': 'Energy',
                    'icon': '☀️',
                    'title': 'Switch to Renewable Energy',
                    'description': 'Consider switching to renewable energy sources like solar or wind power.',
                    'potential_saving': energy_total * 0.8,
                    'priority': 'medium'
                })
        
        # Food recommendations
        if 'food' in category_totals:
            food_total = category_totals['food']
            food_activities = df[df['category'] == 'food']
            
            # Check for high meat consumption
            meat_activities = food_activities[
                food_activities['subcategory'].isin(['beef', 'lamb', 'pork'])
            ]
            if not meat_activities.empty:
                meat_total = meat_activities['carbon_footprint'].sum()
                if meat_total > 10:
                    recommendations.append({
                        'category': 'Food',
                        'icon': '🥗',
                        'title': 'Reduce Meat Consumption',
                        'description': f'Your meat consumption generated {meat_total:.2f} kg CO₂. Try plant-based meals a few times a week.',
                        'potential_saving': meat_total * 0.6,
                        'priority': 'high'
                    })
            
            # Suggest local and seasonal food
            if food_total > 15:
                recommendations.append({
                    'category': 'Food',
                    'icon': '🌾',
                    'title': 'Choose Local & Seasonal',
                    'description': 'Buy local and seasonal produce to reduce transportation emissions.',
                    'potential_saving': food_total * 0.2,
                    'priority': 'medium'
                })
        
        # Waste recommendations
        if 'waste' in category_totals:
            waste_total = category_totals['waste']
            waste_activities = df[df['category'] == 'waste']
            
            # Check for landfill waste
            landfill = waste_activities[waste_activities['subcategory'] == 'landfill']
            if not landfill.empty:
                landfill_total = landfill['carbon_footprint'].sum()
                if landfill_total > 5:
                    recommendations.append({
                        'category': 'Waste',
                        'icon': '♻️',
                        'title': 'Increase Recycling',
                        'description': f'You sent {landfill_total:.2f} kg to landfill. Increase recycling and composting.',
                        'potential_saving': landfill_total * 0.7,
                        'priority': 'medium'
                    })
        
        # General recommendations if no specific issues
        if not recommendations:
            recommendations.append({
                'category': 'General',
                'icon': '🌱',
                'title': 'Keep Up the Good Work!',
                'description': 'Your carbon footprint is relatively low. Continue your sustainable practices!',
                'potential_saving': 0,
                'priority': 'low'
            })
        
        # Sort by priority
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: priority_order[x['priority']])
        
        return recommendations
    
    @staticmethod
    def get_general_tips():
        """Get general sustainability tips"""
        return [
            {
                'icon': '💡',
                'title': 'Energy Saving',
                'tip': 'Turn off lights and unplug devices when not in use.'
            },
            {
                'icon': '🚴',
                'title': 'Active Transport',
                'tip': 'Walk or bike for short distances instead of driving.'
            },
            {
                'icon': '🛍️',
                'title': 'Reduce, Reuse, Recycle',
                'tip': 'Bring reusable bags and containers when shopping.'
            },
            {
                'icon': '🌡️',
                'title': 'Temperature Control',
                'tip': 'Adjust your thermostat by 2°C to save energy.'
            },
            {
                'icon': '💧',
                'title': 'Water Conservation',
                'tip': 'Take shorter showers and fix leaky faucets.'
            },
            {
                'icon': '🌿',
                'title': 'Plant-Based Diet',
                'tip': 'Try "Meatless Mondays" to reduce your food footprint.'
            },
        ]
