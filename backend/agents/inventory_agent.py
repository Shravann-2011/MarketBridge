import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI configured for Inventory Agent")
except Exception:
    GEMINI_AVAILABLE = False
    print("⚠️ Gemini AI not available for Inventory Agent")

def inventory_agent(query, product):
    """Enhanced Inventory Agent - CONCISE VERSION"""
    
    print(f"📦 Inventory Agent processing: {query} for {product}")
    
    # Simplified product matching
    if isinstance(query, dict):
        # Old signature compatibility
        product_name = str(product) if not isinstance(product, dict) else "Generic Product"
        stock_level = 850
    else:
        product_name = str(product)
        # Determine stock level based on product type
        if "headphones" in product_name.lower():
            stock_level = 1200
        elif "watch" in product_name.lower():
            stock_level = 800
        elif "speaker" in product_name.lower():
            stock_level = 950
        else:
            stock_level = 850
    
    available = stock_level - 200  # Reserve 200 units
    demand = estimate_demand(query, product_name)
    
    if GEMINI_AVAILABLE:
        try:
            model = GenerativeModel("gemini-2.0-flash")
            prompt = f"""Inventory Analysis for {product_name}:
Available Stock: {available} units
Estimated Campaign Demand: {demand} units

Provide a CONCISE 2-sentence inventory assessment covering:
1. Stock adequacy for campaign goals
2. Supply chain status and recommendations"""
            
            response = model.generate_content(prompt)
            if response and response.text:
                print(f"✅ Gemini inventory response: {len(response.text)} chars")
                return format_inventory_output_concise(response.text.strip(), product_name, available, demand)
        except Exception as e:
            print(f"Gemini error in inventory: {e}")
    
    # Concise fallback
    print("📋 Using fallback inventory analysis")
    if available >= demand * 1.5:
        status = "🟢 EXCELLENT"
        analysis = f"Inventory levels excellent with {available} units available against {demand} projected demand. Supply chain healthy with no restocking concerns for campaign duration."
    elif available >= demand:
        status = "🟡 ADEQUATE" 
        analysis = f"Adequate stock coverage with {available} units meeting {demand} unit demand projection. Recommend monitoring daily levels during campaign peak."
    else:
        status = "🔴 AT RISK"
        analysis = f"Stock risk identified with only {available} units against {demand} projected demand. Immediate restocking required before campaign launch."
    
    return format_inventory_output_concise(analysis, product_name, available, demand, status)

def estimate_demand(query, product):
    """Simplified demand estimation"""
    base_demand = 200
    query_str = str(query).lower()
    
    if "launch" in query_str:
        base_demand = 350
    elif "sale" in query_str or "promotion" in query_str:
        base_demand = 450
    
    return base_demand

def format_inventory_output_concise(analysis, product_name, available, demand, status=None):
    """Format inventory output - CONCISE VERSION"""
    
    if not status:
        if available >= demand * 1.5:
            status = "🟢 EXCELLENT"
        elif available >= demand:
            status = "🟡 ADEQUATE"
        else:
            status = "🔴 AT RISK"
    
    # Add timestamp for cache busting
    timestamp = datetime.utcnow().strftime("%H%M%S")
    
    formatted_output = f"""📦 **INVENTORY STATUS**

{analysis}

**Stock Summary:**
• Product: {product_name}
• Available: {available} units
• Demand: {demand} units
• Status: {status}
<!--{timestamp}-->"""

    print(f"📝 Formatted inventory output: {len(formatted_output)} chars")
    return formatted_output
