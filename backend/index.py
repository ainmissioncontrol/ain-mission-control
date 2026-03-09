import os
import sys

# Ensure app module is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set production defaults
os.environ.setdefault("ENVIRONMENT", "production")
os.environ.setdefault("AUTH_MODE", "clerk")

# Import the real FastAPI application
from app.main import app
