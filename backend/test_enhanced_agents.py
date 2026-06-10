from agent_manager import run_agents

def test_enhanced_system():
    print("=== TESTING ENHANCED AGENT COLLABORATION ===\n")
    
    # Test case
    query = "Launch premium wireless headphones for tech professionals"
    product = "Wireless Headphones"
    
    result = run_agents(query, product)
    
    print("CREATIVE AGENT:")
    print(result['Creative'])
    print("\n" + "="*50 + "\n")
    
    print("FINANCE AGENT:")
    print(result['Finance'])
    print("\n" + "="*50 + "\n")
    
    print("INVENTORY AGENT:")
    print(result['Inventory'])
    print("\n" + "="*50 + "\n")
    
    print("FINAL PLAN:")
    print(result['Final Plan'])

if __name__ == "__main__":
    test_enhanced_system()
