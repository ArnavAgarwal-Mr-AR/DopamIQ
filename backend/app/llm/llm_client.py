import requests
from app.config.settings import settings

class LLMClient:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.model = settings.LLM_MODEL
        self.timeout = settings.LLM_TIMEOUT

    def generate(self, prompt: str) -> str:
        """
        Basic HTTP client (replace with OpenAI / local model later)
        """

        if self.provider == "mock":
            return self._mock_response(prompt)

        # Example generic API call (customize for provider)
        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=self.timeout
            )

            data = response.json()
            return data["choices"][0]["message"]["content"]

        except Exception:
            return "LLM request failed"

    def _mock_response(self, prompt: str) -> str:
        return "Mock response: user shows moderate impulsivity and late-night usage."