import requests
import warnings
from app.config.settings import settings

class LLMClient:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.model_name = settings.LLM_MODEL
        self.timeout = settings.LLM_TIMEOUT
        
        self._local_model = None
        self._local_tokenizer = None

    def _load_local_model(self):
        if self._local_model is None:
            print(f"Loading local model {self.model_name} into memory. This may take a while...")
            try:
                from transformers import AutoTokenizer, AutoModelForCausalLM
                import torch
                
                self._local_tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                
                # Check for Apple Silicon (MPS) or fallback to CPU/CUDA
                device = "cuda" if torch.cuda.is_available() else "cpu"
                
                self._local_model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    device_map="auto" if device == "cuda" else None,
                    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                    low_cpu_mem_usage=True
                )
                if device == "cpu":
                    self._local_model.to(device)
                    
                print("Local model successfully mapped to hardware!")
            except Exception as e:
                print(f"Failed to load HuggingFace Transformers logic: {e}")
                self.provider = "mock" # Fallback safely

    def generate(self, prompt: str) -> str:
        """
        Executes inference context via local framework or external API
        """

        if self.provider == "mock":
            return self._mock_response(prompt)
            
        if self.provider == "local":
            self._load_local_model()
            if self._local_tokenizer and self._local_model:
                import torch
                inputs = self._local_tokenizer(prompt, return_tensors="pt").to(self._local_model.device)
                
                with torch.no_grad():
                    outputs = self._local_model.generate(
                        **inputs,
                        max_new_tokens=400,
                        temperature=0.7,
                        do_sample=True,
                    )
                
                # Strip out the prompt prompt text from response output
                response_text = self._local_tokenizer.decode(outputs[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
                return response_text

        # Example generic API call (customize for provider)
        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model_name,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=self.timeout
            )

            data = response.json()
            return data["choices"][0]["message"]["content"]

        except Exception:
            return "LLM request failed"

    def _mock_response(self, prompt: str) -> str:
        return '{ "title": "Late Night Scroller", "summary": "User shows moderate impulsivity and high usage late at night.", "traits": ["Night Owl", "Binger"] }'