from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timedelta
from .database import Database
from .calculator import CarbonCalculator
from .recommendations import RecommendationEngine
from .climate_model import ClimateModel
from .models import Activity, ActivityCreate, Recommendation, ClimateScenario, ClimateProjection

router = APIRouter()

def get_db():
    db = Database()
    try:
        yield db
    finally:
        db.close()

@router.get("/activities", response_model=List[Activity])
def get_activities(
    category: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Database = Depends(get_db)
):
    if category and category != "All":
        df = db.get_activities_by_category(category.lower())
    elif start_date and end_date:
        df = db.get_activities_by_date_range(start_date, end_date)
    else:
        df = db.get_all_activities()
    
    if df.empty:
        return []
    
    return df.to_dict('records')

@router.post("/activities", response_model=Activity)
def create_activity(activity: ActivityCreate, db: Database = Depends(get_db)):
    # Calculate carbon footprint
    carbon = 0.0
    if activity.category.lower() == "transportation":
        carbon = CarbonCalculator.calculate_transportation(activity.subcategory, activity.amount)
    elif activity.category.lower() == "energy":
        carbon = CarbonCalculator.calculate_energy(activity.subcategory, activity.amount)
    elif activity.category.lower() == "food":
        carbon = CarbonCalculator.calculate_food(activity.subcategory, activity.amount)
    elif activity.category.lower() == "waste":
        carbon = CarbonCalculator.calculate_waste(activity.subcategory, activity.amount)
    
    activity_id = db.add_activity(
        date=activity.date,
        category=activity.category.lower(),
        subcategory=activity.subcategory,
        amount=activity.amount,
        unit=activity.unit,
        carbon_footprint=carbon,
        notes=activity.notes
    )
    
    return {
        **activity.dict(),
        "id": activity_id,
        "carbon_footprint": carbon,
        "created_at": datetime.now().isoformat()
    }

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Database = Depends(get_db)):
    db.delete_activity(activity_id)
    return {"message": "Activity deleted"}

@router.get("/stats")
def get_stats(start_date: str, end_date: str, db: Database = Depends(get_db)):
    df = db.get_activities_by_date_range(start_date, end_date)
    if df.empty:
        return {
            "total_carbon": 0,
            "daily_average": 0,
            "activity_count": 0,
            "daily_trend": [],
            "category_breakdown": []
        }
    
    total_carbon = df['carbon_footprint'].sum()
    days = (datetime.fromisoformat(end_date) - datetime.fromisoformat(start_date)).days
    avg_daily = total_carbon / max(days, 1)
    
    daily_totals = db.get_daily_totals(start_date, end_date)
    category_totals = db.get_total_carbon_by_category(start_date, end_date)
    
    return {
        "total_carbon": total_carbon,
        "daily_average": avg_daily,
        "activity_count": len(df),
        "daily_trend": daily_totals.to_dict('records') if not daily_totals.empty else [],
        "category_breakdown": category_totals.to_dict('records') if not category_totals.empty else []
    }

@router.get("/recommendations", response_model=List[Recommendation])
def get_recommendations(db: Database = Depends(get_db)):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=30)
    
    df = db.get_activities_by_date_range(start_date.isoformat(), end_date.isoformat())
    return RecommendationEngine.analyze_patterns(df)

@router.post("/climate/simulate", response_model=ClimateProjection)
def simulate_climate(scenario: ClimateScenario):
    model = ClimateModel()
    results = model.run_simulation(scenario)
    return results
