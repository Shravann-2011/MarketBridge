from agent_manager import run_agents

# Test the integration
result = run_agents("Launch premium wireless headphones campaign for tech professionals", "Wireless Headphones")

print("\n🎯 INTEGRATION TEST RESULTS:")
for agent, output in result.items():
    print(f"\n{agent}:")
    print("-" * 40)
    print(output)
