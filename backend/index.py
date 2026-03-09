"""Vercel entry point for Mission Control backend.

This module loads the full FastAPI application from app.main and exposes it
to Vercel's Python runtime. It properly reads environment variables from Vercel
and initializes the database connection.
"""

import os
import sys
from pathlib import Path

# Ensure app module is importable
backend_root = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_root))

# Load environment variables (Vercel should inject these)
# Fallback defaults for local development only
os.environ.setdefault('ENVIRONMENT', 'production')
os.environ.setdefault('AUTH_MODE', 'clerk')  # Default to Clerk in production
os.environ.setdefault('DATABASE_URL', 'postgresql+psycopg://postgres:postgres@localhost:5432/openclaw_agency')
os.environ.setdefault('LOG_LEVEL', 'INFO')

# Import the real FastAPI application
try:
    from app.main import app
except ImportError as e:
    print(f"FATAL: Failed to import app.main: {e}", file=sys.stderr)
    raise

# Vercel exposes the ASGI app via the `app` variable
__all__ = ['app']
