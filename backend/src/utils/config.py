"""
Application configuration settings
"""
from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FreshMart AI Retention"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # API Keys
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    HUGGINGFACE_TOKEN: str = ""

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Base paths
    PROJECT_ROOT: Path = Path(__file__).resolve().parents[3]
    DATA_DIR_NAME: str = "data"
    OUTPUTS_DIR_NAME: str = "outputs"

    @property
    def data_dir(self) -> Path:
        """
        Absolute path to data directory
        """
        path = self.PROJECT_ROOT / self.DATA_DIR_NAME
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def outputs_dir(self) -> Path:
        """
        Absolute path to outputs directory
        """
        path = self.PROJECT_ROOT / self.OUTPUTS_DIR_NAME
        path.mkdir(parents=True, exist_ok=True)
        return path

    class Config:
        env_file = ".env"
        extra = "ignore"


# Global settings instance (FAIL FAST – GOOD PRACTICE)
settings = Settings()
