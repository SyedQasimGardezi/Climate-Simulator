from .config import EMISSION_FACTORS

class CarbonCalculator:
    """Calculate carbon footprint for different activities"""
    
    @staticmethod
    def calculate_transportation(mode, distance):
        """
        Calculate carbon footprint for transportation
        
        Args:
            mode: Transportation mode (e.g., 'car_petrol', 'bus', 'train')
            distance: Distance traveled in km
        
        Returns:
            Carbon footprint in kg CO2
        """
        if mode not in EMISSION_FACTORS['transportation']:
            raise ValueError(f"Unknown transportation mode: {mode}")
        
        emission_factor = EMISSION_FACTORS['transportation'][mode]
        return distance * emission_factor
    
    @staticmethod
    def calculate_energy(energy_type, consumption):
        """
        Calculate carbon footprint for energy consumption
        
        Args:
            energy_type: Type of energy (e.g., 'electricity', 'natural_gas')
            consumption: Energy consumption in kWh
        
        Returns:
            Carbon footprint in kg CO2
        """
        if energy_type not in EMISSION_FACTORS['energy']:
            raise ValueError(f"Unknown energy type: {energy_type}")
        
        emission_factor = EMISSION_FACTORS['energy'][energy_type]
        return consumption * emission_factor
    
    @staticmethod
    def calculate_food(food_type, amount):
        """
        Calculate carbon footprint for food consumption
        
        Args:
            food_type: Type of food (e.g., 'beef', 'vegetables')
            amount: Amount in kg (or liters for milk)
        
        Returns:
            Carbon footprint in kg CO2
        """
        if food_type not in EMISSION_FACTORS['food']:
            raise ValueError(f"Unknown food type: {food_type}")
        
        emission_factor = EMISSION_FACTORS['food'][food_type]
        return amount * emission_factor
    
    @staticmethod
    def calculate_waste(waste_type, amount):
        """
        Calculate carbon footprint for waste
        
        Args:
            waste_type: Type of waste disposal (e.g., 'landfill', 'recycled')
            amount: Amount of waste in kg
        
        Returns:
            Carbon footprint in kg CO2
        """
        if waste_type not in EMISSION_FACTORS['waste']:
            raise ValueError(f"Unknown waste type: {waste_type}")
        
        emission_factor = EMISSION_FACTORS['waste'][waste_type]
        return amount * emission_factor
    
    @staticmethod
    def calculate(category, subcategory, amount):
        """
        Generic calculation method
        
        Args:
            category: Category (transportation, energy, food, waste)
            subcategory: Specific type within category
            amount: Amount/distance/consumption
        
        Returns:
            Carbon footprint in kg CO2
        """
        if category == 'transportation':
            return CarbonCalculator.calculate_transportation(subcategory, amount)
        elif category == 'energy':
            return CarbonCalculator.calculate_energy(subcategory, amount)
        elif category == 'food':
            return CarbonCalculator.calculate_food(subcategory, amount)
        elif category == 'waste':
            return CarbonCalculator.calculate_waste(subcategory, amount)
        else:
            raise ValueError(f"Unknown category: {category}")
