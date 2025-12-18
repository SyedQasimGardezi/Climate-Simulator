# SME Resilience Simulator: Detailed Logic Reference

This document provides the exact mathematical formulas, weighted scoring models, and logic thresholds used in the SME Resilience Simulator.

---

## 1. Weighted Scoring Model (0-100)

The simulator calculates three dimension scores which are then aggregated into an **Overall Resilience Score**.

### A. Aggregate Formula
$$ Overall = (Economic \times 0.4) + (Environmental \times 0.3) + (Strategic \times 0.3) $$

### B. Sector-Specific Impact Coefficients ($C_s$)
The simulator adjusts the sensitivity of specific scores based on the industry sector.

| Sector | Energy Saving | Resource Saving | Waste Red. | Reputation | Productivity | Turnover Red. |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Manufacturing** | 0.09 | 0.065 | 0.08 | 0.03 | 0.025 | 0.06 |
| **Services** | 0.045 | 0.035 | 0.03 | 0.055 | 0.04 | 0.07 |
| **Retail** | 0.065 | 0.05 | 0.04 | 0.04 | 0.025 | 0.05 |
| **Agri-food** | 0.105 | 0.075 | 0.07 | 0.02 | 0.015 | 0.04 |
| **Construction** | 0.075 | 0.055 | 0.095 | 0.03 | 0.025 | 0.055 |

### C. Environmental Score Calculation
Base Score starts at **20.0**.

**Impact Multipliers:**
- **Scope 2 (Energy)**: $0.15 + C_{energy\_saving}$
- **Material (Resource)**: $0.1 + C_{resource\_saving}$
- **Waste**: $0.1 + C_{waste\_reduction}$

**Formula:**
$$ EnvScore = 20 + \sum (Input_x \times w_x \times (BaseFactor_x + C_{sector,x})) $$

### D. Strategic Score Calculation
Base Score starts at **50.0**.

**Impact Multipliers:**
- **Capability (Productivity)**: $0.2 + C_{productivity\_gain}$
- **Reputation**: $0.2 + C_{reputation\_uplift}$
- **Stakeholder (Turnover)**: $0.1 + C_{turnover\_reduction}$

---

## 2. Deep Calculations (Financial Indicators)

The simulator uses a 5-year project horizon for financial modeling.

### A. NPV (Net Present Value)
Calculates the value of the investment today based on future cash flows.
$$ NPV = -CAPEX_{val} + \sum_{t=1}^{5} \frac{Savings_{annual}}{(1 + r)^t} $$
- **$r$ (Discount Rate)**: $0.05 + (\frac{WACC}{100} \times 0.10)$ (Range: 5% - 15%)
- **$CAPEX_{val}$**: Derived from Capex slider and Company Size multiplier.

### B. ROI (Return on Investment)
$$ ROI (\%) = \frac{NPV}{CAPEX_{val}} \times 100 $$

### C. Payback Period
$$ Payback (Years) = \frac{CAPEX_{val}}{Savings_{annual}} $$

---

## 3. Environmental Impact Modeling

### A. Carbon Tonnage Reduction ($tCO_2e$)
Estimates actual carbon reduction tons based on industry-specific baselines:
- **Construction**: 1500t
- **Manufacturing**: 1000t
- **Agri-food**: 800t
- **Retail**: 500t
- **Services**: 200t

---

## 4. Strategic Risk Indicators

### A. Risk Penalty
Quantifies the drag on resilience due to complexity and external pressure.
$$ RiskPenalty = \frac{(Complexity \cdot 0.5) + (SupplyRisk \cdot 0.3) + (Regulatory \cdot 0.2)}{100} $$

### B. Resilience Index
$$ ResilienceIndex = StrategicScore \times (1.0 - (RiskPenalty \cdot 0.5)) $$
