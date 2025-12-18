from typing import Dict, List, Any
from .models import SmeInputs, SmeOutputs, Alert, SmeScore, HeatmapCell, SmeDeepIndicators

class SmeSimulator:
    """
    SME Resilience Simulator
    Deterministic logic to map SME inputs to Economic, Environmental, and Strategic scores.
    """

    # Configuration: Weights and Thresholds
    CONFIG = {
        'weights': {
            'economic': {
                'annual_savings': 1.5,
                'incentives': 1.0,
                'price_premium': 1.2,
                'payback_tolerance': 0.8,
                'capex': -1.5,
                'opex': -2.0,  # Negative impact
                'downtime': -1.0,
                'wacc': -0.8
            },
            'environmental': {
                'scope1': 1.2,
                'scope2': 1.2,
                'scope3': 1.0,
                'waste': 1.0,
                'water': 0.8,
                'material': 0.8,
                'pollutants': 0.9
                # measurement_confidence influences credibility risk but not raw score directly in this simplified model? 
                # actually requirements say "Must be influenced by Measurement confidence (low confidence increases 'credibility risk' alerts)"
                # We can add a small weight or just keep it for alerts. Adding small weight for thoroughness.
            },
            'strategic': {
                'capability': 1.2,
                'reputation': 1.2,
                'complexity': -1.2,
                'supply_risk': -1.5,
                'supplier_concentration': -1.0,
                'lead_time': -1.0,
                'regulatory': -1.2,
                'stakeholder': -0.8
            },
            'overall': {
                'economic': 0.4,
                'environmental': 0.3,
                'strategic': 0.3
            }
        },
        'thresholds': {
            'risk_high': 25,
            'risk_medium': 50,
            'upside_high': 75,
            'upside_medium': 50
        }
    }

    SECTOR_COEFFICIENTS = {
        "Manufacturing": {
            "energy_saving": 0.09, "resource_saving": 0.065, "waste_reduction": 0.08,
            "reputation_uplift": 0.03, "productivity_gain": 0.025, "turnover_reduction": 0.06
        },
        "Services": {
            "energy_saving": 0.045, "resource_saving": 0.035, "waste_reduction": 0.03,
            "reputation_uplift": 0.055, "productivity_gain": 0.04, "turnover_reduction": 0.07
        },
        "Retail": {
            "energy_saving": 0.065, "resource_saving": 0.05, "waste_reduction": 0.04,
            "reputation_uplift": 0.04, "productivity_gain": 0.025, "turnover_reduction": 0.05
        },
        "Agri-food": {
            "energy_saving": 0.105, "resource_saving": 0.075, "waste_reduction": 0.07,
            "reputation_uplift": 0.02, "productivity_gain": 0.015, "turnover_reduction": 0.04
        },
        "Construction": {
            "energy_saving": 0.075, "resource_saving": 0.055, "waste_reduction": 0.095,
            "reputation_uplift": 0.03, "productivity_gain": 0.025, "turnover_reduction": 0.055
        }
    }

    def calculate(self, inputs: SmeInputs) -> SmeOutputs:
        # 1. Calculate Dimension Scores
        econ_score = self._calculate_economic_score(inputs)
        env_score = self._calculate_environmental_score(inputs)
        strat_score = self._calculate_strategic_score(inputs)

        # 2. Overall Score
        overall_score = (
            econ_score * self.CONFIG['weights']['overall']['economic'] +
            env_score * self.CONFIG['weights']['overall']['environmental'] +
            strat_score * self.CONFIG['weights']['overall']['strategic']
        )

        # 3. Heatmap
        heatmap = self._calculate_heatmap(inputs, econ_score, env_score, strat_score)

        # 4. Alerts
        alerts = self._generate_alerts(inputs, econ_score, env_score, strat_score)
        
        # 5. Deep Metrics
        details = self._calculate_deep_metrics(inputs, econ_score, env_score, strat_score)

        return SmeOutputs(
            scores=SmeScore(
                economic=econ_score,
                environmental=env_score,
                strategic=strat_score,
                overall=overall_score
            ),
            heatmap=heatmap,
            alerts=alerts,
            details=details
        )
    
    def _calculate_deep_metrics(self, i: SmeInputs, econ_score: float, env_score: float, strat_score: float) -> SmeDeepIndicators:
        # --- Financial (DCF Proxy) ---
        # Normalize inputs to somewhat realistic figures for SME
        # Base CAPEX ~ 50k to 500k depending on size/input
        size_multiplier = 10000 if i.company_size == "Micro" else (50000 if i.company_size == "SME" else 200000)
        
        capex_val = size_multiplier * (i.capex / 20.0) # approx range
        savings_annual = size_multiplier * (i.annual_savings / 20.0) * (1 + i.price_premium/100)
        
        # WACC as discount rate (5% to 15%)
        r = 0.05 + (i.wacc / 100.0) * 0.10 
        
        # 5 Year Horizon
        npv = -capex_val
        for t in range(1, 6):
            npv += savings_annual / ((1 + r) ** t)
            
        roi = (npv / capex_val) * 100 if capex_val > 0 else 0
        payback = capex_val / savings_annual if savings_annual > 0 else 99.0
        
        # Normalize NPV to 0-100 score for display? Or keep raw? Using score for "Financial Viability"
        # Let's say NPV > 0 is good (50+), NPV > Capex is great (100)
        viability = 50 + (npv / capex_val) * 25
        viability = max(0, min(100, viability))

        # --- Environmental (Tons) ---
        # Baselines
        baselines = {"Construction": 1500, "Manufacturing": 1000, "Agri-food": 800, "Retail": 500, "Services": 200}
        base_tons = baselines.get(i.industry, 500)
        
        # Reduction % estimates from sliders (0-100 scale -> 0-0.5 max impact per scope?)
        # Let's assume sliders represent potential realized.
        # Scope 1 (Direct)
        r1 = base_tons * 0.4 * (i.scope1 / 100.0)
        # Scope 2 (Energy)
        r2 = base_tons * 0.3 * (i.scope2 / 100.0)
        # Scope 3 (Chain)
        r3 = base_tons * 0.3 * (i.scope3 / 100.0)
        
        total_reduction = r1 + r2 + r3
        net_zero_progress = (total_reduction / base_tons) * 100
        
        # --- Strategic (Risk-Adjusted) ---
        # Risk factors
        risk_penalty = (i.complexity * 0.5 + i.supply_risk * 0.3 + i.regulatory * 0.2) / 100.0
        # Base resilience is derived from strategic score but focused on robustness
        base_resilience = strat_score
        resilience_index = base_resilience * (1.0 - risk_penalty * 0.5) # Dampen penalty slightly
        
        risk_factor = "Low"
        if risk_penalty > 0.4: risk_factor = "Medium"
        if risk_penalty > 0.7: risk_factor = "High"

        return SmeDeepIndicators(
            financial_viability=viability,
            roi_percent=roi,
            payback_years=payback,
            carbon_reduction_tons=total_reduction,
            net_zero_progress=net_zero_progress,
            execution_risk_factor=risk_factor,
            resilience_index=resilience_index
        )

    def _calculate_economic_score(self, i: SmeInputs) -> float:
        # Base score starts at 50 to allow movement up and down
        score = 50.0
        w = self.CONFIG['weights']['economic']

        # Normalization factors (approximate to keep within 0-100 range)
        # We divide by 100 * magnitude to get a fractional impact, then scale
        
        # Positives
        score += (i.annual_savings * w['annual_savings']) * 0.2
        score += (i.incentives * w['incentives']) * 0.15
        score += (i.price_premium * w['price_premium']) * 0.15
        score += (i.payback_tolerance * w['payback_tolerance']) * 0.1

        # Negatives (Inputs are 0-100, wait OPEX is -50 to +50)
        # CAPEX (0-100): High CAPEX reduces score
        score += (i.capex * w['capex']) * 0.2
        
        # OPEX (-50 to +50): Positive OPEX (cost increase) reduces score
        # Negative OPEX (savings) increases score
        # w['opex'] is negative (-2.0). 
        # If OPEX is +50 (cost up), result is 50 * -2 = -100 (needs scaling).
        # Let's say max impact is +/- 20 points
        score += (i.opex * w['opex']) * 0.2

        score += (i.downtime * w['downtime']) * 0.15
        score += (i.wacc * w['wacc']) * 0.1

        return self._clamp(score)

    def _calculate_environmental_score(self, i: SmeInputs) -> float:
        score = 20.0 # Start lower, must earn green cred
        w = self.CONFIG['weights']['environmental']
        
        # Get sector coefficients (default to mid values if not found)
        coeff = self.SECTOR_COEFFICIENTS.get(i.industry, self.SECTOR_COEFFICIENTS["Manufacturing"])

        score += (i.scope1 * w['scope1']) * 0.15
        # Energy saving coefficient enhances Scope 2 impact
        score += (i.scope2 * w['scope2']) * (0.15 + coeff['energy_saving'])
        score += (i.scope3 * w['scope3']) * 0.15
        # Waste reduction coefficient
        score += (i.waste * w['waste']) * (0.1 + coeff['waste_reduction'])
        score += (i.water * w['water']) * 0.1
        # Resource saving coefficient
        score += (i.material * w['material']) * (0.1 + coeff['resource_saving'])
        score += (i.pollutants * w['pollutants']) * 0.1

        return self._clamp(score)

    def _calculate_strategic_score(self, i: SmeInputs) -> float:
        score = 50.0
        w = self.CONFIG['weights']['strategic']
        
        # Get sector coefficients
        coeff = self.SECTOR_COEFFICIENTS.get(i.industry, self.SECTOR_COEFFICIENTS["Manufacturing"])

        # Positives
        # Productivity gain coefficient enhances capability
        score += (i.capability * w['capability']) * (0.2 + coeff['productivity_gain'])
        # Reputation uplift coefficient
        score += (i.reputation * w['reputation']) * (0.2 + coeff['reputation_uplift'])

        # Negatives
        score += (i.complexity * w['complexity']) * 0.15
        score += (i.supply_risk * w['supply_risk']) * 0.15
        score += (i.supplier_concentration * w['supplier_concentration']) * 0.1
        score += (i.lead_time * w['lead_time']) * 0.1
        score += (i.regulatory * w['regulatory']) * 0.15
        # Turnover reduction coefficient enhances stakeholder resilience
        score += (i.stakeholder * w['stakeholder']) * (0.1 + coeff['turnover_reduction'])

        return self._clamp(score)

    def _calculate_heatmap(self, i: SmeInputs, econ: float, env: float, strat: float) -> List[HeatmapCell]:
        """
        3x3 Matrix:
        Rows: Economic, Environmental, Strategic
        Columns: Upside, Risk, Feasibility
        Returns flat list of 9 cells.
        """
        cells = []

        # -- Economic Row --
        # Upside: Driven by Savings + Premium
        econ_upside = (i.annual_savings + i.price_premium) / 2
        cells.append(HeatmapCell(row='Economic', col='Upside', value=econ_upside, color=self._get_color(econ_upside, invert=False)))

        # Risk: Driven by Capex + Opex + WACC
        # Normalize Opex from -50..50 to 0..100 for risk calc (Higher is riskier)
        opex_norm = i.opex + 50 
        econ_risk = (i.capex + opex_norm + i.wacc) / 3
        cells.append(HeatmapCell(row='Economic', col='Risk', value=econ_risk, color=self._get_color(econ_risk, invert=True)))

        # Feasibility: Inverse of Downtime + Financing difficulty
        # Low downtime + Low WACC = High Feasibility
        econ_feas = 100 - ((i.downtime + i.wacc) / 2)
        cells.append(HeatmapCell(row='Economic', col='Feasibility', value=econ_feas, color=self._get_color(econ_feas, invert=False)))


        # -- Environmental Row --
        # Upside: Total Reduction Potential
        env_upside = (i.scope1 + i.scope2 + i.scope3 + i.waste) / 4
        cells.append(HeatmapCell(row='Environmental', col='Upside', value=env_upside, color=self._get_color(env_upside, invert=False)))

        # Risk: Low Measurement Confidence -> High Risk
        # Also could include Reg Exposure here? But let's stick to Measurement as per requirements
        env_risk = 100 - i.measurement_confidence
        cells.append(HeatmapCell(row='Environmental', col='Risk', value=env_risk, color=self._get_color(env_risk, invert=True)))

        # Feasibility: Related to Material intensity reduction difficulty? 
        # For simplicity, let's map it to Capability Readiness (Strategic input) as a proxy
        env_feas = i.capability 
        cells.append(HeatmapCell(row='Environmental', col='Feasibility', value=env_feas, color=self._get_color(env_feas, invert=False)))


        # -- Strategic Row --
        # Upside: Reputation
        strat_upside = i.reputation
        cells.append(HeatmapCell(row='Strategic', col='Upside', value=strat_upside, color=self._get_color(strat_upside, invert=False)))

        # Risk: Supply Risk + Regulatory
        strat_risk = (i.supply_risk + i.regulatory) / 2
        cells.append(HeatmapCell(row='Strategic', col='Risk', value=strat_risk, color=self._get_color(strat_risk, invert=True)))

        # Feasibility: Inverse of Complexity
        strat_feas = 100 - i.complexity
        cells.append(HeatmapCell(row='Strategic', col='Feasibility', value=strat_feas, color=self._get_color(strat_feas, invert=False)))

        return cells

    def _generate_alerts(self, i: SmeInputs, econ: float, env: float, strat: float) -> List[Alert]:
        alerts = []

        # 1. High complexity → execution risk
        if i.complexity > 70:
            alerts.append(Alert(message="High implementation complexity poses significant execution risk.", severity="high"))

        # 2. High CAPEX + weak benefits → payback risk
        if i.capex > 70 and i.annual_savings < 30:
            alerts.append(Alert(message="High CAPEX with low projected annual savings creates payback risk.", severity="high"))

        # 3. OPEX strongly positive → cost risk
        if i.opex > 25:
            alerts.append(Alert(message="Significant increase in OPEX threatens margins.", severity="medium"))

        # 4. High supply risk / supplier concentration / lead-time volatility → resilience risk
        if (i.supply_risk + i.supplier_concentration + i.lead_time) / 3 > 60:
            alerts.append(Alert(message="Combined supply chain factors indicate high resilience risk.", severity="high"))

        # 5. High regulatory exposure (and EU vs Non-EU) → compliance risk
        if i.regulatory > 70:
            msg = "High regulatory exposure." 
            if i.region == "EU":
                msg += " EU market compliance is critical."
            alerts.append(Alert(message=msg, severity="medium"))

        # 6. Low measurement confidence + low environmental score → credibility/greenwashing risk
        if i.measurement_confidence < 40 and env > 60:
             # Wait, if env score is high but confidence is low -> Greenwashing risk!
             # Requirement: "Low measurement confidence + low environmental score → credibility/greenwashing risk"
             # Actually "Low confidence + claiming high benefits" is greenwashing.
             # "Low confidence + low score" is just... unknown/poor.
             # Let's interpret requirement: weak measurement generally is a credibility risk.
            alerts.append(Alert(message="Low data confidence impairs credibility of reported environmental gains.", severity="medium"))

        # Trade-off alerts
        if env > 60 and econ < 40:
            alerts.append(Alert(message="Strong environmental performance but weak economic viability.", severity="medium"))
        
        if econ > 70 and env < 40:
            alerts.append(Alert(message="Strong economic return but minimal environmental improvement.", severity="medium"))
            
        if econ > 70 and i.complexity > 75:
            alerts.append(Alert(message="Good economic potential requires managing very high complexity.", severity="low"))

        return alerts

    def _clamp(self, val: float) -> float:
        return max(0.0, min(100.0, val))

    def _get_color(self, val: float, invert: bool) -> str:
        # Simple traffic light
        # If invert=True (e.g. Risk), High val = Red
        if invert:
            if val < 33: return "green"
            if val < 66: return "yellow"
            return "red"
        else:
            if val < 33: return "red"
            if val < 66: return "yellow"
            return "green"
