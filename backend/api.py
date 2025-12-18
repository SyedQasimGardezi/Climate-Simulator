from fastapi import APIRouter
from .sme_simulator import SmeSimulator
from .models import SmeInputs, SmeOutputs

router = APIRouter()

@router.post("/sme/calculate", response_model=SmeOutputs)
def calculate_sme_impact(inputs: SmeInputs):
    simulator = SmeSimulator()
    return simulator.calculate(inputs)
