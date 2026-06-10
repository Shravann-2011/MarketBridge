import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI configured successfully")
except Exception as e:
    GEMINI_AVAILABLE = False
    print(f"⚠️ Gemini AI not available: {e}")

def creative_agent(query, product):
    """Enhanced Creative Agent - CONCISE VERSION"""
    
    print(f"🎨 Creative Agent processing: {query} for {product}")
    
    if GEMINI_AVAILABLE:
        try:
            model = GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""Product: {product}
Campaign Goal: {query}

Create a CONCISE marketing strategy in exactly 3 sentences covering:
1. Campaign theme and target audience  
2. Key promotional tactics and channels
3. Expected reach and conversion metrics

Be specific and data-driven."""
            
            response = model.generate_content(prompt)
            if response and response.text:
                ai_suggestion = response.text.strip()
                print(f"✅ Gemini response received: {len(ai_suggestion)} chars")
                return format_creative_output_concise(ai_suggestion)
        except Exception as e:
            print(f"Gemini error: {e}")

    # Concise fallback
    print("📋 Using fallback creative strategy")
    fallback_strategy = f"""Launch premium {product} campaign targeting tech professionals aged 25-35 with personalized messaging and 15% early-adopter discount. Deploy through LinkedIn, Instagram, and email marketing with A/B testing for optimization. Expected reach: 45,000+ prospects with 2.5-4% conversion rate generating 150+ qualified leads."""
    
    return format_creative_output_concise(fallback_strategy)

def format_creative_output_concise(content):
    """Format creative output - CONCISE VERSION"""
    
    formatted_output = f"""🎨 **CREATIVE STRATEGY**

{content}

**Key Metrics:**
• Target Reach: 45,000+ prospects  
• Conversion Rate: 2.5-4%
• Timeline: 4-6 weeks"""

    print(f"📝 Formatted creative output: {len(formatted_output)} chars")
    return formatted_output
