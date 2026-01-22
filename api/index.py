import sys
import os

# Add project root and backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
backend_path = os.path.join(project_root, 'backend')

if project_root not in sys.path:
    sys.path.append(project_root)
if backend_path not in sys.path:
    sys.path.insert(0, backend_path) # Insert at the beginning to give priority

try:
    # Try importing the FastAPI app instance
    from app.main import app
except ImportError:
    # Fallback to full path import if necessary
    from backend.app.main import app
except Exception as e:
    print(f"Error starting serverless function: {e}")
    raise e
