from starlette.middleware.base import BaseHTTPMiddleware
from time import time
from app.api.v1.metrics import REQUEST_COUNT, REQUEST_LATENCY

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time()
        response = await call_next(request)
        duration = time() - start
        # Исключаем сам эндпоинт /metrics, чтобы не зацикливать
        if request.url.path != "/metrics":
            REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
            REQUEST_LATENCY.labels(method=request.method, endpoint=request.url.path).observe(duration)
        return response