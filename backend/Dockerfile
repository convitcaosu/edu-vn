# ──────────────────────────────────────────────────────────────
# Backend Dockerfile — EduVNU Django API
#
# Base: Python 3.11 slim (Debian Bookworm)
# Cài ODBC Driver 18 for SQL Server (Microsoft official repo)
# Chạy gunicorn trên port 8000
# ──────────────────────────────────────────────────────────────

FROM python:3.11-slim-bookworm

# --- System deps + ODBC Driver 18 for SQL Server (Microsoft repo) ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        gnupg \
        unixodbc \
        unixodbc-dev \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
       > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Python deps ---
WORKDIR /app
COPY requirements.core.txt .
RUN pip install --no-cache-dir -r requirements.core.txt

# --- App code ---
COPY . .

# Media uploads directory
RUN mkdir -p /app/media /app/static

EXPOSE 8000

# Chạy collectstatic rồi gunicorn
CMD ["sh", "-c", \
     "python manage.py collectstatic --noinput && \
      gunicorn core.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 2 \
        --timeout 120 \
        --access-logfile - \
        --error-logfile -"]
