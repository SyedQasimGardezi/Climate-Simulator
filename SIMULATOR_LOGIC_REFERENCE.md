# SME Resilience Simulator: Detailed Logic Reference

This document provides the mathematical formulas, scoring models, and logic thresholds implemented in the SME Resilience Simulator.

---

## 1. Scenario-Based Modeling
The simulator compares two distinct financial futures over a 5-10 year horizon:
- **Scenario A (Traditional)**: Baseline growth without sustainability investments.
- **Scenario B (Sustainable)**: Includes CAPEX investment, efficiency gains, and reputation/market benefits.

---

## 2. Dimension Scoring (0-100)

### A. Economic Score
Based on the incremental financial performance of Scenario B vs Scenario A.
- **ROI**: (Cumulative Net Profit B + Cumulative Savings) / Total Investment.
- **NPV**: Discounted incremental cash flows minus initial sustainability CAPEX.
- **Formula**: `Score = Clamp(50 + (ROI * 20))` (Normalized to 0-100 scale).

### B. Environmental Score
Weighted mix of efficiency and mandatory reduction potentials:
- **Efficiency Gains (30%)**: Energy, Resource, Waste, and Circular Economy.
- **Scope Reductions (40%)**: Average of Scope 1, Scope 2, and Scope 3 reduction potentials.
- **Carbon Potential (30%)**: Weighted contribution from the "Carbon Reduction" slider.

### C. Strategic Score
Measures resilience and market positioning:
- **Upside Components**: Reputation uplift, Productivity gains, Turnover reduction, and Green market access.
- **Resilience Component**: `Disruption Impact / 100` (positive contribution to resilience).
- **Formula**: Weighted sum of all strategic inputs, clamped to 100.

---

## 3. Financial Projection Logic (Annual)

For each year $t$ in the forecast horizon:

### Revenue
- **Rev A**: $Rev_{t-1} \times (1 + Growth_{Baseline})$
- **Rev B**: $Rev_{t-1} \times (1 + Growth_{Baseline} + Reputation + GreenMarket)$

### Profitability
- **OPEX**: $Revenue \times VariableCost\% + FixedCosts$
- **Savings (B only)**: $OPEX_{B} \times \sum(EfficiencyPotentials)$
- **Net Profit**: $EBITDA - Tax - Depreciation$ (where applicable).

---

## 4. Impact Matrix (Heatmap)
Visualizes each dimension across three axes:
- **Upside**: The calculated score (Econ, Env, or Strat).
- **Risk**:
    - **Econ**: CAPEX relative to revenue.
    - **Env**: Remaining carbon potential (100 - reduction).
    - **Strat**: Disruption impact level.
- **Feasibility**:
    - **Econ**: Inverse of disruption impact.
    - **Env**: Inverse of Scope 3 complexity.
    - **Strat**: Calculated Execution Risk (Investment / Revenue ratio).

---

## 5. Trade-off Intelligence (Alerts)
Mandatory logic checks to identify strategic inconsistencies:

| Alert Type | Condition | Severity |
| :--- | :--- | :--- |
| **Greenwashing** | High Econ (>70) AND Low Env (<40) | High |
| **Financial Risk** | High Env (>70) AND Low Econ (<40) | High |
| **Strategic Risk** | High Econ (>70) AND Low Env (<40) | Medium |
| **Execution Risk** | Econ > 70 AND Investment > 50% Revenue | Medium |
| **Profitability** | Final Year Profit B < Profit A | Medium |

---

## 6. Global Formatting
- **Absolute Integers**: All results are rounded to integers (`Math.round`) before display.
- **Normalized Scale**: All component scores are clamped between 0 and 100.
