from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1 import health, metrics, auth, notes
from app.utils.metrics_middleware import MetricsMiddleware

# Создаём таблицы (в реальном проекте используйте Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes API", version="1.0")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware для сбора метрик
app.add_middleware(MetricsMiddleware)

# Подключаем роутеры
app.include_router(health.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(notes.router, prefix="/api/v1")

# Корневой эндпоинт (опционально)
@app.get("/")
def root():
    return {"message": "Notes API is running"}