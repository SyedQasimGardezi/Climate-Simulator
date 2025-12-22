from typing import Dict, List, Any
from .models import SmeInputs, SmeOutputs, Alert, SmeScore, HeatmapCell, SmeDeepIndicators

from typing import Dict, List, Any
import numpy as np
from .models import SmeInputs, SmeOutputs, Alert, SmeScore, HeatmapCell, SmeDeepIndicators, YearlyProjection

class SmeSimulator:
    """
    SME Resilience Simulator - Financial Version
    Implements Scenario A (Traditional) vs Scenario B (Sustainable)
    """

    def calculate(self, i: SmeInputs) -> SmeOutputs:
        projections = self._calculate_projections(i)
        
        # Calculate scores based on the final year or cumulative metrics
        # Final Year Metrics
        last = projections[-1]
        
        # Economic Score: Based on Cumulative ROI and NPV
        total_inv = i.initial_capex + i.sustainability_capex + (sum(p.revenue_b for p in projections) * i.reinvest_pct)
        total_profit_b = sum(p.profit_b for p in projections)
        total_savings = sum(p.savings for p in projections)
        
        # ROI = (Cumulative Net Profit + Cumulative Savings) / Cumulative Investment
        roi = (total_profit_b + total_savings) / total_inv if total_inv > 0 else 0
        
        # NPV Calculation (Simplified)
        npv = -i.sustainability_capex
        for t, p in enumerate(projections):
            # Cash flow B - Cash flow A (Incremental profit)
            incremental_cf = (p.profit_b + p.savings) - p.profit_a
            npv += incremental_cf / ((1 + i.discount_rate) ** (t + 1))

        econ_score = self._clamp(round(50 + (roi * 20)))
        
        # Environmental Score: Based on efficiency gains AND mandatory Scope reduction potentials
        # Map 0-100 inputs to score contribution
        efficiency_contrib = (i.energy_efficiency_pct + i.resource_efficiency_pct + i.waste_reduction_pct + i.circular_economy_pct) * 25
        scope_contrib = (i.scope_1_reduction + i.scope_2_reduction + i.scope_3_reduction) / 3
        carbon_contrib = i.carbon_reduction_potential
        
        env_score = self._clamp(round(efficiency_contrib * 0.3 + scope_contrib * 0.4 + carbon_contrib * 0.3))
        
        # Strategic Score: Based on productivity, reputation, and disruption resilience
        strat_score = self._clamp(
            round((i.reputation_uplift_pct * 3 + 
             i.productivity_gain_pct * 3 + 
             i.turnover_reduction_pct * 2 + 
             i.green_market_access_pct * 2 + 
             (i.disruption_impact / 100)) * 10)
        )
        
        overall_score = round(econ_score * 0.4 + env_score * 0.3 + strat_score * 0.3)

        heatmap = self._calculate_heatmap(i, projections, econ_score, env_score, strat_score)
        alerts = self._generate_alerts(i, projections, econ_score, env_score, strat_score)
        
        details = SmeDeepIndicators(
            financial_viability=self._clamp(round(50 + (npv / (i.sustainability_capex or 1)) * 50)),
            roi_percent=round(roi * 100),
            payback_years=round(self._calculate_payback(i, projections)),
            carbon_reduction_tons=round(total_savings * 0.05 + (i.carbon_reduction_potential * 10)), # Weighted proxy
            net_zero_progress=round(env_score),
            execution_risk_factor="High" if i.sustainability_capex > i.initial_revenue * 0.5 else ("Medium" if i.sustainability_capex > 50000 else "Low"),
            resilience_index=round(strat_score)
        )

        return SmeOutputs(
            scores=SmeScore(
                economic=float(econ_score),
                environmental=float(env_score),
                strategic=float(strat_score),
                overall=float(overall_score)
            ),
            heatmap=heatmap,
            alerts=alerts,
            details=details,
            projections=projections
        )

    def _calculate_projections(self, i: SmeInputs) -> List[YearlyProjection]:
        projections = []
        
        rev_a = i.initial_revenue
        rev_b = i.initial_revenue
        cum_inv_b = i.initial_capex + i.sustainability_capex
        
        depreciation = i.sustainability_capex / i.depreciation_years if i.depreciation_years > 0 else 0
        
        for t in range(1, i.forecast_horizon + 1):
            # Growth rates
            growth_a = i.revenue_growth_rate
            growth_b = i.revenue_growth_rate + i.reputation_uplift_pct + i.green_market_access_pct
            
            rev_a = rev_a * (1 + growth_a)
            rev_b = rev_b * (1 + growth_b)
            
            # OPEX
            opex_a = rev_a * i.variable_costs_pct + i.fixed_costs
            opex_b = rev_b * i.variable_costs_pct + i.fixed_costs
            
            # Savings (Scenario B)
            total_saving_pct = (i.energy_efficiency_pct + i.resource_efficiency_pct + 
                                i.waste_reduction_pct + i.circular_economy_pct)
            savings = total_saving_pct * opex_b
            
            # Annual Reinvestment
            annual_reinvest = rev_b * i.reinvest_pct
            cum_inv_b += annual_reinvest
            
            # Profit A
            ebit_a = rev_a - opex_a
            tax_a = max(0, ebit_a * i.tax_rate)
            profit_a = ebit_a - tax_a
            
            # Profit B
            ebitda_b = rev_b - opex_b + savings
            ebit_b = ebitda_b - (depreciation if t <= i.depreciation_years else 0)
            tax_b = max(0, ebit_b * i.tax_rate)
            profit_b = ebit_b - tax_b
            
            projections.append(YearlyProjection(
                year=t,
                revenue_a=round(rev_a),
                revenue_b=round(rev_b),
                opex_a=round(opex_a),
                opex_b=round(opex_b),
                profit_a=round(profit_a),
                profit_b=round(profit_b),
                savings=round(savings),
                cumulative_investment=round(cum_inv_b)
            ))
            
        return projections

    def _calculate_payback(self, i: SmeInputs, projections: List[YearlyProjection]) -> float:
        cum_gain = 0
        total_inv = i.sustainability_capex
        
        for p in projections:
            # Gain = (Profit B + Savings) - Profit A
            gain = (p.profit_b + p.savings) - p.profit_a
            cum_gain += gain
            if cum_gain >= total_inv:
                return float(p.year)
        
        return float(i.forecast_horizon + 1) # Represents "Beyond Horizon"

    def _calculate_heatmap(self, i: SmeInputs, projections: List[YearlyProjection], econ: float, env: float, strat: float) -> List[HeatmapCell]:
        cells = []
        # Economic
        cells.append(HeatmapCell(row='Economic', col='Upside', value=round(econ), color=self._get_color(econ)))
        cells.append(HeatmapCell(row='Economic', col='Risk', value=round(i.sustainability_capex/10000), color=self._get_color(i.sustainability_capex/10000, invert=True)))
        cells.append(HeatmapCell(row='Economic', col='Feasibility', value=round(75 - i.disruption_impact/4), color=self._get_color(75 - i.disruption_impact/4)))
        
        # Environmental
        cells.append(HeatmapCell(row='Environmental', col='Upside', value=round(env), color=self._get_color(env)))
        cells.append(HeatmapCell(row='Environmental', col='Risk', value=round(100 - i.carbon_reduction_potential), color=self._get_color(100 - i.carbon_reduction_potential, invert=True)))
        cells.append(HeatmapCell(row='Environmental', col='Feasibility', value=round(80 - i.scope_3_reduction/5), color=self._get_color(80 - i.scope_3_reduction/5)))

        # Strategic
        cells.append(HeatmapCell(row='Strategic', col='Upside', value=round(strat), color=self._get_color(strat)))
        cells.append(HeatmapCell(row='Strategic', col='Risk', value=round(i.disruption_impact), color=self._get_color(i.disruption_impact, invert=True)))
        cells.append(HeatmapCell(row='Strategic', col='Feasibility', value=round(90 - self.execution_risk(i)), color=self._get_color(90 - self.execution_risk(i))))
        
        return cells

    def execution_risk(self, i: SmeInputs) -> float:
        return (i.sustainability_capex / (i.initial_revenue or 1)) * 50

    def _generate_alerts(self, i: SmeInputs, projections: List[YearlyProjection], econ: float, env: float, strat: float) -> List[Alert]:
        alerts = []
        last = projections[-1]
        
        # trade-off alerts from instructions (1).docx
        if econ > 70 and env < 40:
            alerts.append(Alert(message="Greenwashing Risk: High economic projection with low environmental impact scores.", severity="high"))
        
        if env > 70 and econ < 40:
            alerts.append(Alert(message="Financial Risk: Strong environmental results but weak economic sustainability.", severity="high"))
            
        if econ > 70 and env < 40: # Note: repeated in docx but slightly different wording
             alerts.append(Alert(message="Strategic Risk: High economic growth without corresponding environmental transformation.", severity="medium"))

        if econ > 70 and i.sustainability_capex > i.initial_revenue * 0.5:
             alerts.append(Alert(message="Execution Risk: High complexity and investment relative to current revenue.", severity="medium"))

        # Original alerts
        if last.profit_b < last.profit_a:
            alerts.append(Alert(message="Long-term Profitability Alert: Scenario B annual profit remains below Scenario A.", severity="medium"))
            
        return alerts

    def _clamp(self, val: float) -> float:
        return max(0.0, min(100.0, val))

    def _get_color(self, val: float, invert: bool = False) -> str:
        if invert:
            if val < 33: return "green"
            if val < 66: return "yellow"
            return "red"
        else:
            if val < 33: return "red"
            if val < 66: return "yellow"
            return "green"
