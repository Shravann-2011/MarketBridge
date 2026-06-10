import os
from dotenv import load_dotenv
from agents.creative_agent import creative_agent

load_dotenv()

def test_gemini():
    print("🧪 Testing Gemini Integration...")
    print(f"API Key present: {'Yes' if os.getenv('GEMINI_API_KEY') else 'No'}")
    
    result = creative_agent("Create a premium campaign", "Wireless Headphones")
    print(f"\n📊 Result:\n{result}")

if __name__ == "__main__":
    test_gemini()
