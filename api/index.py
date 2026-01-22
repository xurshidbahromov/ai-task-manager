import sys
import os

# Add the project root to sys.path so 'backend' can be imported
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from backend.app.main import app
