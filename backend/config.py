# Configuration and Constants for Sustainability Tracker

# Carbon Emission Factors (kg CO2 per unit)
EMISSION_FACTORS = {
    'transportation': {
        'car_petrol': 0.192,      # kg CO2 per km
        'car_diesel': 0.171,      # kg CO2 per km
        'car_electric': 0.053,    # kg CO2 per km
        'bus': 0.089,             # kg CO2 per km
        'train': 0.041,           # kg CO2 per km
        'metro': 0.028,           # kg CO2 per km
        'bike': 0.0,              # kg CO2 per km
        'walk': 0.0,              # kg CO2 per km
        'motorcycle': 0.113,      # kg CO2 per km
        'flight_short': 0.255,    # kg CO2 per km (< 1500 km)
        'flight_long': 0.195,     # kg CO2 per km (> 1500 km)
    },
    'energy': {
        'electricity': 0.475,     # kg CO2 per kWh (grid average)
        'natural_gas': 0.203,     # kg CO2 per kWh
        'heating_oil': 0.298,     # kg CO2 per kWh
        'coal': 0.354,            # kg CO2 per kWh
        'solar': 0.0,             # kg CO2 per kWh
        'wind': 0.0,              # kg CO2 per kWh
    },
    'food': {
        'beef': 27.0,             # kg CO2 per kg
        'lamb': 39.2,             # kg CO2 per kg
        'pork': 12.1,             # kg CO2 per kg
        'chicken': 6.9,           # kg CO2 per kg
        'fish': 6.1,              # kg CO2 per kg
        'eggs': 4.8,              # kg CO2 per kg
        'cheese': 13.5,           # kg CO2 per kg
        'milk': 1.9,              # kg CO2 per liter
        'rice': 2.7,              # kg CO2 per kg
        'vegetables': 0.4,        # kg CO2 per kg
        'fruits': 0.5,            # kg CO2 per kg
        'bread': 0.9,             # kg CO2 per kg
    },
    'waste': {
        'landfill': 0.5,          # kg CO2 per kg
        'recycled': 0.1,          # kg CO2 per kg
        'composted': 0.05,        # kg CO2 per kg
        'incinerated': 0.3,       # kg CO2 per kg
    }
}

# Average daily carbon footprint (kg CO2)
AVERAGE_DAILY_FOOTPRINT = {
    'global': 11.0,
    'developed': 16.0,
    'developing': 6.0,
}

# Color scheme for the app
COLORS = {
    'primary': '#2E7D32',      # Dark green
    'secondary': '#66BB6A',    # Light green
    'accent': '#FFA726',       # Orange
    'background': '#F5F5F5',   # Light gray
    'text': '#212121',         # Dark gray
    'success': '#4CAF50',      # Green
    'warning': '#FF9800',      # Orange
    'danger': '#F44336',       # Red
    'info': '#2196F3',         # Blue
}

# Category icons (emoji)
CATEGORY_ICONS = {
    'transportation': '🚗',
    'energy': '⚡',
    'food': '🍽️',
    'waste': '♻️',
}

# Database configuration
DATABASE_NAME = 'sustainability_tracker.db'

# Recommendations thresholds
RECOMMENDATION_THRESHOLDS = {
    'high_carbon_day': 15.0,    # kg CO2
    'low_carbon_day': 5.0,      # kg CO2
}
