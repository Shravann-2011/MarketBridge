from unittest.mock import AsyncMock

import main

CAMPAIGN = {"query": "Plan a summer sale", "product": "sneakers"}
WHAT_IF = {"discount": 15.0, "duration": 7, "target_size": 5000, "budget": 10000}
SENTIMENT = {"product": "sneakers", "campaign_text": "Big summer sale!"}


# ---------- Health and basic routes ----------
def test_root_returns_healthy(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_health_endpoint(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_unknown_route_returns_404(client):
    assert client.get("/does-not-exist").status_code == 404


def test_cors_header_present(client):
    r = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in r.headers


# ---------- /run_campaign ----------
def test_run_campaign_success(client, monkeypatch):
    fake = {"Creative": "c", "Finance": "f", "Inventory": "i", "Final Plan": "p"}
    monkeypatch.setattr(main, "run_agents", lambda q, p: fake)
    r = client.post("/run_campaign", json=CAMPAIGN)
    assert r.status_code == 200
    assert r.json() == {"success": True, "data": fake}


def test_run_campaign_passes_inputs_to_agents(client, monkeypatch):
    seen = {}

    def fake_run(query, product):
        seen["args"] = (query, product)
        return {}

    monkeypatch.setattr(main, "run_agents", fake_run)
    client.post("/run_campaign", json=CAMPAIGN)
    assert seen["args"] == ("Plan a summer sale", "sneakers")


def test_run_campaign_missing_field_rejected(client):
    assert client.post("/run_campaign", json={"query": "x"}).status_code == 422


def test_run_campaign_handles_agent_failure(client, monkeypatch):
    def boom(q, p):
        raise RuntimeError("gemini down")

    monkeypatch.setattr(main, "run_agents", boom)
    body = client.post("/run_campaign", json=CAMPAIGN).json()
    assert body["success"] is False
    assert "gemini down" in body["error"]


# ---------- /api/what_if ----------
def test_what_if_success(client, monkeypatch):
    monkeypatch.setattr(main, "generate_scenarios", lambda *a: [{"name": "A"}, {"name": "B"}])
    r = client.post("/api/what_if", json=WHAT_IF)
    assert r.status_code == 200
    assert len(r.json()["scenarios"]) == 2


def test_what_if_passes_parameters_in_order(client, monkeypatch):
    seen = {}

    def fake_gen(discount, duration, target_size, budget):
        seen["args"] = (discount, duration, target_size, budget)
        return []

    monkeypatch.setattr(main, "generate_scenarios", fake_gen)
    client.post("/api/what_if", json=WHAT_IF)
    assert seen["args"] == (15.0, 7, 5000, 10000)


def test_what_if_wrong_type_rejected(client):
    bad = {**WHAT_IF, "duration": "abc"}
    assert client.post("/api/what_if", json=bad).status_code == 422


def test_what_if_missing_field_rejected(client):
    assert client.post("/api/what_if", json={"discount": 10}).status_code == 422


def test_what_if_handles_generator_failure(client, monkeypatch):
    def boom(*a):
        raise ValueError("bad input")

    monkeypatch.setattr(main, "generate_scenarios", boom)
    body = client.post("/api/what_if", json=WHAT_IF).json()
    assert body["success"] is False


# ---------- /api/sentiment_analysis ----------
def test_sentiment_success(client, monkeypatch):
    monkeypatch.setattr(
        main.sentiment_analyzer, "get_comprehensive_analysis",
        AsyncMock(return_value={"ai_insights": ["ok"]}),
    )
    body = client.post("/api/sentiment_analysis", json=SENTIMENT).json()
    assert body["success"] is True
    assert body["data"] == {"ai_insights": ["ok"]}


def test_sentiment_falls_back_when_analyzer_fails(client, monkeypatch):
    monkeypatch.setattr(
        main.sentiment_analyzer, "get_comprehensive_analysis",
        AsyncMock(side_effect=RuntimeError("api error")),
    )
    body = client.post("/api/sentiment_analysis", json=SENTIMENT).json()
    assert body["success"] is True
    assert body["data"]["trend_analysis"]["keywords"][0]["keyword"] == "sneakers"


def test_sentiment_missing_field_rejected(client):
    assert client.post("/api/sentiment_analysis", json={"product": "x"}).status_code == 422


# ---------- WebSocket ----------
def test_websocket_accepts_connection_and_message(client):
    with client.websocket_connect("/ws/test-client") as ws:
        ws.send_text("hello")