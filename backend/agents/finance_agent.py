import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI configured for Finance Agent")
except Exception as e:
    GEMINI_AVAILABLE = False
    print(f"⚠️ Gemini AI not available: {e}")

def finance_agent(query, product):
    """Enhanced Finance Agent - CONCISE VERSION"""
    
    print(f"💰 Finance Agent processing: {query} for {product}")
    
    # Estimate budget from query
    budget_amount = extract_budget_from_query(query)
    
    if GEMINI_AVAILABLE:
        try:
            model = GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""Budget Analysis for {product} campaign: ${budget_amount:,}

Provide a CONCISE 2-sentence financial assessment covering:
1. Budget allocation and approval status
2. Expected ROI and payback period

Be specific with numbers."""
            
            response = model.generate_content(prompt)
            if response and response.text:
                ai_analysis = response.text.strip()
                print(f"✅ Gemini finance response: {len(ai_analysis)} chars")
                return format_finance_output_concise(ai_analysis, budget_amount)
            
        except Exception as e:
            print(f"Gemini error in finance agent: {e}")
    
    # Concise fallback
    print("📋 Using fallback finance analysis")
    roi_multiplier = 3.2 if budget_amount >= 25000 else 2.8 if budget_amount >= 5000 else 2.4
    fallback_analysis = f"""Budget of ${budget_amount:,} approved with 60% digital, 25% content, 15% influencer allocation. Expected ROI: {roi_multiplier}x within 3-4 months with moderate risk profile."""
    
    return format_finance_output_concise(fallback_analysis, budget_amount)

def extract_budget_from_query(query):
    """Extract budget amount from query"""
    query_lower = str(query).lower()
    if "small" in query_lower or "low" in query_lower:
        return 5000
    elif "large" in query_lower or "big" in query_lower:
        return 50000
    else:
        return 15000  # Default budget

def format_finance_output_concise(analysis, budget):
    """Format finance output - CONCISE VERSION"""
    
    roi_multiplier = 3.2 if budget >= 25000 else 2.8 if budget >= 5000 else 2.4
    
    formatted_output = f"""💰 **FINANCIAL ANALYSIS**

{analysis}

**Budget Breakdown:**
• Total Budget: ${budget:,}
• Expected Revenue: ${int(budget * roi_multiplier):,}
• ROI Multiple: {roi_multiplier}x"""

    print(f"📝 Formatted finance output: {len(formatted_output)} chars")
    return formatted_output
