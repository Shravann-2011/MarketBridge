def generate_scenarios(discount, duration, target_size, budget):
    base_reach = target_size * (1 + (discount / 100) * 0.2)
    engagement_rate = 5 + (discount / 10) + (budget / 100000) - (duration / 100)

    STRATEGIES = [
        {
            "name": "Conservative",
            "risk_level": "Low",
            "probability": 0.9,
            "conversion_multiplier": 0.6,
            "roi_multiplier": 2
        },
        {
            "name": "Balanced",
            "risk_level": "Medium",
            "probability": 0.7,
            "conversion_multiplier": 0.9,
            "roi_multiplier": 3
        },
        {
            "name": "Aggressive",
            "risk_level": "High",
            "probability": 0.5,
            "conversion_multiplier": 1.2,
            "roi_multiplier": 4
        },
    ]

    scenarios = []
    for strat in STRATEGIES:
        conversion_rate = engagement_rate * strat["conversion_multiplier"]
        roi = ((base_reach * conversion_rate / 100) * strat["roi_multiplier"]) / budget * 100
        scenarios.append({
            "name": strat["name"],
            "discount": discount,
            "roi": round(roi, 2),
            "probability": f"{int(strat['probability']*100)}%",
            "conversion_rate": round(conversion_rate, 2),
            "risk_level": strat["risk_level"]
        })
    return scenarios
