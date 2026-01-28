"""
SMS service using Twilio
"""
from twilio.rest import Client
from typing import Dict, List
import time
import logging

from src.utils.config import settings   # ✅ FIXED IMPORT

logger = logging.getLogger(__name__)


class SMSService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.from_number = settings.TWILIO_PHONE_NUMBER

        if all([self.account_sid, self.auth_token, self.from_number]):
            self.client = Client(self.account_sid, self.auth_token)
            logger.info("Twilio SMS service initialized")
        else:
            self.client = None
            logger.warning("Twilio credentials not fully configured")

    def is_configured(self) -> bool:
        """Check if SMS service is properly configured"""
        return self.client is not None

    def send_sms(self, to_number: str, message: str) -> Dict:
        """
        Send a single SMS
        """
        if not self.is_configured():
            return {
                "success": False,
                "error": "SMS service not configured",
                "fallback": True,
            }

        try:
            sms_message = self._format_sms_message(message)

            twilio_message = self.client.messages.create(
                body=sms_message,
                from_=self.from_number,
                to=to_number,
            )

            logger.info(
                f"SMS sent to {to_number[:8]}**** | SID: {twilio_message.sid}"
            )

            return {
                "success": True,
                "message_sid": twilio_message.sid,
                "to": to_number,
                "status": "sent",
            }

        except Exception as e:
            logger.error(f"SMS sending failed to {to_number}: {e}")
            return {
                "success": False,
                "error": str(e),
                "to": to_number,
            }

    def send_batch_sms(self, customers: List[Dict]) -> List[Dict]:
        """
        Send SMS to multiple customers with rate limiting
        """
        results = []

        if not self.is_configured():
            return [
                {
                    "success": False,
                    "error": "SMS service not configured",
                    "customer": "ALL",
                }
            ]

        logger.info(f"Starting batch SMS campaign for {len(customers)} customers")

        for index, customer in enumerate(customers, start=1):
            name = customer.get("name", "Customer")
            phone = customer.get("phone")
            message = customer.get("message")

            if not phone or not message:
                results.append(
                    {
                        "success": False,
                        "error": "Missing phone or message",
                        "customer": name,
                    }
                )
                continue

            result = self.send_sms(phone, message)
            result["customer"] = name
            results.append(result)

            # Rate limit: 1 SMS every 2 seconds
            if index < len(customers):
                time.sleep(2)

            if index % 10 == 0:
                logger.info(f"Progress: {index}/{len(customers)} SMS sent")

        successful = sum(1 for r in results if r.get("success"))
        logger.info(
            f"Batch campaign complete: {successful}/{len(customers)} successful"
        )

        return results

    def _format_sms_message(self, message: str) -> str:
        """
        Format message for SMS constraints
        """
        if len(message) > 300:
            message = message[:297] + "..."

        if "STOP" not in message.upper():
            message += "\n\nReply STOP to opt-out."

        return message

    def test_connection(self) -> Dict:
        """
        Test Twilio connection
        """
        if not self.is_configured():
            return {"success": False, "error": "SMS service not configured"}

        try:
            account = self.client.api.accounts(self.account_sid).fetch()
            return {
                "success": True,
                "account_status": account.status,
                "from_number": self.from_number,
            }
        except Exception as e:
            return {"success": False, "error": str(e)}


# Global singleton instance
sms_service = SMSService()
