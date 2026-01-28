"""
AI message generator using Hugging Face
(Supporting role, SMS-only)
"""
import requests
from typing import Optional, Dict
import logging

from src.utils.config import settings   # ✅ FIXED IMPORT

logger = logging.getLogger(__name__)


class AIMessageGenerator:
    def __init__(self):
        self.api_token = settings.HUGGINGFACE_TOKEN
        self.model = "google/flan-t5-small"  # Instruction-tuned, better for SMS
        self.headers = (
            {"Authorization": f"Bearer {self.api_token}"}
            if self.api_token
            else {}
        )

    def generate_retention_message(self, customer_data: Dict) -> Optional[str]:
        """
        Generate a personalized SMS retention message using AI.
        Returns None if AI fails (fallback will be used).
        """
        if not self.api_token:
            logger.warning("Hugging Face token not configured")
            return None

        prompt = self._create_prompt(customer_data)

        try:
            response = requests.post(
                f"https://api-inference.huggingface.co/models/{self.model}",
                headers=self.headers,
                json={"inputs": prompt},
                timeout=20,
            )

            if response.status_code != 200:
                logger.warning(f"Hugging Face API error: {response.status_code}")
                return None

            result = response.json()
            message = self._extract_message(result)

            return message

        except Exception as e:
            logger.error(f"AI message generation failed: {e}")
            return None

    def _create_prompt(self, customer_data: Dict) -> str:
        """
        Create an instruction-style prompt for SMS generation
        """
        name = customer_data.get("name", "Customer")
        days_since = customer_data.get("days_since", 30)

        return (
            "Write a friendly retail SMS under 160 characters.\n"
            f"Customer name: {name}\n"
            f"Last visit: {days_since} days ago\n"
            "Offer: 20% discount\n"
            "Tone: warm, simple, professional\n"
            "Do not use emojis.\n"
        )

    def _extract_message(self, result) -> Optional[str]:
        """
        Extract and sanitize AI output
        """
        try:
            if isinstance(result, list) and "generated_text" in result[0]:
                message = result[0]["generated_text"].strip()
            elif isinstance(result, dict) and "generated_text" in result:
                message = result["generated_text"].strip()
            else:
                return None

            # Enforce SMS length
            if len(message) < 20:
                return None

            return message[:160]

        except Exception:
            return None

    def generate_fallback_message(self, customer_data: Dict) -> str:
        """
        Deterministic fallback SMS (used when AI fails)
        """
        name = customer_data.get("name", "Customer")
        days = customer_data.get("days_since", 30)

        if days > 60:
            offer = "25%"
            line = "We really miss you!"
        elif days > 30:
            offer = "20%"
            line = "We've missed you!"
        else:
            offer = "15%"
            line = "We miss you!"

        return (
            f"Hi {name}, {line} "
            f"Enjoy {offer} off your next FreshMart visit. "
            f"Use code FRESH{days % 100:02d}. See you soon!"
        )
