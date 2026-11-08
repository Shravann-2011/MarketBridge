import io, sys, time, types, logging, statistics
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import MagicMock

sys.path.insert(0, str(Path(__file__).resolve().parent / "backend"))

fake_am = types.ModuleType("agent_manager")
fake_am.run_agents = MagicMock()
sys.modules["agent_manager"] = fake_am


class _Analyzer:
    async def get_comprehensive_analysis(self, product, text):
        return {}


fake_sent = types.ModuleType("sentiment_trend_analyzer")
fake_sent.SentimentTrendAnalyzer = _Analyzer
sys.modules["sentiment_trend_analyzer"] = fake_sent

from fastapi.testclient import TestClient
import main

logging.disable(logging.CRITICAL)
client = TestClient(main.app)
payload = {"discount": 15.0, "duration": 7, "target_size": 5000, "budget": 10000}

with redirect_stdout(io.StringIO()):
    first = client.post("/api/what_if", json=payload)
body = first.json()
print("status:", first.status_code, "| scenarios returned:", len(body.get("scenarios", [])))
if "scenarios" not in body:
    print("UNEXPECTED RESPONSE:", str(body)[:300])
    sys.exit(1)

times = []
with redirect_stdout(io.StringIO()):
    for _ in range(200):
        t = time.perf_counter()
        client.post("/api/what_if", json=payload)
        times.append((time.perf_counter() - t) * 1000)

times.sort()
print("median:", round(statistics.median(times), 1), "ms | p95:", round(times[int(len(times) * 0.95) - 1], 1), "ms | runs: 200")
