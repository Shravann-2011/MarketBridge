import sys
import types
from pathlib import Path
from unittest.mock import MagicMock

import pytest

# Make backend modules importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

# Stand-ins for the LLM-heavy modules, registered BEFORE main.py imports them
fake_agent_manager = types.ModuleType("agent_manager")
fake_agent_manager.run_agents = MagicMock(name="run_agents")
sys.modules["agent_manager"] = fake_agent_manager


class _FakeAnalyzer:
    async def get_comprehensive_analysis(self, product, text):
        return {}


fake_sentiment = types.ModuleType("sentiment_trend_analyzer")
fake_sentiment.SentimentTrendAnalyzer = _FakeAnalyzer
sys.modules["sentiment_trend_analyzer"] = fake_sentiment

from fastapi.testclient import TestClient  # noqa: E402
import main  # noqa: E402


@pytest.fixture
def client():
    return TestClient(main.app)
