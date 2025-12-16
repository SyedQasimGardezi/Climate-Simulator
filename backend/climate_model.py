import numpy as np
from typing import Dict, List
from .models import ClimateScenario

class ClimateModel:
    """
    Simplified Integrated Assessment Model (IAM) inspired by EN-ROADS.
    Focuses on Energy Mix dynamics and their impact on emissions and temperature.
    """
    
    def __init__(self):
        self.start_year = 2000
        self.end_year = 2100
        
        # Baseline Energy Mix (Exajoules) in 2000 (Approximate)
        self.baseline_energy = {
            'coal': 100.0,
            'oil': 150.0,
            'gas': 90.0,
            'renewables': 10.0,
            'bio': 40.0,
            'nuclear': 25.0,
            'new_tech': 0.0
        }
        
        # Baseline Growth Rates (Annual %)
        self.growth_rates = {
            'coal': 0.015,
            'oil': 0.012,
            'gas': 0.02,
            'renewables': 0.05,
            'bio': 0.01,
            'nuclear': 0.005,
            'new_tech': 0.0
        }
        
        # Emission Factors (GtCO2 / Exajoule)
        self.emission_factors = {
            'coal': 0.095,
            'oil': 0.07,
            'gas': 0.05,
            'renewables': 0.0,
            'bio': 0.0, # Assumed carbon neutral for simplicity in this model
            'nuclear': 0.0,
            'new_tech': 0.0
        }

    def run_simulation(self, scenario: ClimateScenario) -> Dict:
        years = list(range(self.start_year, self.end_year + 1))
        
        # Initialize result arrays
        results = {
            'years': years,
            'energy_coal': [], 'energy_oil': [], 'energy_gas': [],
            'energy_renewables': [], 'energy_bio': [], 'energy_nuclear': [],
            'energy_new_tech': [],
            'emissions': [], 'co2_concentration': [], 'global_temp': []
        }
        
        # Initial state
        current_energy = self.baseline_energy.copy()
        cumulative_emissions = 0
        co2_ppm = 370.0 # Year 2000
        temp_anomaly = 0.85 # Year 2000
        
        for year in years:
            # 1. Apply Policy Impacts to Growth Rates
            # Policies ramp up from 2024 to 2030
            policy_strength = 0.0
            if year >= 2024:
                policy_strength = min((year - 2024) / 10.0, 1.0)
            
            # Calculate modified growth rates
            rates = self._calculate_growth_rates(scenario, policy_strength)
            
            # 2. Update Energy Mix
            total_demand_modifier = 1.0 + (scenario.economic_growth * 0.01 * policy_strength)
            
            # Efficiency reduces total demand
            efficiency_impact = (scenario.transport_efficiency + scenario.buildings_efficiency) * 0.005 * policy_strength
            total_demand_modifier -= efficiency_impact

            for source in current_energy:
                # Base growth
                growth = rates[source]
                
                # Inter-fuel substitution (simplified)
                # If one source is taxed heavily, others grow slightly faster
                
                current_energy[source] *= (1 + growth) * total_demand_modifier
                current_energy[source] = max(0, current_energy[source])

            # Store Energy Data
            results['energy_coal'].append(current_energy['coal'])
            results['energy_oil'].append(current_energy['oil'])
            results['energy_gas'].append(current_energy['gas'])
            results['energy_renewables'].append(current_energy['renewables'])
            results['energy_bio'].append(current_energy['bio'])
            results['energy_nuclear'].append(current_energy['nuclear'])
            results['energy_new_tech'].append(current_energy['new_tech'])
            
            # 3. Calculate Emissions
            annual_emissions = sum(current_energy[s] * self.emission_factors[s] for s in current_energy)
            
            # Add Land Use Emissions
            land_emissions = 5.0 # Baseline GtCO2
            land_emissions *= (1 - (scenario.deforestation * 0.01 * policy_strength))
            land_emissions -= (scenario.afforestation * 0.05 * policy_strength)
            
            # Tech Removal
            removal = scenario.technological_carbon_removal * 0.1 * policy_strength # Max 10 Gt removal
            
            total_emissions = annual_emissions + land_emissions - removal
            results['emissions'].append(total_emissions)
            
            # 4. Carbon Cycle & Temperature (Simple Impulse Response)
            # 1 GtCO2 ~ 0.128 ppm
            # Airborne fraction ~ 45%
            co2_added = total_emissions * 0.128 * 0.45
            co2_ppm += co2_added
            results['co2_concentration'].append(co2_ppm)
            
            # Temp = Sensitivity * log2(CO2 / 280)
            # Adding delay for thermal inertia
            equilibrium_temp = 3.0 * np.log2(co2_ppm / 280.0)
            # Simple inertia: T_new = T_old + k * (T_eq - T_old)
            temp_anomaly += 0.05 * (equilibrium_temp - temp_anomaly)
            
            # Methane impact (simplified adder)
            methane_impact = 0.5 * (1 - (scenario.methane_reduction * 0.01 * policy_strength))
            
            results['global_temp'].append(temp_anomaly + methane_impact)
            
        return results

    def _calculate_growth_rates(self, s: ClimateScenario, strength: float) -> Dict[str, float]:
        r = self.growth_rates.copy()
        
        # Tax/Subsidy impacts on growth rates
        # Tax -> Lower growth, Subsidy -> Higher growth
        
        # Coal
        r['coal'] -= (s.coal_tax * 0.002 * strength) # Tax of 100 reduces growth by 20%
        r['coal'] -= (s.carbon_price * 0.0005 * strength)
        
        # Oil
        r['oil'] -= (s.oil_tax * 0.0015 * strength)
        r['oil'] -= (s.carbon_price * 0.0004 * strength)
        r['oil'] -= (s.transport_electrification * 0.001 * strength) # Electrification hurts oil
        
        # Gas
        r['gas'] -= (s.gas_tax * 0.001 * strength)
        r['gas'] -= (s.carbon_price * 0.0003 * strength)
        
        # Renewables
        r['renewables'] += (s.renewables_subsidy * 0.002 * strength)
        r['renewables'] += (s.carbon_price * 0.0002 * strength) # Becomes more competitive
        
        # Bio
        r['bio'] -= (s.bioenergy_tax * 0.001 * strength) # Can be tax or subsidy
        
        # Nuclear
        r['nuclear'] += (s.nuclear_subsidy * 0.001 * strength)
        
        # New Tech
        r['new_tech'] = 0.02 + (s.new_tech_subsidy * 0.003 * strength)
        
        return r
