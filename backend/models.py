from pydantic import BaseModel
from typing import List, Optional

# SME Simulator Models

class SmeInputs(BaseModel):
    # Basic Business Info
    industry: str = "Manufacturing"
    company_size: str = "SME"
    region: str = "EU"
    forecast_horizon: int = 7 # 5, 7, 10
    
    # Financial Baseline
    initial_revenue: float = 1000000.0
    num_employees: int = 50
    fixed_costs: float = 200000.0
    variable_costs_pct: float = 0.4
    initial_capex: float = 50000.0
    operating_margin_pct: float = 0.15
    revenue_growth_rate: float = 0.05
    employee_growth_rate: float = 0.02

    # Sustainability Strategy (Scenario B)
    sustainability_capex: float = 100000.0
    reinvest_pct: float = 0.01
    energy_efficiency_pct: float = 0.15
    resource_efficiency_pct: float = 0.08
    waste_reduction_pct: float = 0.10
    circular_economy_pct: float = 0.05
    reputation_uplift_pct: float = 0.03
    green_market_access_pct: float = 0.05
    turnover_reduction_pct: float = 0.20
    productivity_gain_pct: float = 0.10
    gov_subsidies: float = 15000.0

    # instructions (1).docx Mandatory Requirements (0-100)
    disruption_impact: float = 20.0
    carbon_reduction_potential: float = 25.0
    scope_1_reduction: float = 25.0
    scope_2_reduction: float = 25.0
    scope_3_reduction: float = 20.0

    # Economic Settings
    tax_rate: float = 0.25
    discount_rate: float = 0.08
    inflation_rate: float = 0.02
    depreciation_years: int = 5
    wacc: float = 0.07 

class SmeScore(BaseModel):
    economic: float
    environmental: float
    strategic: float
    overall: float

class HeatmapCell(BaseModel):
    row: str # Economic, Environmental, Strategic
    col: str # Upside, Risk, Feasibility
    value: float
    color: str # red, yellow, green

class Alert(BaseModel):
    message: str
    severity: str # low, medium, high

class SmeDeepIndicators(BaseModel):
    financial_viability: float # NPV normalized
    roi_percent: float
    payback_years: float
    carbon_reduction_tons: float
    net_zero_progress: float
    execution_risk_factor: str # High/Med/Low
    resilience_index: float

class YearlyProjection(BaseModel):
    year: int
    revenue_a: float
    revenue_b: float
    opex_a: float
    opex_b: float
    profit_a: float
    profit_b: float
    savings: float
    cumulative_investment: float

class SmeOutputs(BaseModel):
    scores: SmeScore
    heatmap: List[HeatmapCell]
    alerts: List[Alert]
    details: SmeDeepIndicators
    projections: List[YearlyProjection]
