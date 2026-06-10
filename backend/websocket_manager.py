import asyncio
import json
from typing import Dict, List, Set
from fastapi import WebSocket
import time

class AgentWebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.campaign_sessions: Dict[str, Dict] = {}
        self.agent_states: Dict[str, Dict] = {
            "creative": {"status": "idle", "progress": 0, "message": "Ready"},
            "finance": {"status": "idle", "progress": 0, "message": "Ready"}, 
            "inventory": {"status": "idle", "progress": 0, "message": "Ready"}
        }
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Connect new client"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"🔌 Client {client_id} connected")
        
        # Send current agent states
        await self.send_to_client(client_id, {
            "type": "agent_states",
            "data": self.agent_states
        })
    
    def disconnect(self, client_id: str):
        """Disconnect client"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"🔌 Client {client_id} disconnected")
    
    async def send_to_client(self, client_id: str, message: dict):
        """Send message to specific client"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception as e:
                print(f"Error sending to {client_id}: {e}")
                self.disconnect(client_id)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all clients"""
        for client_id in list(self.active_connections.keys()):
            await self.send_to_client(client_id, message)
    
    async def update_agent_status(self, agent_name: str, status: str, progress: int = 0, message: str = ""):
        """Update agent status and broadcast"""
        self.agent_states[agent_name] = {
            "status": status,
            "progress": progress,
            "message": message,
            "timestamp": time.time()
        }
        
        await self.broadcast({
            "type": "agent_update",
            "agent": agent_name,
            "data": self.agent_states[agent_name]
        })
        
        print(f"🤖 {agent_name.title()}: {status} - {message} ({progress}%)")
    
    async def agent_message(self, agent_name: str, message: str, message_type: str = "info"):
        """Send agent message"""
        await self.broadcast({
            "type": "agent_message",
            "agent": agent_name,
            "message": message,
            "message_type": message_type,
            "timestamp": time.time()
        })
    
    async def collaboration_event(self, event_type: str, data: dict):
        """Broadcast collaboration events"""
        await self.broadcast({
            "type": "collaboration",
            "event": event_type,
            "data": data,
            "timestamp": time.time()
        })

# Global WebSocket manager
ws_manager = AgentWebSocketManager()
