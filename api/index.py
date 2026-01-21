import sys
import os

# Add the project root to sys.path so Vercel can find 'backend' module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

# Vercel Serverless Function Entry Point
# It expects the ASGI app to be available
