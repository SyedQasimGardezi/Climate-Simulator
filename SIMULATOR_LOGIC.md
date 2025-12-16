# Climate Simulator Logic & Documentation

This document explains the underlying mathematical model, assumptions, and formulas used in the Climate Simulator. It is designed to be a transparent reference for how scenarios are calculated.

## 1. Overview
The simulator acts as a simplified **Integrated Assessment Model (IAM)**. It does not run a full physics simulation of the atmosphere but rather stimulates the **dynamics of the global energy mix** and uses established coefficients to project environmental outcomes.

**Core Loop:**
1.  **Policy Application**: User inputs (sliders) modify the *growth rates* and *costs* of different energy sources.
2.  **Energy Mix Evolution**: The mix of Coal, Oil, Gas, Renewables, etc., evolves year-over-year based on these modified rates.
3.  **Emissions Calculation**: Total emissions are derived from the energy mix + land use settings.
4.  **Climate Response**: Atmospheric Temperature is updated based on cumulative emissions (CO₂ concentration).

---

## 2. Energy Mix Dynamics

The simulation starts in **2000** with a baseline approximated energy mix (Exajoules/year):
*   **Coal**: 100 EJ
*   **Oil**: 150 EJ
*   **Gas**: 90 EJ
*   **Bioenergy**: 40 EJ
*   **Renewables**: 10 EJ
*   **Nuclear**: 25 EJ

### Growth Rates & Policy Weights
Each energy source has a baseline natural growth rate. Policies (Taxes/Subsidies) modify this rate.

**Formula:**
`New Growth Rate = Base Rate + (Slider Value * Weight * Policy Strength)`

*Note: Policy Strength ramps up linearly from 0 to 1 between 2024 and 2030.*

| Energy Source | Base Growth | Policy Lever | Weight Impact (per unit) |
| :--- | :--- | :--- | :--- |
| **Coal** | +1.5% | Coal Tax | `-0.002` (Tax of 100 reduces growth by 20%) |
| | | Carbon Price | `-0.0005` |
| **Oil** | +1.2% | Oil Tax | `-0.0015` |
| | | Carbon Price | `-0.0004` |
| | | Transport Electrification | `-0.001` (EVs reduce oil demand) |
| **Gas** | +2.0% | Gas Tax | `-0.001` |
| | | Carbon Price | `-0.0003` |
| **Renewables** | +5.0% | Subsidy | `+0.002` |
| | | Carbon Price | `+0.0002` (Competitiveness boost) |
| **Bioenergy** | +1.0% | Tax | `-0.001` |
| **Nuclear** | +0.5% | Subsidy | `+0.001` |
| **New Tech** | 0.0% | Subsidy | `+0.003` (Base starts at 2% if funded) |

### Demand Modifiers
Total global energy demand scales with economic growth and efficiency.

`Total Demand Modifier = 1.0 + (Economic Growth * 0.01) - (Efficiency Impacts)`

*   **Transport/Buildings Efficiency**: Specific levers reduce total demand by `0.005` (0.5%) per slider unit.

---

## 3. Emissions Calculation

Emissions ($E_{total}$) are the sum of Energy Emissions, Land Emissions, and Carbon Removal.

`E_total = E_energy + E_land - Removal`

### Energy Emissions
Calculated by multiplying energy consumption by emission factors (GtCO₂ / Exajoule):
*   **Coal**: 0.095
*   **Oil**: 0.07
*   **Gas**: 0.05
*   **Renewables/Nuclear/Bio**: ~0.0 (Assumed minimal/net-neutral for simplicity)

### Land Use Emissions
Baseline Land Emissions: **5.0 GtCO₂/year**
*   **Deforestation**: Reduces emissions by % slider value.
*   **Afforestation**: Subtracts additional `0.05 Gt` per % point.

### Technological Removal
*   **Tech Removal Slider (0-100)**: Subtracts up to **10 GtCO₂/year** at max setting.

---

## 4. Climate Response (Temperature)

The model uses a simplified impulse response function to estimate global temperature change.

1.  **Atmospheric CO₂**:
    *   Approx **45%** of emitted CO₂ remains in the atmosphere (Airborne Fraction).
    *   Conversion: `1 GtCO₂ ≈ 0.128 ppm`.
    *   `New CO₂ (ppm) = Old CO₂ + (Emissions * 0.128 * 0.45)`

2.  **Temperature Anomaly**:
    *   Calculated using standard Climate Sensitivity formula:
    *   `Equilibrium Temp = Sensitivity * log2(CO₂_current / CO₂_preindustrial)`
    *   *Sensitivity* is set to **3.0°C** per doubling of CO₂.
    *   *Pre-industrial CO₂* is **280 ppm**.

3.  **Thermal Inertia**:
    *   Temperature doesn't change instantly. The model applies a lag function:
    *   `T_year = T_prev + 0.05 * (T_equilibrium - T_prev)`
    *   Includes a separate adder for **Methane** impacts, reduced by the Methane slider.
