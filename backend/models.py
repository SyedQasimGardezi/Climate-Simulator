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
    initial_revenue: float = 10000.0
    num_employees: int = 50
    fixed_costs: float = 100000.0
    variable_costs_pct: float = 0.02
    initial_capex: float = 1000.0
    operating_margin_pct: float = 0.0765
    revenue_growth_rate: float = 0.0
    employee_growth_rate: float = 0.01

    # Sustainability Strategy (Scenario B)
    sustainability_capex: float = 6600.0
    reinvest_pct: float = 0.005
    energy_efficiency_pct: float = 0.0
    resource_efficiency_pct: float = 0.0
    waste_reduction_pct: float = 0.0
    circular_economy_pct: float = 0.0
    reputation_uplift_pct: float = 0.0
    green_market_access_pct: float = 0.03
    turnover_reduction_pct: float = 0.0
    productivity_gain_pct: float = 0.015
    gov_subsidies: float = 450.0

    # Economic Settings
    tax_rate: float = 0.25
    discount_rate: float = 0.08
    inflation_rate: float = 0.02
    depreciation_years: int = 5
    wacc: float = 0.07 # Added for consistency with existing UI but and new logic

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
