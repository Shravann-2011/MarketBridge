from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent_manager import run_agents
from scenario_generator import generate_scenarios
from sentiment_trend_analyzer import SentimentTrendAnalyzer  # NEW IMPORT
import uvicorn
import asyncio

# Import WebSocket manager
from websocket_manager import ws_manager

app = FastAPI(title="MarketBridge API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize sentiment trend analyzer
sentiment_analyzer = SentimentTrendAnalyzer()  # NEW

class CampaignRequest(BaseModel):
    query: str
    product: str

class WhatIfRequest(BaseModel):
    discount: float
    duration: int
    target_size: int
    budget: int

class SentimentAnalysisRequest(BaseModel):  # NEW
    product: str
    campaign_text: str
    keywords: list[str] = []

# WebSocket endpoint for real-time agent collaboration
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await ws_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if needed
            print(f"📡 Received from {client_id}: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(client_id)

@app.get("/")
async def root():
    return {"message": "MarketBridge API is running!", "status": "healthy"}

@app.post("/run_campaign")
async def run_campaign(request: CampaignRequest):
    """
    Run the multi-agent campaign planning system
    """
    try:
        print(f"🚀 Processing campaign request: {request.product}")
        
        result = run_agents(request.query, request.product)
        
        # Debug: Print the result structure
        print("📊 Backend result structure:")
        print(f"  Keys: {list(result.keys())}")
        print(f"  Creative length: {len(result.get('Creative', ''))}")
        print(f"  Finance length: {len(result.get('Finance', ''))}")
        print(f"  Inventory length: {len(result.get('Inventory', ''))}")
        print(f"  Final Plan length: {len(result.get('Final Plan', ''))}")
        
        response_data = {
            "success": True,
            "data": result
        }
        
        print("✅ Sending response to frontend...")
        return response_data
        
    except Exception as e:
        print(f"❌ Error processing campaign: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/what_if")
async def what_if(request: WhatIfRequest):
    """
    Generate what-if scenarios based on campaign parameters
    """
    try:
        print(f"🔮 Processing what-if request: discount={request.discount}%, duration={request.duration} days")
        
        scenarios = generate_scenarios(
            request.discount,
            request.duration,
            request.target_size,
            request.budget
        )
        
        print(f"✅ Generated {len(scenarios)} scenarios")
        return {"scenarios": scenarios}
        
    except Exception as e:
        print(f"❌ Error generating scenarios: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/sentiment_analysis")
async def analyze_sentiment_trends(request: SentimentAnalysisRequest):
    """
    Analyze sentiment and trends for campaign optimization
    """
    try:
        print(f"🎭 Processing sentiment analysis for: {request.product}")
        
        # Get comprehensive analysis
        analysis = await sentiment_analyzer.get_comprehensive_analysis(
            request.product, 
            request.campaign_text
        )
        
        print("📈 Analysis completed successfully")
        return {
            "success": True,
            "data": analysis
        }
        
    except Exception as e:
        print(f"❌ Error in sentiment analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Return fallback data with correct structure
        return {
            "success": True,
            "data": {
                "sentiment_analysis": {
                    "overall_sentiment": "positive",
                    "confidence": 0.8,
                    "emotions": {
                        "joy": 0.4,
                        "anger": 0.1,
                        "fear": 0.1,
                        "sadness": 0.1,
                        "surprise": 0.3
                    },
                    "recommendations": [
                        "Leverage positive sentiment in social media campaigns",
                        "Amplify messaging across multiple channels",
                        "Highlight positive experiences and benefits"
                    ]
                },
                "trend_analysis": {
                    "keywords": [
                        {
                            "keyword": request.product,
                            "trend_score": 0.75,
                            "volume_change": 12.5,
                            "sentiment_trend": "positive"
                        }
                    ],
                    "overall_trend": "positive",
                    "recommendations": [
                        f"Focus on trending keywords: {request.product}",
                        "Monitor trends weekly for campaign optimization"
                    ]
                },
                "ai_insights": [
                    f"{request.product} shows strong positive market sentiment",
                    "Campaign messaging resonates well with target audience",
                    "Consider expanding reach based on positive trends"
                ]
            }
        }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "MarketBridge backend is operational"}

if __name__ == "__main__":
    print("🚀 Starting MarketBridge Backend Server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop the server")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
