from backend.models import SmeInputs
from backend.sme_simulator import SmeSimulator
import json

def test_simulator():
    inputs = SmeInputs(
        initial_revenue=10000.0,
        fixed_costs=100000.0,
        variable_costs_pct=0.02,
        initial_capex=1000.0,
        forecast_horizon=7,
        sustainability_capex=6634.0,
        reinvest_pct=0.00552,
        energy_efficiency_pct=0.05,
        resource_efficiency_pct=0.05,
        waste_reduction_pct=0.05,
        circular_economy_pct=0.05,
        revenue_growth_rate=0.0,
        green_market_access_pct=0.03,
        productivity_gain_pct=0.01524,
        gov_subsidies=451.0
    )
    
    simulator = SmeSimulator()
    outputs = simulator.calculate(inputs)
    
    print(f"Overall Score: {outputs.scores.overall}")
    print(f"ROI: {outputs.details.roi_percent}%")
    print(f"Payback: {outputs.details.payback_years} years")
    
    print("\nProjections (First 3 years):")
    for p in outputs.projections[:3]:
        print(f"Year {p.year}: Rev B={p.revenue_b:.2f}, Profit B={p.profit_b:.2f}, Savings={p.savings:.2f}")

if __name__ == "__main__":
    test_simulator()
