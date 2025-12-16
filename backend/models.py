from pydantic import BaseModel
from typing import Optional, List, Dict

class ActivityBase(BaseModel):
    date: str
    category: str
    subcategory: str
    amount: float
    unit: str
    notes: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    carbon_footprint: float
    created_at: str

    class Config:
        from_attributes = True

class Recommendation(BaseModel):
    category: str
    icon: str
    title: str
    description: str
    potential_saving: float
    priority: str

class ClimateScenario(BaseModel):
    # Energy Supply
    coal_tax: float = 0.0 # -100 to 100 (Subsidized to Highly Taxed)
    oil_tax: float = 0.0
    gas_tax: float = 0.0
    bioenergy_tax: float = 0.0
    renewables_subsidy: float = 0.0
    nuclear_subsidy: float = 0.0
    new_tech_subsidy: float = 0.0
    carbon_price: float = 0.0 # $/ton

    # Transport
    transport_efficiency: float = 0.0 # % increase
    transport_electrification: float = 0.0 # % increase

    # Buildings & Industry
    buildings_efficiency: float = 0.0
    buildings_electrification: float = 0.0

    # Growth
    population_growth: float = 0.0 # Low to High (-1 to 1)
    economic_growth: float = 0.0

    # Land & Emissions
    deforestation: float = 0.0 # % reduction
    methane_reduction: float = 0.0 # % reduction
    afforestation: float = 0.0 # % increase

    # Carbon Removal
    technological_carbon_removal: float = 0.0 # % of max potential

class ClimateProjection(BaseModel):
    years: List[int]
    global_temp: List[float]
    co2_concentration: List[float]
    
    # Energy Mix (Exajoules/year)
    energy_coal: List[float]
    energy_oil: List[float]
    energy_gas: List[float]
    energy_renewables: List[float]
    energy_bio: List[float]
    energy_nuclear: List[float]
    energy_new_tech: List[float]
