from agent_collaboration import AgentCollaboration

def test_agent_collaboration():
    collaboration = AgentCollaboration()
    result = collaboration.coordinate_agents(
        "Launch premium wireless headphones campaign", 
        "Wireless Headphones"
    )
    
    print("=== AGENT COLLABORATION TEST ===")
    print(f"Creative Strategy: {result['creative']}")
    print(f"Finance Analysis: {result['finance']}")
    print(f"Inventory Status: {result['inventory']}")
    print(f"Negotiation Log: {result['negotiation_log']}")
    print(f"Final Recommendation: {result['final_recommendation']}")

if __name__ == "__main__":
    test_agent_collaboration()
