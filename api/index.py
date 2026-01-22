import sys
import os

# Get current directory of index.py (which is /api)
current_dir = os.path.dirname(os.path.abspath(__file__))
# Get the root of the project
project_root = os.path.dirname(current_dir)

# Add the root directory to sys.path
if project_root not in sys.path:
    sys.path.append(project_root)

# Import the FastAPI app instance from backend.app.main
from backend.app.main import app

# Vercel Serverless Function Entry Point
# It expects the ASGI app to be available
