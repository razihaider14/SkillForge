import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "SkillForge")
    ENV: str = os.getenv("ENV", "development")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    GITHUB_TOKEN: str | None = os.getenv("GITHUB_TOKEN")

    # Comma-separated list of origins allowed to call this API from a
    # browser (see app.main's CORSMiddleware setup). Defaults to the local
    # Next.js dev server so `npm run dev` works against a local backend with
    # zero configuration; production deployments must override this via the
    # environment, e.g. FRONTEND_ORIGINS="https://skillforge.example.com".
    FRONTEND_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]


settings = Settings()
