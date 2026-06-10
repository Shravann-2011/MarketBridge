import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI configured for Lead Agent")
except Exception as e:
    GEMINI_AVAILABLE = False
    print(f"⚠️ Gemini AI not available: {e}")

def lead_agent(query, product, creative_result, finance_result, inventory_result):
    """Lead Agent - Master coordinator"""
    
    print(f"🎯 Lead Agent processing coordination for: {product}")
    
    # Extract key information from each agent
    creative_summary = extract_key_points(creative_result, "creative")
    finance_summary = extract_key_points(finance_result, "finance") 
    inventory_summary = extract_key_points(inventory_result, "inventory")
    
    # Simple conflict detection
    conflicts = []
    if "review" in finance_result.lower() and "premium" in creative_result.lower():
        conflicts.append("Budget vs premium positioning")
    if "risk" in inventory_result.lower() and "45,000" in creative_result:
        conflicts.append("High reach vs inventory constraints")
    
    if not conflicts:
        conflicts = ["No major conflicts detected"]
    
    # Generate analysis
    if GEMINI_AVAILABLE:
        try:
            model = GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""As Lead Campaign Manager, analyze these agent reports:

CAMPAIGN: {query} for {product}
CREATIVE: {creative_summary}
FINANCE: {finance_summary}  
INVENTORY: {inventory_summary}
CONFLICTS: {conflicts[0]}

Provide a 3-sentence coordination summary covering:
1. Overall campaign readiness
2. Key conflict resolution 
3. Final go/no-go recommendation"""
            
            response = model.generate_content(prompt)
            if response and response.text:
                ai_analysis = response.text.strip()
                print(f"✅ Lead Agent Gemini response: {len(ai_analysis)} chars")
                return format_lead_output(ai_analysis, conflicts, query, product)
                
        except Exception as e:
            print(f"Gemini error in lead agent: {e}")
    
    # Fallback analysis
    print("📋 Using fallback lead analysis")
    if len(conflicts) == 1 and conflicts[0] == "No major conflicts detected":
        recommendation = "APPROVED FOR LAUNCH"
        analysis = f"Campaign coordination complete for {product} with all agents aligned. {conflicts[0]} - systems ready for immediate deployment. Final recommendation: Proceed with campaign execution as planned."
    else:
        recommendation = "PROCEED WITH CAUTION" 
        analysis = f"Campaign analysis identified {conflicts[0]} requiring coordination. Recommend phased rollout approach to mitigate risks. Final recommendation: Launch with enhanced monitoring protocols."
    
    return format_lead_output(analysis, conflicts, query, product, recommendation)

def extract_key_points(result, agent_type):
    """Extract key points from agent results"""
    if not result or len(result) < 50:
        return f"{agent_type} analysis completed"
    
    # Simple extraction based on agent type
    if agent_type == "creative":
        if "45,000" in result:
            return "45K reach strategy"
        return "Premium campaign strategy"
    elif agent_type == "finance":
        if "approved" in result.lower():
            return "Budget approved"
        return "Budget under review"
    elif agent_type == "inventory":
        if "EXCELLENT" in result:
            return "Stock levels excellent"
        elif "ADEQUATE" in result:
            return "Stock adequate"
        return "Stock verified"
    
    return f"{agent_type} completed"

def format_lead_output(analysis, conflicts, query, product, recommendation=None):
    """Format lead agent output"""
    
    # Determine status
    if not recommendation:
        if "APPROVED" in analysis or "ready" in analysis.lower():
            status = "🟢 APPROVED FOR LAUNCH"
        elif "CAUTION" in analysis or "monitoring" in analysis.lower():
            status = "🟡 PROCEED WITH CAUTION"
        else:
            status = "🔵 READY TO LAUNCH"
    else:
        if "APPROVED" in recommendation:
            status = "🟢 APPROVED FOR LAUNCH"
        elif "CAUTION" in recommendation:
            status = "🟡 PROCEED WITH CAUTION"
        else:
            status = "🔵 READY TO LAUNCH"
    
    formatted_output = f"""🎯 **LEAD AGENT - CAMPAIGN COORDINATION**

{status}

🧠 **Master Analysis:**
{analysis}

⚖️ **Conflict Resolution:**
• Primary Issue: {conflicts[0]}
• Resolution Status: Coordinated
• Agent Alignment: Verified

🎯 **Final Recommendation:**
Campaign coordination complete with unified strategy approved for execution."""

    print(f"📝 Formatted lead output: {len(formatted_output)} chars")
    return formatted_output
