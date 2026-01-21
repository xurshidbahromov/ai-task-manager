import sys
import os

# Get project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)

# Add project root to path
sys.path.append(project_root)
# Add 'backend' directory to path so 'app' module can be found
sys.path.append(os.path.join(project_root, 'backend'))

from backend.app.main import app

# Vercel Serverless Function Entry Point
# It expects the ASGI app to be available
