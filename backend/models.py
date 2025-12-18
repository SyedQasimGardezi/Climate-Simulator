from pydantic import BaseModel
from typing import List, Optional

# SME Simulator Models

class SmeInputs(BaseModel):
    # Basic - Economic (12 sliders)
    capex: float = 30.0
    opex: float = 0.0 # -50 to +50
    annual_savings: float = 40.0
    downtime: float = 20.0
    
    # Basic - Environmental
    scope1: float = 25.0
    scope2: float = 25.0
    scope3: float = 20.0
    waste: float = 20.0
    
    # Basic - Strategic
    complexity: float = 30.0
    supply_risk: float = 30.0
    regulatory: float = 30.0
    reputation: float = 25.0
    
    # Dropdowns
    industry: str = "Manufacturing"
    company_size: str = "SME"
    region: str = "EU"

    # Advanced - Economic
    wacc: float = 30.0
    payback_tolerance: float = 50.0
    incentives: float = 20.0
    price_premium: float = 15.0

    # Advanced - Environmental
    water: float = 10.0
    material: float = 15.0
    pollutants: float = 10.0
    measurement_confidence: float = 30.0

    # Advanced - Strategic
    capability: float = 30.0
    supplier_concentration: float = 40.0
    lead_time: float = 35.0
    stakeholder: float = 30.0

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

class SmeOutputs(BaseModel):
    scores: SmeScore
    heatmap: List[HeatmapCell]
    alerts: List[Alert]
    details: SmeDeepIndicators
