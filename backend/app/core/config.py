from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/parseflow"

    llm_provider: str = "gemini"
    llm_api_key: str = ""
    llm_model: str = "gemini-2.5-flash-lite"
    llm_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"

    max_file_size_mb: int = 5
    max_pages: int = 10
    rate_limit_per_hour: int = 3

    storage_path: str = "./data/pdfs"
    cors_origins: str = "http://localhost:5173"


settings = Settings()